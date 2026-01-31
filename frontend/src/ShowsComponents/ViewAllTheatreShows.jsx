import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaEye, FaTimesCircle } from "react-icons/fa";
import BASE_URL from "../api/api";

const ViewAllTheatreShows = () => {
  const [shows, setShows] = useState([]);

  // const admin = JSON.parse(sessionStorage.getItem("active-admin"));
  const admin_jwtToken = sessionStorage.getItem("admin-jwtToken");

  const navigate = useNavigate();

  const formatShowDateTime = (showDate, startTime, endTime) => {
    const pad = (n) => String(n).padStart(2, "0");
    const d = `${showDate[0]}-${pad(showDate[1])}-${pad(showDate[2])}`;
    const st = `${pad(startTime[0])}:${pad(startTime[1])}`;
    const et = `${pad(endTime[0])}:${pad(endTime[1])}`;
    return `${d} ${st} - ${et}`;
  };

  useEffect(() => {
    axios
      .get(`${BASE_URL}/theatre/show/fetch/all`, {
        headers: { Authorization: "Bearer " + admin_jwtToken },
      })
      .then((res) => {
        if (res.data) setShows(res.data.shows);
      })
      .catch(() => alert("Unable to fetch shows. Server error."));
  }, []);

  const viewShowDetail = (show) => {
    navigate("/theatre/show/detail", { state: show });
  };

  const updateShow = (showId, status) => {
    axios
      .get(
        `${BASE_URL}/theatre/show/update/status?showId=${showId}&status=${status}`,
        { headers: { Authorization: "Bearer " + admin_jwtToken } }
      )
      .then((res) => {
        if (res.data.success) {
          toast.success("Show status updated!", { autoClose: 1000 });

          setShows((prev) =>
            prev.map((s) =>
              s.id === showId ? { ...s, status: status } : s
            )
          );
        } else {
          toast.error(res.data.responseMessage, { autoClose: 1000 });
        }
      })
      .catch(() => toast.error("Server error.", { autoClose: 1000 }));
  };

  return (
    <div className="mt-3">
      <ToastContainer />

      <div className="card form-card ms-2 me-2 mb-5 shadow-lg" style={{ height: "45rem" }}>
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
                  <th>Theatre Name</th>
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
                        src={
                          `${BASE_URL}/theatre/` +
                          show?.movie?.posterImage
                        }
                        alt="movie"
                        className="img-fluid"
                        style={{ maxWidth: "90px" }}
                      />
                    </td>

                    <td><b>{show?.movie?.title}</b></td>
                    <td><b>{show?.movie?.theatre?.name}</b></td>
                    <td><b>{show?.screen?.name}</b></td>
                    <td><b>{show.regularSeatPrice}</b></td>
                    <td><b>{show.premiumSeatPrice}</b></td>
                    <td><b>{show.goldSeatPrice}</b></td>
                    <td><b>{show.status}</b></td>

                    <td>
                      {show.status === "Active" && (
                        <button
                          onClick={() => updateShow(show.id, "Cancelled")}
                          className="btn btn-lg bg-color custom-bg-text"
                        >
                          <FaTimesCircle />
                        </button>
                      )}

                      <button
                        onClick={() => viewShowDetail(show)}
                        className="btn btn-lg bg-color custom-bg-text mt-2"
                      >
                        <FaEye />
                      </button>
                    </td>
                  </tr>
                ))}

                {shows.length === 0 && (
                  <tr>
                    <td colSpan="10">
                      <b>No shows found.</b>
                    </td>
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

export default ViewAllTheatreShows;
