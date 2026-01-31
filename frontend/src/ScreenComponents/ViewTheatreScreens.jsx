import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEye, FaTrash } from "react-icons/fa";
import { Button, Modal } from "react-bootstrap";
import BASE_URL from "../api/api";

const ViewTheatreScreens = () => {
  const [screens, setScreens] = useState([]);
  const [selectedScreen, setSelectedScreen] = useState({
    name: "",
    screenSeats: [],
  });
  const [showModal, setShowModal] = useState(false);

  const theatreManager = JSON.parse(sessionStorage.getItem("active-theatre"));
  const theatre_jwtToken = sessionStorage.getItem("theatre-jwtToken");

  // Fetch screens (NO async/await)
  useEffect(() => {
    axios
      .get(
        `${BASE_URL}/theatre/screen/fetch/theatre-wise?theatreId=` +
        theatreManager.theatre.id,
        {
          headers: {
            Authorization: "Bearer " + theatre_jwtToken,
          },
        }
      )
      .then((res) => {
        setScreens(res.data?.screens || []);
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to fetch screens");
      });
  }, []);

  const viewScreenDetail = (screen) => {
    setSelectedScreen(screen);
    setShowModal(true);
  };

  const deleteScreen = (screenId) => {
    if (!window.confirm("Are you sure you want to delete this screen?")) return;

    axios
      .delete(
        `${BASE_URL}/theatre/screen/delete?screenId=` + screenId,
        {
          headers: {
            Authorization: "Bearer " + theatre_jwtToken,
          },
        }
      )
      .then((res) => {
        if (res.data.success) {
          alert(res.data.responseMessage || "Screen deleted");

          // remove screen from UI (NO reload)
          setScreens((prev) =>
            prev.filter((screen) => screen.id !== screenId)
          );
        } else {
          alert(res.data.responseMessage || "Delete failed");
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Server error");
      });
  };

  return (
    <div className="mt-3">
      <div className="card form-card ms-2 me-2 mb-5 shadow-lg">
        <div className="card-header custom-bg-text text-center bg-color">
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
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {screens.map((screen) => (
                  <tr key={screen.id}>
                    <td><b>{screen.name}</b></td>
                    <td>{screen.totalSeats}</td>
                    <td>{screen.totalRegularSeatRow}</td>
                    <td>{screen.totalRegularSeats}</td>
                    <td>{screen.totalPremiumSeatRow}</td>
                    <td>{screen.totalPremiumSeats}</td>
                    <td>{screen.totalGoldSeatRow}</td>
                    <td>{screen.totalGoldSeats}</td>
                    <td>
                      <button
                        onClick={() => deleteScreen(screen.id)}
                        className="btn btn-lg bg-color custom-bg-text me-2"
                        title="Delete Screen"
                      >
                        <FaTrash />
                      </button>

                      <button
                        onClick={() => viewScreenDetail(screen)}
                        className="btn btn-lg bg-color custom-bg-text"
                        title="View"
                      >
                        <FaEye />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ===== MODAL : SEAT ARRANGEMENT (UNCHANGED) ===== */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton className="bg-color custom-bg-text">
          <Modal.Title>
            {theatreManager?.theatre?.name} - Screen {selectedScreen?.name}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="container-fluid">
            <div className="text-center mb-4">
              <h4 className="mb-3 h4">Screen Seating Arrangement</h4>
              <hr />
            </div>

            {selectedScreen?.screenSeats && (
              <div className="d-flex flex-column align-items-center">
                {(() => {
                  const rows = {};
                  selectedScreen.screenSeats.forEach((seat) => {
                    const rowLetter = seat.seatNumber.charAt(0);
                    if (!rows[rowLetter]) rows[rowLetter] = [];
                    rows[rowLetter].push(seat);
                  });

                  const sortedRows = Object.entries(rows)
                    .sort(([a], [b]) => b.localeCompare(a))
                    .map(([rowLetter, seats]) => [
                      rowLetter,
                      seats.sort((a, b) =>
                        parseInt(a.seatNumber.slice(1)) -
                        parseInt(b.seatNumber.slice(1))
                      ),
                    ]);

                  const seatColors = {
                    Regular: "bg-primary",
                    Premium: "bg-warning text-dark",
                    Gold: "bg-success",
                  };

                  const getSeatTypeByRow = (rowIndex) => {
                    const g = selectedScreen.totalGoldSeatRow;
                    const p = selectedScreen.totalPremiumSeatRow;
                    if (rowIndex < g) return "Gold";
                    if (rowIndex < g + p) return "Premium";
                    return "Regular";
                  };

                  return (
                    <>
                      {sortedRows.map(([rowLetter, seats], rowIdx) => {
                        const seatType = getSeatTypeByRow(rowIdx);

                        let marginTop = "";
                        if (
                          rowIdx === selectedScreen.totalGoldSeatRow ||
                          rowIdx ===
                          selectedScreen.totalGoldSeatRow +
                          selectedScreen.totalPremiumSeatRow
                        ) {
                          marginTop = "mt-4";
                        }

                        return (
                          <div
                            key={rowLetter}
                            className={`d-flex align-items-center mb-2 ${marginTop}`}
                          >
                            <strong className="me-2" style={{ width: "20px" }}>
                              {rowLetter}
                            </strong>

                            <div className="d-flex flex-wrap">
                              {seats.map((seat, index) => {
                                const isBlockEnd =
                                  seats[index + 1]?.seatPosition !==
                                  seat.seatPosition;

                                return (
                                  <div
                                    key={seat.id}
                                    className={`text-white px-2 py-1 rounded ${seatColors[seatType]
                                      } ${isBlockEnd ? "me-4" : "me-2"}`}
                                    style={{
                                      width: "36px",
                                      fontSize: "0.72rem",
                                      textAlign: "center",
                                    }}
                                    title={`${seatType} - ${seat.seatPosition}`}
                                  >
                                    {seat.seatNumber}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}

                      <div className="mt-4 text-muted text-center">
                        <small>← Screen this side</small>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
          </div>
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

export default ViewTheatreScreens;
