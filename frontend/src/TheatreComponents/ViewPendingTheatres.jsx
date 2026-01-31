import { useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from "../api/api";

const ViewPendingTheatres = () => {
  const [theatres, setTheatres] = useState([]);

  const admin_jwtToken = sessionStorage.getItem("admin-jwtToken");

  // FETCH theatres with "In Progress" status
  useEffect(() => {
    axios
      .get(
        `${BASE_URL}/theatre/fetch/status-wise?status=In Progress`,
        {
          headers: { Authorization: "Bearer " + admin_jwtToken },
        }
      )
      .then((res) => {
        setTheatres(res.data.theatres || []);
      })
      .catch((err) => {
        console.log(err);
        alert("Failed to load theatres");
      });
  }, []);

  // UPDATE THEATRE STATUS
  const updateTheatreStatus = (theatreId, status) => {
    axios
      .post(
        `${BASE_URL}/theatre/update/status?theatreId=${theatreId}&status=${status}`,
        {}, // empty body (backend only expects params)
        {
          headers: { Authorization: "Bearer " + admin_jwtToken },
        }
      )
      .then((res) => {
        alert(res.data.responseMessage);

        // Remove updated theatre from UI
        setTheatres((prev) => prev.filter((t) => t.id !== theatreId));
      })
      .catch((err) => {
        console.log(err);
        alert("Server error");
      });
  };

  return (
    <div className="mt-3">
      <div className="card form-card ms-2 me-2 mb-5 shadow-lg">
        <div
          className="card-header custom-bg-text text-center bg-color"
          style={{ borderRadius: "1em" }}
        >
          <h4 className="h4">Theatres – In Progress (Pending Approval)</h4>
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
                      No theatres waiting for approval.
                    </td>
                  </tr>
                )}

                {theatres.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <img
                        src={`${BASE_URL}/theatre/${t.image}`}
                        className="img-fluid"
                        style={{ maxWidth: "90px" }}
                        alt="theatre"
                      />
                    </td>

                    <td><b>{t.name}</b></td>
                    <td><b>{t.description}</b></td>
                    <td><b>{t.managerContact}</b></td>
                    <td><b>{t.emailId}</b></td>
                    <td><b>{t.address}</b></td>
                    <td><b>{t.latitude}, {t.longitude}</b></td>

                    <td>
                      {/* REJECT */}
                      <button
                        className="btn btn-danger ms-2"
                        onClick={() => updateTheatreStatus(t.id, "Rejected")}
                      >
                        Reject
                      </button>

                      {/* APPROVE */}
                      <button
                        className="btn btn-success ms-2 mt-2"
                        onClick={() => updateTheatreStatus(t.id, "Approved")}
                      >
                        Approve
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

export default ViewPendingTheatres;
