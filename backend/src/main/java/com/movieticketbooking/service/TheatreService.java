package com.movieticketbooking.service;

import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.util.FileCopyUtils;

import com.movieticketbooking.dao.BookingDao;
import com.movieticketbooking.dao.LocationDao;
import com.movieticketbooking.dao.MovieDao;
import com.movieticketbooking.dao.ShowDao;
import com.movieticketbooking.dao.TheatreDao;
import com.movieticketbooking.dao.UserDao;
import com.movieticketbooking.dto.AddTheatreRequest;
import com.movieticketbooking.dto.CommonApiResponse;
import com.movieticketbooking.dto.TheatreResponse;
import com.movieticketbooking.dto.UpdateTheatreDetailRequest;
import com.movieticketbooking.entity.Booking;
import com.movieticketbooking.entity.Location;
import com.movieticketbooking.entity.Movie;
import com.movieticketbooking.entity.Shows;
import com.movieticketbooking.entity.Theatre;
import com.movieticketbooking.entity.User;
import com.movieticketbooking.exception.TheatreSaveFailedException;
import com.movieticketbooking.utility.Constants.ActiveStatus;
import com.movieticketbooking.utility.Constants.BookingStatus;
import com.movieticketbooking.utility.Constants.ShowStatus;
import com.movieticketbooking.utility.Constants.TheatreStatus;
import com.movieticketbooking.utility.Constants.UserRole;
import com.movieticketbooking.utility.StorageService;

import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;

@Component
@Transactional
public class TheatreService {

	private final Logger LOG = LoggerFactory.getLogger(TheatreService.class);

	@Autowired
	private UserDao userDao;

	@Autowired
	private TheatreDao theatreDao;

	@Autowired
	private StorageService storageService;

	@Autowired
	private LocationDao locationDao;

	@Autowired
	private MovieDao movieDao;

	@Autowired
	private ShowDao showDao;

	@Autowired
	private BookingDao bookingDao;
	
	
	
	public ResponseEntity<TheatreResponse> registerTheatre(AddTheatreRequest request) {

	    LOG.info("Request received for adding the theatre ");

	    TheatreResponse response = new TheatreResponse();

	    if (request == null) {
	        response.setResponseMessage("Request is null");
	        response.setSuccess(false);
	        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
	    }

	    if (request.getManagerId() == 0) {
	        response.setResponseMessage("Missing manager id");
	        response.setSuccess(false);
	        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
	    }

	    if (request.getLocationId() == 0) {
	        response.setResponseMessage("Missing location id");
	        response.setSuccess(false);
	        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
	    }

	    Location location = this.locationDao.findById(request.getLocationId()).orElse(null);
	    if (location == null) {
	        response.setResponseMessage("Location not found!");
	        response.setSuccess(false);
	        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
	    }

	    User user = this.userDao.findById(request.getManagerId()).orElse(null);
	    if (user == null || !user.getRole().equals(UserRole.ROLE_THEATRE.value())) {
	        response.setResponseMessage("Manager not found!");
	        response.setSuccess(false);
	        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
	    }

	    // store theatre image
	    String theatreImage = this.storageService.store(request.getImage());

	    // create new theatre
	    Theatre theatre = new Theatre();
	    theatre.setAddress(request.getAddress());
	    theatre.setDescription(request.getDescription());
	    theatre.setEmailId(request.getEmailId());
	    theatre.setImage(theatreImage);
	    theatre.setLatitude(request.getLatitude());
	    theatre.setLongitude(request.getLongitude());
	    theatre.setLocation(location);
	    theatre.setManager(user);
	    theatre.setManagerContact(request.getManagerContact());
	    theatre.setName(request.getName());

	    // 🔥 NEW LOGIC → Default new theatre status to "In Progress"
	    theatre.setStatus("In Progress");

	    Theatre savedTheatre = this.theatreDao.save(theatre);

	    if (savedTheatre == null) {
	        throw new TheatreSaveFailedException("Failed to add the theatre!");
	    }

	    // Link theatre to manager
	    user.setTheatre(savedTheatre);
	    this.userDao.save(user);

	    response.setTheatres(Arrays.asList(savedTheatre));
	    response.setResponseMessage("Theatre added successfully!");
	    response.setSuccess(true);

	    return new ResponseEntity<>(response, HttpStatus.OK);
	}



	
	public ResponseEntity<TheatreResponse> updateTheatreStatus(int theatreId, String status) {

	    LOG.info("Request received for updating the theatre status");

	    TheatreResponse response = new TheatreResponse();

	    // Validate input
	    if (theatreId == 0 || status == null || status.trim().isEmpty()) {
	        response.setResponseMessage("Missing input!!!");
	        response.setSuccess(false);
	        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
	    }

	    // Allowed statuses
	    List<String> allowedStatuses = Arrays.asList("In Progress", "Approved", "Rejected");
	    if (!allowedStatuses.contains(status)) {
	        response.setResponseMessage("Invalid status value!");
	        response.setSuccess(false);
	        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
	    }

	    Theatre theatre = this.theatreDao.findById(theatreId).orElse(null);
	    if (theatre == null) {
	        response.setResponseMessage("Theatre not found!!!");
	        response.setSuccess(false);
	        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
	    }

	    String currentStatus = theatre.getStatus();

	    // BUSINESS RULES
	    if (currentStatus.equals("Approved") && status.equals("Rejected")) {
	        response.setResponseMessage("Approved theatres cannot be directly rejected!");
	        response.setSuccess(false);
	        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
	    }

	    // Allowed transitions:
	    // In Progress → Approved
	    // In Progress → Rejected
	    // Approved → In Progress
	    // Rejected → In Progress

	    theatre.setStatus(status);
	    Theatre updated = theatreDao.save(theatre);

	    response.setTheatres(Arrays.asList(updated));
	    response.setSuccess(true);
	    response.setResponseMessage("Theatre status updated successfully!");
	    return new ResponseEntity<>(response, HttpStatus.OK);
	}



	public ResponseEntity<TheatreResponse> fetchTheatreByStatus(String status) {

	    LOG.info("Request received for fetching theatres by status");

	    TheatreResponse response = new TheatreResponse();

	    if (status == null || status.trim().isEmpty()) {
	        response.setResponseMessage("Missing status input!");
	        response.setSuccess(false);
	        return ResponseEntity.badRequest().body(response);
	    }

	    // Fetch theatres by EXACT status
	    List<Theatre> theatres = theatreDao.findByStatus(status);

	    if (theatres.isEmpty()) {
	        response.setResponseMessage("No theatres found");
	        response.setSuccess(false);
	        return ResponseEntity.ok(response);
	    }

	    response.setTheatres(theatres);
	    response.setResponseMessage("Theatres fetched successfully");
	    response.setSuccess(true);

	    return ResponseEntity.ok(response);
	}



	public ResponseEntity<TheatreResponse> fetchTheatreByLocation(Integer locationId) {

	    LOG.info("Request received for fetching theatres by location");

	    TheatreResponse response = new TheatreResponse();

	    if (locationId == null || locationId == 0) {
	        response.setResponseMessage("Missing location input!");
	        response.setSuccess(false);
	        return ResponseEntity.badRequest().body(response);
	    }

	    Location location = locationDao.findById(locationId).orElse(null);

	    if (location == null) {
	        response.setResponseMessage("Location not found!");
	        response.setSuccess(false);
	        return ResponseEntity.badRequest().body(response);
	    }

	    // Fetch only APPROVED theatres for that location
	    List<Theatre> theatres =
	            theatreDao.findByLocationAndStatus(location, TheatreStatus.APPROVED.value());

	    if (theatres.isEmpty()) {
	        response.setResponseMessage("No theatres found");
	        response.setSuccess(false);
	        return ResponseEntity.ok(response);
	    }

	    response.setTheatres(theatres);
	    response.setResponseMessage("Theatres fetched successfully");
	    response.setSuccess(true);

	    return ResponseEntity.ok(response);
	}


	
	
	public ResponseEntity<CommonApiResponse> deleteTheatre(int theatreId) {

	    LOG.info("Request received for deleting theatre");

	    CommonApiResponse response = new CommonApiResponse();

	    if (theatreId == 0) {
	        response.setResponseMessage("Missing theatre Id");
	        response.setSuccess(false);
	        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
	    }

	    Theatre theatre = this.theatreDao.findById(theatreId).orElse(null);

	    if (theatre == null) {
	        response.setResponseMessage("Theatre not found!");
	        response.setSuccess(false);
	        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
	    }

	    // NEW LOGIC → Mark theatre as Rejected
	    theatre.setStatus("Rejected");
	    theatreDao.save(theatre);

	    response.setResponseMessage("Theatre marked as Rejected successfully!");
	    response.setSuccess(true);
	    return new ResponseEntity<>(response, HttpStatus.OK);
	}



	public ResponseEntity<CommonApiResponse> updateTheatreDetails(UpdateTheatreDetailRequest request) {

		LOG.info("Request received for updating the theatre");

		CommonApiResponse response = new CommonApiResponse();

		if (request == null) {
			response.setResponseMessage("request is null");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		if (request.getTheatreId() == 0) {
			response.setResponseMessage("missing theatre id");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		Theatre theatre = this.theatreDao.findById(request.getTheatreId()).orElse(null);

		if (theatre == null) {
			response.setResponseMessage("theatre not found!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		theatre.setAddress(request.getAddress());
		theatre.setDescription(request.getDescription());
		theatre.setEmailId(request.getEmailId());
		theatre.setManagerContact(request.getManagerContact());
		theatre.setName(request.getName());

		Theatre savedTheatre = this.theatreDao.save(theatre);

		if (savedTheatre == null) {
			throw new TheatreSaveFailedException("Failed to update the Theatre detail!!!");
		}

		response.setResponseMessage("Theatre Detail updated successful!!!");
		response.setSuccess(true);

		return new ResponseEntity<CommonApiResponse>(response, HttpStatus.OK);
	}

	public ResponseEntity<CommonApiResponse> updateTheatreImage(AddTheatreRequest request) {

		LOG.info("request received for update theatre images");

		CommonApiResponse response = new CommonApiResponse();

		if (request == null || request.getTheatreId() == 0) {
			response.setResponseMessage("missing input");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		if (request.getImage() == null) {
			response.setResponseMessage("Image not selected");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		Theatre theatre = this.theatreDao.findById(request.getTheatreId()).orElse(null);

		if (theatre == null) {
			response.setResponseMessage("theatre not found!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		String existingImage = theatre.getImage();

		// store updated theatre image in Image Folder and give name to store in
		// database
		String newTheatreImageName = storageService.store(request.getImage());

		theatre.setImage(newTheatreImageName);

		Theatre updatedTheatre = this.theatreDao.save(theatre);

		if (updatedTheatre == null) {
			throw new TheatreSaveFailedException("Failed to update the Theatre image!!!");
		}

		// deleting the existing image from the folder
		try {
			this.storageService.delete(existingImage);

		} catch (Exception e) {
			LOG.error("Exception Caught: " + e.getMessage());

			throw new TheatreSaveFailedException("Failed to update the Theatre image");
		}

		response.setResponseMessage("Food Image Updated Successful");
		response.setSuccess(true);

		return new ResponseEntity<CommonApiResponse>(response, HttpStatus.OK);

	}

	public void fetchImage(String imageName, HttpServletResponse resp) {
		Resource resource = storageService.load(imageName);
		if (resource != null) {
			try (InputStream in = resource.getInputStream()) {
				ServletOutputStream out = resp.getOutputStream();
				FileCopyUtils.copy(in, out);
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}

	public ResponseEntity<TheatreResponse> fetchTheatreById(Integer theatreId) {

		LOG.info("Request received for fetching theatres by id");

		TheatreResponse response = new TheatreResponse();

		if (theatreId == null || theatreId == 0) {
			response.setResponseMessage("Missing status input!!!");
			response.setSuccess(false);

			return new ResponseEntity<TheatreResponse>(response, HttpStatus.BAD_REQUEST);
		}

		Theatre theatre = this.theatreDao.findById(theatreId).orElse(null);

		if (theatre == null) {
			response.setResponseMessage("No theatres found");
			response.setSuccess(false);

			return new ResponseEntity<TheatreResponse>(response, HttpStatus.OK);
		}

		response.setTheatres(Arrays.asList(theatre));
		response.setResponseMessage("Theatres fetched successful");
		response.setSuccess(true);

		return new ResponseEntity<TheatreResponse>(response, HttpStatus.OK);
	}

}
