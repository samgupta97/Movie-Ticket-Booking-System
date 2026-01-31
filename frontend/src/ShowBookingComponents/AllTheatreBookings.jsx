import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";
import BASE_URL from "../api/api";

const AllTheatreBookings = () => {
  const [bookings, setBookings] = useState([]);

  const adminManager = JSON.parse(sessionStorage.getItem("active-admin"));
  const admin_jwtToken = sessionStorage.getItem("admin-jwtToken");

  function formatShowDateTime(showDate, startTime, endTime) {
    const pad = (n) => String(n).padStart(2, "0");

    const formattedDate = `${showDate[0]}-${pad(showDate[1])}-${pad(
      showDate[2]
    )}`;
    const formattedStartTime = `${pad(startTime[0])}:${pad(startTime[1])}`;
    const formattedEndTime = `${pad(endTime[0])}:${pad(endTime[1])}`;

    return `${formattedDate} ${formattedStartTime} - ${formattedEndTime}`;
  }

  useEffect(() => {
    const getShowBookings = async () => {
      const res = await retrieveBookings();
      if (res) {
        setBookings(res.bookings);
      }
    };

    getShowBookings();
  }, []);

  const retrieveBookings = async () => {
    const response = await axios.get(
      `${BASE_URL}/show/booking/fetch?status=Booked`,
      {
        headers: {
          Authorization: "Bearer " + admin_jwtToken,
        },
      }
    );
    return response.data;
  };

  return (
    <div className="mt-3">
      <div
        className="card form-card ms-2 me-2 mb-5 shadow-lg"
        style={{
          height: "45rem",
        }}
      >
        <div
          className="card-header custom-bg-text text-center bg-color"
          style={{
            borderRadius: "1em",
            height: "50px",
          }}
        >
          <h4 className="h4">Show Bookings</h4>
        </div>
        <div
          className="card-body"
          style={{
            overflowY: "auto",
          }}
        >
          <div className="table-responsive">
            <table className="table table-hover text-center">
              <thead className="table-bordered border-color bg-color custom-bg-text">
                <tr>
                  <th scope="col">Show ID</th>
                  <th scope="col">Booking ID</th>
                  <th scope="col">Show</th>
                  <th scope="col">Movie Name</th>
                  <th scope="col">Theatre Name</th>
                  <th scope="col">Screen</th>
                  <th scope="col">Show Time</th>
                  <th scope="col">Seat No.</th>
                  <th scope="col">Price</th>
                  <th scope="col">Customer Name</th>
                  <th scope="col">Customer Email</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => {
                  return (
                    <tr>
                      <td>
                        <b>{booking?.show?.id}</b>
                      </td>
                      <td>
                        <b>{booking?.bookingId}</b>
                      </td>
                      <td>
                        <img
                          src={
                            `${BASE_URL}/theatre/` +
                            booking?.show?.movie?.posterImage
                          }
                          class="img-fluid"
                          alt="movie_poster_img"
                          style={{
                            maxWidth: "90px",
                          }}
                        />
                      </td>
                      <td>
                        <b>{booking?.show?.movie?.title}</b>
                      </td>
                      <td>
                        <b>{booking?.show?.screen?.theatre?.name}</b>
                      </td>
                      <td>
                        <b>{booking?.show?.screen?.name}</b>
                      </td>
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

                      <td>
                        <b>{booking?.showSeat?.price}</b>
                      </td>
                      <td>
                        <b>
                          {booking?.customer?.firstName +
                            " " +
                            booking?.customer?.lastName}
                        </b>
                      </td>
                      <td>
                        <b>{booking?.customer?.emailId}</b>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllTheatreBookings;
