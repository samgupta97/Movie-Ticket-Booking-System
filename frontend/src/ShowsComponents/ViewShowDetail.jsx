import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import GetMovieReviews from "../ReviewComponent/GetMovieReviews";
import BASE_URL from "../api/api";

const ViewShowDetail = () => {
  const { showId } = useParams(); // ⬅️ GET showId from URL

  const customer = JSON.parse(sessionStorage.getItem("active-customer"));
  const customer_jwtToken = sessionStorage.getItem("customer-jwtToken");

  const [show, setShow] = useState(null);           // ⬅️ COMPLETE SHOW DETAILS
  const [bookings, setBookings] = useState([]);     // seats for booking modal
  const [selectedBookings, setSelectedBookings] = useState([]);

  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);

  const [showBookingModal, setShowBookingModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleBookingClose = () => setShowBookingModal(false);
  const handleBookingShow = () => setShowBookingModal(true);

  // 1️⃣ LOAD SHOW + SCREEN + MOVIE + THEATRE FROM BACKEND
  useEffect(() => {
    axios.get(`${BASE_URL}/theatre/show/fetch/id-wise?showId=` + showId)

      .then((res) => {
        setShow(res.data.shows?.[0]);

      })
      .catch(() => alert("Error loading show details"));
  }, [showId]);

  const viewShowBookingDetail = () => {
    setSelectedBookings([]);

    axios
      .get(`${BASE_URL}/theatre/show/fetch/id-wise?showId=` + showId)
      .then((res) => {
        const showData = res.data.shows?.[0];
        setBookings(showData?.showSeats || []);
        handleBookingShow();
      })
      .catch(() => alert("Error fetching seat bookings"));
  };


  const formatShowDateTime = (showDate, startTime, endTime) => {
    const pad = (n) => String(n).padStart(2, "0");

    return (
      `${showDate[0]} - ${pad(showDate[1])
      }-${pad(showDate[2])
      } ` +
      `${pad(startTime[0])}:${pad(startTime[1])} - ` +
      `${pad(endTime[0])}:${pad(endTime[1])} `
    );
  };

  // 3️⃣ BOOK SHOW SEATS
  const bookShow = (e) => {
    e.preventDefault();

    if (!customer) {
      alert("Please login to book the show!");
      return;
    }

    const seatIds = selectedBookings.map((s) => s.id);

    if (seatIds.length === 0) {
      alert("Please select at least one seat!");
      return;
    }

    const data = {
      customerId: customer.id,
      seatIds,
      showId,
    };

    axios
      .post(`${BASE_URL}/show/booking/add`, data, {
        headers: { Authorization: "Bearer " + customer_jwtToken },
      })
      .then((res) => {
        if (res.data.success) {
          alert(res.data.responseMessage);
          navigate("/home");
        } else {
          alert(res.data.responseMessage);
        }
      })
      .catch(() => alert("Server error"));
  };

  // WAIT UNTIL SHOW IS LOADED
  if (!show) return <h3 className="text-center mt-5">Loading...</h3>;

  const movie = show.movie;
  const theatre = movie?.theatre;
  const screen = show.screen;

  return (
    <div className="container-fluid">
      {/* SHOW INFO */}
      <div className="row mt-4">
        <div className="col-md-4">
          <h3 className="mt-3 text-color-second h3">Show Info</h3>

          <p>
            <strong>Show Time:</strong>{" "}
            {formatShowDateTime(show.showDate, show.startTime, show.endTime)}
          </p>

          <p><strong>Language:</strong> {show.language}</p>
          <p><strong>Show Type:</strong> {show.showType}</p>

          <p>
            <strong>Status:</strong>{" "}
            <b>{show.status}</b>
          </p>

          <p><strong>Regular Price:</strong> ₹{show.regularSeatPrice}</p>
          <p><strong>Premium Price:</strong> ₹{show.premiumSeatPrice}</p>
          <p><strong>Gold Price:</strong> ₹{show.goldSeatPrice}</p>
        </div>

        {/* SCREEN INFO */}
        <div className="col-md-8">
          <h3 className="mt-3 text-color-second h3">Screen Info</h3>

          <div className="row">
            <div className="col-md-6">
              <p><strong>Screen:</strong> {screen?.name}</p>
              <p><strong>Total Seats:</strong> {screen?.totalSeats}</p>
              <p><strong>Regular Seats:</strong> {screen?.totalRegularSeats}</p>
              <p><strong>Premium Seats:</strong> {screen?.totalPremiumSeats}</p>
              <p><strong>Gold Seats:</strong> {screen?.totalGoldSeats}</p>

              <button
                onClick={handleShow}
                className="btn btn-sm bg-color custom-bg-text mt-2"
              >
                View Seat Arrangement
              </button>

              <button
                onClick={viewShowBookingDetail}
                className="btn btn-sm bg-color custom-bg-text mt-2 ms-3"
              >
                Book Show
              </button>
            </div>

            <div className="col-md-6">
              <p><strong>Regular Rows:</strong> {screen?.totalRegularSeatRow}</p>
              <p><strong>Premium Rows:</strong> {screen?.totalPremiumSeatRow}</p>
              <p><strong>Gold Rows:</strong> {screen?.totalGoldSeatRow}</p>
              <p><strong>Left Seats:</strong> {screen?.totalLeftSideSeats}</p>
              <p><strong>Middle Seats:</strong> {screen?.totalMiddleSeats}</p>
              <p><strong>Right Seats:</strong> {screen?.totalRightSideSeats}</p>
            </div>
          </div>
        </div>
      </div>

      {/* MOVIE INFO */}
      <h3 className="mt-3 text-color-second h3">Movie Info</h3>
      <div className="row mt-4">
        <div className="col-md-4 text-center mb-3">
          <p className="text-muted">Poster disabled</p>
        </div>

        <div className="col-md-5">
          <h3 className="h3 text-color-second">{movie?.title}</h3>

          <p><strong>Description:</strong> {movie?.description}</p>
          <p><strong>Director:</strong> {movie?.director}</p>
          <p><strong>Producer:</strong> {movie?.producer}</p>
          <p><strong>Cast:</strong> {movie?.cast}</p>
          <p><strong>Language:</strong> {movie?.language}</p>
          <p><strong>Genre:</strong> {movie?.genre}</p>
          <p><strong>Duration:</strong> {movie?.duration}</p>
          <p><strong>Release Date:</strong> {movie?.releaseDate}</p>

          <p>
            <strong>Trailer:</strong>{" "}
            <a
              href={movie?.trailerUrl}
              target="_blank"
              rel="noreferrer"
              className="btn custom-bg-text text-white btn-sm"
            >
              Watch Trailer
            </a>
          </p>
        </div>

        <div className="col-md-3">
          <GetMovieReviews movie={movie} />
        </div>
      </div>

      {/* THEATRE INFO */}
      <h3 className="mt-3 text-color-second h3">Theatre Info</h3>
      <div className="row mt-4">
        <div className="col-md-4 text-center mb-3">
          <p className="text-muted">Theatre image disabled</p>
        </div>

        <div className="col-md-4">
          <p><strong>Name:</strong> {theatre?.name}</p>
          <p><strong>Address:</strong> {theatre?.address}</p>
          <p><strong>Contact:</strong> {theatre?.managerContact}</p>
          <p><strong>Email:</strong> {theatre?.emailId}</p>
          <p><strong>Description:</strong> {theatre?.description}</p>
          <p>
            <strong>Location:</strong>{" "}
            {theatre?.location?.city} - {theatre?.location?.downtown}
          </p>
        </div>
      </div>

      <Modal show={showModal} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Screen Seat Arrangement</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {screen?.screenSeats && (
            <div className="d-flex flex-column align-items-center">

              {/* COLOR LEGEND */}
              <div className="d-flex gap-3 mb-3 flex-wrap justify-content-center">
                <span className="px-2 py-1 bg-primary text-white rounded">Regular</span>
                <span className="px-2 py-1 bg-warning text-dark rounded">Premium</span>
                <span className="px-2 py-1 bg-success text-white rounded">Gold</span>
              </div>

              {(() => {
                const rows = {};

                screen.screenSeats.forEach((seat) => {
                  const row = seat.seatNumber.charAt(0);
                  if (!rows[row]) rows[row] = [];
                  rows[row].push(seat);
                });

                const sortedRows = Object.entries(rows)
                  .sort(([a], [b]) => b.localeCompare(a))
                  .map(([row, seats]) => [
                    row,
                    seats.sort(
                      (a, b) =>
                        parseInt(a.seatNumber.slice(1)) -
                        parseInt(b.seatNumber.slice(1))
                    ),
                  ]);

                const colors = {
                  Regular: "bg-primary text-white",
                  Premium: "bg-warning text-dark",
                  Gold: "bg-success text-white",
                };

                return (
                  <>
                    {sortedRows.map(([row, seats]) => (
                      <div key={row} className="d-flex mb-2 align-items-center">
                        <strong className="me-2">{row}</strong>

                        <div className="d-flex flex-wrap">
                          {seats.map((s) => (
                            <div
                              key={s.id}
                              className={`px-2 py-1 rounded me-2 mb-1 ${colors[s.seatType]}`}
                              style={{
                                width: "36px",
                                fontSize: "0.75rem",
                                textAlign: "center",
                              }}
                            >
                              {s.seatNumber}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </>
                );
              })()}
            </div>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showBookingModal} onHide={handleBookingClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Select Your Seats</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {bookings.length > 0 && (
            <div className="d-flex flex-column align-items-center">

              {/* COLOR LEGEND */}
              <div className="d-flex gap-3 mb-3 flex-wrap justify-content-center">
                <span className="px-2 py-1 bg-primary text-white rounded">Regular</span>
                <span className="px-2 py-1 bg-warning text-dark rounded">Premium</span>
                <span className="px-2 py-1 bg-success text-white rounded">Gold</span>
                <span className="px-2 py-1 bg-danger text-white rounded">Booked</span>
                <span className="px-2 py-1 bg-dark text-white rounded">Selected</span>
              </div>

              {(() => {

                const rows = {};

                bookings.forEach((seat) => {
                  const row = seat.seatNumber.charAt(0);
                  if (!rows[row]) rows[row] = [];
                  rows[row].push(seat);
                });

                const sortedRows = Object.entries(rows)
                  .sort(([a], [b]) => b.localeCompare(a))
                  .map(([row, seats]) => [
                    row,
                    seats.sort(
                      (a, b) =>
                        parseInt(a.seatNumber.slice(1)) -
                        parseInt(b.seatNumber.slice(1))
                    ),
                  ]);

                const colors = {
                  Regular: "bg-primary text-white",
                  Premium: "bg-warning text-dark",
                  Gold: "bg-success text-white",
                };

                return (
                  <>
                    {sortedRows.map(([row, seats]) => (
                      <div key={row} className="d-flex mb-2 align-items-center">
                        <strong className="me-2">{row}</strong>

                        <div className="d-flex flex-wrap">
                          {seats.map((s) => {
                            const isBooked = s.status?.toUpperCase() === "BOOKED";

                            const isSelected = selectedBookings.some(
                              (b) => b.id === s.id
                            );

                            return (
                              <div
                                key={s.id}
                                onClick={() => {
                                  if (!isBooked) {
                                    setSelectedBookings((prev) =>
                                      prev.find((seat) => seat.id === s.id)
                                        ? prev.filter((seat) => seat.id !== s.id)
                                        : [...prev, s]
                                    );
                                  }
                                }}

                                className={`px-2 py-1 rounded me-2 mb-1 ${isBooked
                                  ? "bg-danger text-white"
                                  : isSelected
                                    ? "bg-dark text-white"
                                    : colors[s.seatType]
                                  }`}

                                style={{
                                  width: "36px",
                                  fontSize: "0.75rem",
                                  cursor: isBooked ? "not-allowed" : "pointer",
                                  textAlign: "center",
                                }}
                              >
                                {s.seatNumber}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}

                    {selectedBookings.length > 0 && (
                      <div className="text-center mt-4">
                        <h5>
                          Total Price: ₹
                          {selectedBookings
                            .reduce(
                              (total, seat) =>
                                total + (parseFloat(seat.price) || 0),
                              0
                            )
                            .toFixed(2)}
                        </h5>

                        <button
                          className="btn btn-md bg-color text-white mt-2"
                          onClick={bookShow}
                        >
                          Book Seat
                        </button>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          )}
        </Modal.Body>



      </Modal>

    </div>
  );
};

export default ViewShowDetail;


