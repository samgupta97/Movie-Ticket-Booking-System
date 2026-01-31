import { useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from "../api/api";

const TheatreDetail = () => {
  const sessionUser = JSON.parse(sessionStorage.getItem("active-theatre"));
  const theatreId = sessionUser?.theatre?.id;
  const theatre_jwtToken = sessionStorage.getItem("theatre-jwtToken");

  const [theatre, setTheatre] = useState(null);

  useEffect(() => {
    axios
      .get(
        `${BASE_URL}/theatre/fetch/id-wise?theatreId=${theatreId}`,
        {
          headers: {
            Authorization: "Bearer " + theatre_jwtToken,
          },
        }
      )
      .then((res) => {
        setTheatre(res.data.theatres[0]);
      })
      .catch(() => alert("Failed to load theatre details"));
  }, []);

  if (!theatre) return <h3>Loading...</h3>;

  return (
    <div className="container-fluid mt-5 mb-5">
      <div className="card shadow-lg p-4">
        <h4 className="text-center mb-4">Theatre Detail</h4>

        <div className="row">
          {/* IMAGE */}
          <div className="col-md-4 d-flex justify-content-center">
            <img
              src={`${BASE_URL}/theatre/${theatre.image}`}
              className="img-fluid rounded"
              style={{ maxHeight: "300px", objectFit: "cover" }}
              alt={theatre.name}
            />
          </div>

          {/* DETAILS */}
          <div className="col-md-8">
            <h5 className="text-uppercase fw-bold mb-3">{theatre.name}</h5>

            <p><b>Description:</b> {theatre.description}</p>
            <p><b>Address:</b> {theatre.address}</p>
            <p><b>Email:</b> {theatre.emailId}</p>
            <p><b>Manager Contact:</b> {theatre.managerContact}</p>
            <p><b>Latitude:</b> {theatre.latitude}</p>
            <p><b>Longitude:</b> {theatre.longitude}</p>

            <p>
              <b>Status:</b>{" "}
              {theatre.status === "Approved" ? (
                <span className="text-success fw-bold">Approved</span>
              ) : theatre.status === "Rejected" ? (
                <span className="text-danger fw-bold">Rejected</span>
              ) : (
                <span className="text-warning fw-bold">In Progress</span>
              )}
            </p>

            <p className="text-muted">
              Status can only be updated by Admin.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TheatreDetail;
