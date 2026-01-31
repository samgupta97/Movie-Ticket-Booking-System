import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";
import { FaTrash } from "react-icons/fa";
import BASE_URL from "../api/api";

const ViewApprovedTheatres = () => {
  const [theatres, setTheatres] = useState([]);

  const admin_jwtToken = sessionStorage.getItem("admin-jwtToken");

  useEffect(() => {
    axios
      .get(
        `${BASE_URL}/theatre/fetch/status-wise?status=Approved`,
        {
          headers: {
            Authorization: "Bearer " + admin_jwtToken,
          },
        }
      )
      .then((res) => {
        setTheatres(res.data.theatres || []);
      })
      .catch(() => alert("Failed to load theatres"));
  }, []);

  const deleteTheatre = (theatreId) => {
    axios
      .delete(
        `${BASE_URL}/theatre/delete?theatreId=${theatreId}`,
        {
          headers: {
            Authorization: "Bearer " + admin_jwtToken,
          },
        }
      )
      .then((res) => {
        alert(res.data.responseMessage);

        // Instantly remove theatre from list
        setTheatres((prev) => prev.filter((t) => t.id !== theatreId));
      })
      .catch(() => alert("Server error while deleting theatre"));
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
          <h4 className="h4">Approved Theatres</h4>
        </div>

        <div className="card-body" style={{ overflowY: "auto" }}>
          <div className="table-responsive">
            <table className="table table-hover text-center">
              <thead className="table-bordered border-color bg-color custom-bg-text">
                <tr>
                  <th>Theatre</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Contact</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Coordinates</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {theatres.length === 0 && (
                  <tr>
                    <td colSpan="8" className="text-muted">
                      No approved theatres found.
                    </td>
                  </tr>
                )}

                {theatres.map((theatre) => (
                  <tr key={theatre.id}>
                    <td>
                      <img
                        src={`${BASE_URL}/theatre/${theatre.image}`}
                        className="img-fluid"
                        style={{ maxWidth: "90px" }}
                        alt="theatre"
                      />
                    </td>

                    <td><b>{theatre.name}</b></td>
                    <td><b>{theatre.description}</b></td>
                    <td><b>{theatre.managerContact}</b></td>
                    <td><b>{theatre.emailId}</b></td>
                    <td><b>{theatre.address}</b></td>
                    <td><b>{theatre.latitude}, {theatre.longitude}</b></td>

                    <td>
                      <button
                        onClick={() => deleteTheatre(theatre.id)}
                        className="btn btn-lg bg-danger text-white"
                        title="Delete Theatre"
                      >
                        <FaTrash />
                      </button>
                    </td>
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

export default ViewApprovedTheatres;
