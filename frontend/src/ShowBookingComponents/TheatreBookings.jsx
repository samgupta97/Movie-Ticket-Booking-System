import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";
import BASE_URL from "../api/api";

const TheatreBookings = () => {
  const [bookings, setBookings] = useState([]);

  const theatreManager = JSON.parse(sessionStorage.getItem("active-theatre"));
  const theatre_jwtToken = sessionStorage.getItem("theatre-jwtToken");

  function formatShowDateTime(showDate, startTime, endTime) {
    const pad = (n) => String(n).padStart(2, "0");

    const formattedDate = `${showDate[0]}-${pad(showDate[1])}-${pad(
      showDate[2]
    )}`;
    const formattedStartTime = `${pad(startTime[0])}:${pad(startTime[1])}`;
    const formattedEndTime = `${pad(endTime[0])}:${pad(endTime[1])}`;

    return `${formattedDate} ${formattedStartTime} - ${formattedEndTime}`;
  }

  // Fetch bookings (NO async/await)
  useEffect(() => {
    axios
      .get(
        `${BASE_URL}/show/booking/fetch/theatre-wise?theatreId=` +
        theatreManager?.theatre?.id +
        "&status=Booked",
        {
          headers: {
            Authorization: "Bearer " + theatre_jwtToken,
          },
        }
      )
      .then((res) => {
        setBookings(res.data?.bookings || []);
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to fetch bookings");
      });
  }, []);

  return (
    <div className="mt-3">
      <div
        className="card form-card ms-2 me-2 mb-5 shadow-lg"
        style={{ height: "45rem" }}
      >
        <div
          className="card-header custom-bg-text text-center bg-color"
          style={{ borderRadius: "1em", height: "50px" }}
        >
          <h4 className="h4">Show Bookings</h4>
        </div>

        <div className="card-body" style={{ overflowY: "auto" }}>
          <div className="table-responsive">
            <table className="table table-hover text-center">
              <thead className="table-bordered border-color bg-color custom-bg-text">
                <tr>
                  <th>Show ID</th>
                  <th>Booking ID</th>
                  <th>Show</th>
                  <th>Movie Name</th>
                  <th>Screen</th>
                  <th>Show Time</th>
                  <th>Seat No.</th>
                  <th>Price</th>
                  <th>Customer Name</th>
                  <th>Customer Email</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.bookingId}>
                    <td><b>{booking?.show?.id}</b></td>
                    <td><b>{booking?.bookingId}</b></td>
                    <td>
                      <img
                        src={
                          `${BASE_URL}/theatre/` +
                          booking?.show?.movie?.posterImage
                        }
                        className="img-fluid"
                        alt="movie_poster"
                        style={{ maxWidth: "90px" }}
                      />
                    </td>
                    <td><b>{booking?.show?.movie?.title}</b></td>
                    <td><b>{booking?.show?.screen?.name}</b></td>
                    <td>
                      <b>
                        {formatShowDateTime(
                          booking?.show?.showDate,
                          booking?.show?.startTime,
                          booking?.show?.endTime
                        )}
                      </b>
                    </td>
                    <td>
                      <b>
                        {booking?.showSeat?.seatNumber +
                          " [" +
                          booking?.showSeat?.seatType +
                          "]"}
                      </b>
                    </td>
                    <td><b>{booking?.showSeat?.price}</b></td>
                    <td>
                      <b>
                        {booking?.customer?.firstName +
                          " " +
                          booking?.customer?.lastName}
                      </b>
                    </td>
                    <td><b>{booking?.customer?.emailId}</b></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TheatreBookings;
