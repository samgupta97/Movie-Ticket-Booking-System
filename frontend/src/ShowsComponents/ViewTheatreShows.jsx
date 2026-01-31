import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaEye, FaTimesCircle } from "react-icons/fa";
import BASE_URL from "../api/api";

const ViewTheatreShows = () => {
  const [shows, setShows] = useState([]);

  const theatreManager = JSON.parse(sessionStorage.getItem("active-theatre"));
  const theatre_jwtToken = sessionStorage.getItem("theatre-jwtToken");

  const navigate = useNavigate();

  const formatShowDateTime = (showDate, startTime, endTime) => {
    const pad = (n) => String(n).padStart(2, "0");
    const date = `${showDate[0]}-${pad(showDate[1])}-${pad(showDate[2])}`;
    const start = `${pad(startTime[0])}:${pad(startTime[1])}`;
    const end = `${pad(endTime[0])}:${pad(endTime[1])}`;
    return `${date} ${start} - ${end}`;
  };

  useEffect(() => {
    axios
      .get(
        `${BASE_URL}/theatre/show/fetch/theatre-wise?theatreId=` +
        theatreManager.theatre.id,
        { headers: { Authorization: "Bearer " + theatre_jwtToken } }
      )
      .then((res) => setShows(res.data.shows))
      .catch(() => alert("Unable to fetch shows."));
  }, []);


  const viewShowDetail = (showId) => {
    navigate(`/theatre/show/detail/${showId}`);
  };
  const updateShow = (showId, status) => {
    axios
      .get(
        `${BASE_URL}/theatre/show/update/status?showId=${showId}&status=${status}`,
        { headers: { Authorization: "Bearer " + theatre_jwtToken } }
      )
      .then((res) => {
        const response = res.data;
        if (response.success) {
          alert(response.responseMessage);
          window.location.reload();
        } else {
          alert(response.responseMessage);
        }
      })
      .catch(() => alert("Server error"));
  };

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
          <h4 className="h4">All Shows</h4>
        </div>

        <div className="card-body" style={{ overflowY: "auto" }}>
          <div className="table-responsive">
            <table className="table table-hover text-center">
              <thead className="table-bordered border-color bg-color custom-bg-text">
                <tr>
                  <th>Show Time</th>
                  <th>Movie</th>
                  <th>Movie Name</th>
                  <th>Screen</th>
                  <th>Regular Price</th>
                  <th>Premium Price</th>
                  <th>Gold Price</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {shows.map((show) => (
                  <tr key={show.id}>
                    <td>
                      <b>
                        {formatShowDateTime(
                          show.showDate,
                          show.startTime,
                          show.endTime
                        )}
                      </b>
                    </td>

                    <td>
                      <img
                        src={`${BASE_URL}/theatre/${show?.movie?.posterImage}`}
                        className="img-fluid"
                        alt="movie poster"
                        style={{ maxWidth: "90px" }}
                      />
                    </td>

                    <td><b>{show?.movie?.title}</b></td>
                    <td><b>{show?.screen?.name}</b></td>
                    <td><b>{show.regularSeatPrice}</b></td>
                    <td><b>{show.premiumSeatPrice}</b></td>
                    <td><b>{show.goldSeatPrice}</b></td>
                    <td><b>{show.status}</b></td>

                    <td>
                      {show.status === "Active" && (
                        <>
                          <button
                            onClick={() => updateShow(show.id, "Cancelled")}
                            className="btn btn-lg bg-color custom-bg-text"
                            title="Cancel"
                          >
                            <FaTimesCircle />
                          </button>

                          <button
                            onClick={() => updateShow(show.id, "Completed")}
                            className="btn btn-lg bg-color custom-bg-text mt-2"
                            title="Completed"
                          >
                            <FaCheckCircle />
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => viewShowDetail(show.id)}
                        className="btn btn-lg bg-color custom-bg-text mt-2"
                        title="View"
                      >
                        <FaEye />
                      </button>
                    </td>
                  </tr>
                ))}

                {shows.length === 0 && (
                  <tr>
                    <td colSpan="9"><b>No Shows Found</b></td>
                  </tr>
                )}
              </tbody>

            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewTheatreShows;
