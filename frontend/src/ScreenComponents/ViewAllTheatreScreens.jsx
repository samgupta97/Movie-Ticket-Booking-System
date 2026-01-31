import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaTrash } from "react-icons/fa";
import { Button, Modal } from "react-bootstrap";
import BASE_URL from "../api/api";

const ViewAllTheatreScreens = () => {
  const [screens, setScreens] = useState([]);
  const [selectedScreen, setSelectedScreen] = useState({ name: "", screenSeats: [] });
  const [showModal, setShowModal] = useState(false);

  const admin = JSON.parse(sessionStorage.getItem("active-admin"));
  const admin_jwtToken = sessionStorage.getItem("admin-jwtToken");

  const navigate = useNavigate();

  useEffect(() => {
    retrieveScreen();
  }, []);

  const retrieveScreen = () => {
    axios
      .get(`${BASE_URL}/theatre/screen/fetch/status-wise?status=Active`, {
        headers: {
          Authorization: "Bearer " + admin_jwtToken,
        },
      })
      .then((response) => {
        if (response.data) {
          setScreens(response.data.screens);
        }
      })
      .catch(() => {
        alert("Unable to fetch screens! Server error.");
      });
  };

  const viewScreenDetail = (screen) => {
    setSelectedScreen(screen);
    setShowModal(true);
  };

  const deleteScreen = (screenId) => {


    axios
      .delete(`${BASE_URL}/theatre/screen/delete?screenId=` + screenId, {
        headers: {
          Authorization: "Bearer " + admin_jwtToken,
        },
      })
      .then((response) => {
        const res = response.data;

        if (res.success) {
          alert("Screen deleted successfully!");
          setScreens((prev) => prev.filter((s) => s.id !== screenId));
        } else {
          alert(res.responseMessage || "Failed to delete screen.");
        }
      })
      .catch(() => {
        alert("Server error while deleting.");
      });
  };

  return (
    <div className="mt-3">
      <div className="card form-card ms-2 me-2 mb-5 shadow-lg" style={{ height: "45rem" }}>
        <div className="card-header custom-bg-text text-center bg-color" style={{ borderRadius: "1em", height: "50px" }}>
          <h4 className="h4">All Screens</h4>
        </div>

        <div className="card-body" style={{ overflowY: "auto" }}>
          <div className="table-responsive">
            <table className="table table-hover text-center">
              <thead className="table-bordered border-color bg-color custom-bg-text">
                <tr>
                  <th>Screen</th>
                  <th>Total Seats</th>
                  <th>Regular Rows</th>
                  <th>Regular Seats</th>
                  <th>Premium Rows</th>
                  <th>Premium Seats</th>
                  <th>Gold Rows</th>
                  <th>Gold Seats</th>
                  <th>Theatre</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {screens.map((screen) => (
                  <tr key={screen.id}>
                    <td><b>{screen.name}</b></td>
                    <td><b>{screen.totalSeats}</b></td>
                    <td><b>{screen.totalRegularSeatRow}</b></td>
                    <td><b>{screen.totalRegularSeats}</b></td>
                    <td><b>{screen.totalPremiumSeatRow}</b></td>
                    <td><b>{screen.totalPremiumSeats}</b></td>
                    <td><b>{screen.totalGoldSeatRow}</b></td>
                    <td><b>{screen.totalGoldSeats}</b></td>
                    <td><b>{screen.theatre.name}</b></td>

                    <td>
                      <button
                        onClick={() => deleteScreen(screen.id)}
                        className="btn btn-lg bg-color custom-bg-text"
                        title="Delete Screen"
                      >
                        <FaTrash />
                      </button>

                      <button
                        onClick={() => viewScreenDetail(screen)}
                        className="btn btn-lg bg-color custom-bg-text mt-2"
                        title="View"
                      >
                        <FaEye />
                      </button>
                    </td>
                  </tr>
                ))}

                {screens.length === 0 && (
                  <tr>
                    <td colSpan="10">
                      <b>No screens found.</b>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton className="bg-color custom-bg-text">
          <Modal.Title>
            {selectedScreen?.theatre?.name + " - Screen " + selectedScreen?.name}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {selectedScreen?.screenSeats?.length > 0 ? (
            <div className="text-center"></div>
          ) : (
            <p>No seating data available</p>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ViewAllTheatreScreens;
