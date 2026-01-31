import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../api/api";

const AddScreenForm = () => {
  const theatreManager = JSON.parse(sessionStorage.getItem("active-theatre"));
  const theatre_jwtToken = sessionStorage.getItem("theatre-jwtToken");

  const navigate = useNavigate();

  // ⭐ Default safe values to avoid any mismatch
  const [screen, setScreen] = useState({
    name: "",
    totalSeats: 40,

    totalRegularSeats: 24,
    totalRegularSeatRow: 3,

    totalPremiumSeats: 8,
    totalPremiumSeatRow: 1,

    totalGoldSeats: 8,
    totalGoldSeatRow: 1,

    totalLeftSideSeats: 2,
    totalMiddleSeats: 4,
    totalRightSideSeats: 2,
  });

  // ⭐ AUTO CALCULATE TOTAL SEATS WHEN ANY VALUE CHANGES
  useEffect(() => {
    const rows =
      Number(screen.totalRegularSeatRow) +
      Number(screen.totalPremiumSeatRow) +
      Number(screen.totalGoldSeatRow);

    const seatsPerRow =
      Number(screen.totalLeftSideSeats) +
      Number(screen.totalMiddleSeats) +
      Number(screen.totalRightSideSeats);

    const total = rows * seatsPerRow;

    setScreen((prev) => ({
      ...prev,
      totalSeats: total,
      totalRegularSeats: screen.totalRegularSeatRow * seatsPerRow,
      totalPremiumSeats: screen.totalPremiumSeatRow * seatsPerRow,
      totalGoldSeats: screen.totalGoldSeatRow * seatsPerRow,
    }));
  }, [
    screen.totalRegularSeatRow,
    screen.totalPremiumSeatRow,
    screen.totalGoldSeatRow,
    screen.totalLeftSideSeats,
    screen.totalMiddleSeats,
    screen.totalRightSideSeats,
  ]);

  const handleInput = (e) => {
    setScreen({ ...screen, [e.target.name]: e.target.value });
  };

  const saveScreen = (e) => {
    e.preventDefault();

    const payload = { ...screen, theatreId: theatreManager.theatre.id };

    axios
      .post(`${BASE_URL}/theatre/screen/add`, payload, {
        headers: {
          "Content-Type": "application/json",
          // Authorization: "Bearer " + theatre_jwtToken,
        },
      })
      .then((response) => {
        const res = response.data;

        if (res.success) {
          alert("Screen added successfully!");
          navigate("/home");
        } else {
          alert(res.responseMessage || "Something went wrong.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Server error. Please try again.");
      });
  };

  return (
    <div>
      <div className="mt-2 d-flex align-items-center justify-content-center mb-4">
        <div className="card form-card shadow-lg" style={{ width: "45rem" }}>
          <div className="container-fluid">
            <div
              className="card-header bg-color custom-bg-text mt-2 text-center"
              style={{ borderRadius: "1em", height: "45px" }}
            >
              <h5 className="card-title h5">Add Screen Detail</h5>
            </div>

            <div className="card-body">
              {/* ⭐ INFO BOX WITH FORMULA */}
              <div className="alert alert-info" style={{ fontSize: "14px" }}>
                <b>Seat Layout Formula:</b>
                <ul style={{ marginTop: "5px" }}>
                  <li>
                    <b>Total Rows = Regular Rows + Premium Rows + Gold Rows</b>
                  </li>
                  <li>
                    <b>
                      Seats Per Row = Left Seats + Middle Seats + Right Seats
                    </b>
                  </li>
                  <li>
                    <b>Total Seats = Total Rows × Seats Per Row</b>
                  </li>
                </ul>

                <b>Recommended Values (Auto Applied):</b>
                <ul>
                  <li>Left = 2, Middle = 4, Right = 2</li>
                  <li>Regular Rows = 3, Premium Rows = 1, Gold Rows = 1</li>
                  <li>Total Seats automatically calculated</li>
                </ul>
              </div>

              <form className="row g-3">
                {/* Screen Name */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    <b>Screen Name</b>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    onChange={handleInput}
                    value={screen.name}
                  />
                </div>

                {/* Total Seats (Auto calculated) */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    <b>Total Seats (Auto)</b>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={screen.totalSeats}
                    disabled
                  />
                </div>

                {/* Regular section */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    <b>Regular Rows</b>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    name="totalRegularSeatRow"
                    onChange={handleInput}
                    value={screen.totalRegularSeatRow}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    <b>Regular Seats (Auto)</b>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={screen.totalRegularSeats}
                    disabled
                  />
                </div>

                {/* Premium section */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    <b>Premium Rows</b>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    name="totalPremiumSeatRow"
                    onChange={handleInput}
                    value={screen.totalPremiumSeatRow}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    <b>Premium Seats (Auto)</b>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={screen.totalPremiumSeats}
                    disabled
                  />
                </div>

                {/* Gold section */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    <b>Gold Rows</b>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    name="totalGoldSeatRow"
                    onChange={handleInput}
                    value={screen.totalGoldSeatRow}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    <b>Gold Seats (Auto)</b>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={screen.totalGoldSeats}
                    disabled
                  />
                </div>

                {/* Seating distribution */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">
                    <b>Left Seats per Row</b>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    name="totalLeftSideSeats"
                    onChange={handleInput}
                    value={screen.totalLeftSideSeats}
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">
                    <b>Middle Seats per Row</b>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    name="totalMiddleSeats"
                    onChange={handleInput}
                    value={screen.totalMiddleSeats}
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">
                    <b>Right Seats per Row</b>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    name="totalRightSideSeats"
                    onChange={handleInput}
                    value={screen.totalRightSideSeats}
                  />
                </div>

                {/* Submit Button */}
                <div className="d-flex align-items-center justify-content-center mb-2">
                  <button
                    type="submit"
                    className="btn bg-color custom-bg-text"
                    onClick={saveScreen}
                  >
                    Add Screen
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddScreenForm;
