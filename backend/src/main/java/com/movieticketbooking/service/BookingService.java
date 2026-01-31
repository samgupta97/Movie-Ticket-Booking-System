package com.movieticketbooking.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.movieticketbooking.dao.BookingDao;
import com.movieticketbooking.dao.ShowDao;
import com.movieticketbooking.dao.TheatreDao;
import com.movieticketbooking.dao.UserDao;
import com.movieticketbooking.dto.AddBookingRequest;
import com.movieticketbooking.dto.BookingResponse;
import com.movieticketbooking.dto.CommonApiResponse;
import com.movieticketbooking.dto.ShowSeatBookingData;
import com.movieticketbooking.dto.ShowSeatBookingResponseDto;
import com.movieticketbooking.entity.Booking;
import com.movieticketbooking.entity.Shows;
import com.movieticketbooking.entity.Theatre;
import com.movieticketbooking.entity.User;
import com.movieticketbooking.exception.BookingNotFoundException;
import com.movieticketbooking.exception.UserNotFoundException;
import com.movieticketbooking.utility.BookingIdGenerator;
import com.movieticketbooking.utility.Constants.BookingStatus;
import com.movieticketbooking.utility.EmailService;

import jakarta.transaction.Transactional;
import com.movieticketbooking.entity.ShowSeat;
import com.movieticketbooking.dao.ShowSeatDao;
import com.movieticketbooking.entity.ScreenSeat;


@Service
@Transactional
public class BookingService {

	private final Logger LOG = LoggerFactory.getLogger(BookingService.class);

	@Autowired
	private BookingDao bookingDao;
	
	@Autowired
	private ShowSeatDao showSeatDao;

	@Autowired
	private TheatreDao theatreDao;

	@Autowired
	private ShowDao showDao;

	@Autowired
	private UserDao userDao;
	
	@Autowired
	private EmailService emailService;

	public ResponseEntity<CommonApiResponse> addShowBooking(AddBookingRequest request) {

	    LOG.info("Request received for adding the show booking");

	    CommonApiResponse response = new CommonApiResponse();

	    String bookingTime = String.valueOf(
	            LocalDateTime.now().atZone(ZoneId.systemDefault()).toInstant().toEpochMilli());

	    // Validate request
	    if (request == null) {
	        response.setResponseMessage("Request is null");
	        response.setSuccess(false);
	        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
	    }

	    if (request.getSeatIds() == null || request.getSeatIds().isEmpty()) {
	        response.setResponseMessage("Missing seatIds");
	        response.setSuccess(false);
	        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
	    }

	    if (request.getCustomerId() == 0) {
	        response.setResponseMessage("Missing customer id");
	        response.setSuccess(false);
	        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
	    }

	    if (request.getShowId() == 0) {
	        response.setResponseMessage("Missing show id");
	        response.setSuccess(false);
	        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
	    }

	    User customer = userDao.findById(request.getCustomerId()).orElse(null);

	    if (customer == null) {
	        response.setResponseMessage("Customer not found");
	        response.setSuccess(false);
	        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
	    }

	    Shows show = showDao.findById(request.getShowId()).orElse(null);
	    if (show == null) {
	        response.setResponseMessage("Show not found");
	        response.setSuccess(false);
	        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
	    }

	    // Fetch ShowSeat entries
	    List<ShowSeat> selectedSeats = request.getSeatIds().stream()
	            .map(id -> showSeatDao.findById(id).orElse(null))
	            .collect(Collectors.toList());

	    if (selectedSeats.contains(null)) {
	        response.setResponseMessage("One or more seats do not exist");
	        response.setSuccess(false);
	        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
	    }

	    // Check seat availability
	    List<Booking> existingBookings = bookingDao.findByShow(show);

	    boolean anyBooked = selectedSeats.stream().anyMatch(seat ->
	            existingBookings.stream().anyMatch(b ->
	                    b.getShowSeat().getId() == seat.getId() &&
	                            (b.getStatus().equalsIgnoreCase("BOOKED") ||
	                             b.getStatus().equalsIgnoreCase("SUCCESS"))
	            )
	    );

	    if (anyBooked) {
	        response.setResponseMessage("Some selected seats are already booked");
	        response.setSuccess(false);
	        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
	    }

	    // Calculate total amount
	    BigDecimal totalAmount = selectedSeats.stream()
	            .map(ShowSeat::getPrice)
	            .reduce(BigDecimal.ZERO, BigDecimal::add);

	    if (customer.getWalletAmount().compareTo(totalAmount) < 0) {
	        response.setResponseMessage("Insufficient wallet balance!");
	        response.setSuccess(false);
	        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
	    }

	    // Generate unique BookingId
	    String bookingUniqueId = BookingIdGenerator.generateBookingId();

	    // Create Booking entries
	    for (ShowSeat seat : selectedSeats) {
	        Booking booking = new Booking();
	        booking.setBookingId(bookingUniqueId);
	        booking.setBookingTime(bookingTime);
	        booking.setShow(show);
	        booking.setShowSeat(seat);
	        booking.setCustomer(customer);
	        booking.setStatus("BOOKED");
	        bookingDao.save(booking);
	    }

	    // Deduct from customer wallet
	    customer.setWalletAmount(customer.getWalletAmount().subtract(totalAmount));
	    userDao.save(customer);

	    // Credit theatre manager wallet
	    User manager = userDao.findById(show.getTheatre().getManager().getId())
	            .orElseThrow(() -> new UserNotFoundException("Theatre Manager not found"));

	    manager.setWalletAmount(manager.getWalletAmount().add(totalAmount));
	    userDao.save(manager);

	    // Send email
	    try {
	        String mailBody = emailService.getMailBody(customer, existingBookings, bookingUniqueId);
	        String subject = "Booking Confirmation – " + bookingUniqueId;
	        emailService.sendEmail(customer.getEmailId(), subject, mailBody);
	    } catch (Exception e) {
	        e.printStackTrace();
	    }

	    response.setResponseMessage("Your booking was successful!");
	    response.setSuccess(true);

	    return new ResponseEntity<>(response, HttpStatus.OK);
	}


	public ResponseEntity<BookingResponse> fetchShowBookingsByStatus(String status) {

		LOG.info("Request received for fetching show bookings by status");

		BookingResponse response = new BookingResponse();

		if (status == null) {
			response.setResponseMessage("Missing status input!!!");
			response.setSuccess(false);

			return new ResponseEntity<BookingResponse>(response, HttpStatus.BAD_REQUEST);
		}

		List<Booking> bookings = this.bookingDao.findByStatus(status);

		if (CollectionUtils.isEmpty(bookings)) {
			response.setResponseMessage("No Bookings!!!");
			response.setSuccess(false);

			return new ResponseEntity<BookingResponse>(response, HttpStatus.OK);
		}

		response.setBookings(bookings);
		response.setResponseMessage("Bookings fetched successful");
		response.setSuccess(true);

		return new ResponseEntity<BookingResponse>(response, HttpStatus.OK);
	}

	public ResponseEntity<BookingResponse> fetchShowBookingsByTheatre(Integer theatreId, String status) {

		LOG.info("Request received for fetching show bookings by status");

		BookingResponse response = new BookingResponse();

		if (status == null) {
			response.setResponseMessage("Missing status input!!!");
			response.setSuccess(false);

			return new ResponseEntity<BookingResponse>(response, HttpStatus.BAD_REQUEST);
		}

		if (theatreId == null || theatreId == 0) {
			response.setResponseMessage("Missing thetare id!!!");
			response.setSuccess(false);

			return new ResponseEntity<BookingResponse>(response, HttpStatus.BAD_REQUEST);
		}

		Theatre theatre = this.theatreDao.findById(theatreId).orElse(null);

		if (theatre == null) {
			response.setResponseMessage("Theatre not found!!!");
			response.setSuccess(false);

			return new ResponseEntity<BookingResponse>(response, HttpStatus.BAD_REQUEST);
		}

		List<Booking> bookings = this.bookingDao.findByTheatreAndStatus(theatre, status);

		if (CollectionUtils.isEmpty(bookings)) {
			response.setResponseMessage("No Bookings!!!");
			response.setSuccess(false);

			return new ResponseEntity<BookingResponse>(response, HttpStatus.OK);
		}

		response.setBookings(bookings);
		response.setResponseMessage("Bookings fetched successful");
		response.setSuccess(true);

		return new ResponseEntity<BookingResponse>(response, HttpStatus.OK);
	}

	public ResponseEntity<BookingResponse> fetchShowBookingsByCustomer(Integer customerId, String status) {

		LOG.info("Request received for fetching show bookings by status");

		BookingResponse response = new BookingResponse();

		if (status == null) {
			response.setResponseMessage("Missing status input!!!");
			response.setSuccess(false);

			return new ResponseEntity<BookingResponse>(response, HttpStatus.BAD_REQUEST);
		}

		if (customerId == null || customerId == 0) {
			response.setResponseMessage("Missing thetare id!!!");
			response.setSuccess(false);

			return new ResponseEntity<BookingResponse>(response, HttpStatus.BAD_REQUEST);
		}

		User customer = this.userDao.findById(customerId).orElse(null);

		if (customer == null) {
			response.setResponseMessage("Theatre not found!!!");
			response.setSuccess(false);

			return new ResponseEntity<BookingResponse>(response, HttpStatus.BAD_REQUEST);
		}

		List<Booking> bookings = this.bookingDao.findByCustomerAndStatus(customer, status);

		if (CollectionUtils.isEmpty(bookings)) {
			response.setResponseMessage("No Bookings!!!");
			response.setSuccess(false);

			return new ResponseEntity<BookingResponse>(response, HttpStatus.OK);
		}

		response.setBookings(bookings);
		response.setResponseMessage("Bookings fetched successful");
		response.setSuccess(true);

		return new ResponseEntity<BookingResponse>(response, HttpStatus.OK);
	}

	public ResponseEntity<ShowSeatBookingResponseDto> fetchShowBookingsByShow(Integer showId) {

	    LOG.info("Fetching seats for show ID = {}", showId);

	    ShowSeatBookingResponseDto response = new ShowSeatBookingResponseDto();

	    if (showId == null || showId == 0) {
	        response.setResponseMessage("Missing show id!!!");
	        response.setSuccess(false);
	        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
	    }

	    Shows show = this.showDao.findById(showId).orElse(null);

	    if (show == null) {
	        response.setResponseMessage("Show not found!!!");
	        response.setSuccess(false);
	        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
	    }

	    // 1️⃣ Fetch static layout seats
	    List<ScreenSeat> screenSeats = show.getScreen().getScreenSeats();

	    // 2️⃣ Fetch bookings already done for this show
	    List<Booking> bookedSeats = this.bookingDao.findByShow(show);

	    List<ShowSeatBookingData> output = new ArrayList<>();

	    for (ScreenSeat screenSeat : screenSeats) {

	        ShowSeatBookingData data = new ShowSeatBookingData();

	        // STATIC SCREEN SEAT DETAILS
	        data.setId(screenSeat.getId());
	        data.setSeatNumber(screenSeat.getSeatNumber());
	        data.setSeatType(screenSeat.getSeatType());
	        data.setSeatPosition(screenSeat.getSeatPosition());

	        // PRICE BASED ON SEAT TYPE
	        if (screenSeat.getSeatType().equalsIgnoreCase("Regular")) {
	            data.setPrice(show.getRegularSeatPrice());
	        } else if (screenSeat.getSeatType().equalsIgnoreCase("Premium")) {
	            data.setPrice(show.getPremiumSeatPrice());
	        } else {
	            data.setPrice(show.getGoldSeatPrice());
	        }

	        // 3️⃣ MATCH BOOKING BASED ON seatNumber (NOT show_seat table)
	        Booking bookingEntry = bookedSeats.stream()
	                .filter(b -> b.getShowSeat().getSeatNumber().equals(screenSeat.getSeatNumber()))
	                .findFirst()
	                .orElse(null);

	        if (bookingEntry != null) {
	            data.setBookingTableId(bookingEntry.getId());
	            data.setStatus("BOOKED");
	        } else {
	            data.setBookingTableId(0);
	            data.setStatus("AVAILABLE");
	        }

	        output.add(data);
	    }

	    response.setBookings(output);
	    response.setSuccess(true);
	    response.setResponseMessage("Show seats fetched successfully");

	    return new ResponseEntity<>(response, HttpStatus.OK);
	}



}
