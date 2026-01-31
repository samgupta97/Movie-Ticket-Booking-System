import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../api/api";

const AddShowForm = () => {
  const theatreManager = JSON.parse(sessionStorage.getItem("active-theatre"));
  const theatre_jwtToken = sessionStorage.getItem("theatre-jwtToken");

  const navigate = useNavigate();

  const [screens, setScreens] = useState([]);
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    axios
      .get(
        `${BASE_URL}/theatre/screen/fetch/theatre-wise?theatreId=` +
        theatreManager.theatre.id,
        { headers: { Authorization: "Bearer " + theatre_jwtToken } }
      )
      .then((res) => setScreens(res.data.screens))
      .catch(() => alert("Failed to load screens."));

    axios
      .get(
        `${BASE_URL}/movie/fetch/theatre-wise?theatreId=` +
        theatreManager.theatre.id,
        { headers: { Authorization: "Bearer " + theatre_jwtToken } }
      )
      .then((res) => setMovies(res.data.movies))
      .catch(() => alert("Failed to load movies."));
  }, []);

  const [show, setShow] = useState({
    showDate: "",
    startTime: "",
    endTime: "",
    language: "",
    showType: "",
    movieId: "",
    screenId: "",
    goldSeatPrice: "",
    regularSeatPrice: "",
    premiumSeatPrice: "",
    theatreId: theatreManager?.theatre?.id,
  });

  const handleInput = (e) => {
    setShow({ ...show, [e.target.name]: e.target.value });
  };

  const validateTime = () => {
    if (!show.startTime || !show.endTime) return true;

    const start = show.startTime;
    const end = show.endTime;

    if (start >= end) {
      alert("End time must be greater than start time!");
      return false;
    }
    return true;
  };

  const saveShow = (e) => {
    e.preventDefault();

    if (!validateTime()) return;

    axios
      .post(`${BASE_URL}/theatre/show/add`, show, {
        headers: {
          Authorization: "Bearer " + theatre_jwtToken,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        if (res.data.success) {
          alert("Show added successfully!");
          navigate("/home");
        } else {
          alert(res.data.responseMessage || "Failed to add show.");
        }
      })
      .catch(() => alert("Server error while adding show."));
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
              <h5 className="card-title h5">Add Movie Show</h5>
            </div>

            <div className="card-body">
              <form className="row g-3">

                <div className="col-md-6 mb-3">
                  <label className="form-label"><b>Screen</b></label>
                  <select
                    className="form-select"
                    name="screenId"
                    onChange={handleInput}
                    value={show.screenId}
                  >
                    <option value="">-- Select Screen --</option>
                    {screens.map((screen) => (
                      <option key={screen.id} value={screen.id}>
                        {screen.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label"><b>Movie</b></label>
                  <select
                    className="form-select"
                    name="movieId"
                    onChange={handleInput}
                    value={show.movieId}
                  >
                    <option value="">-- Select Movie --</option>
                    {movies.map((movie) => (
                      <option key={movie.id} value={movie.id}>
                        {movie.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label"><b>Regular Seat Price</b></label>
                  <input
                    type="number"
                    className="form-control"
                    name="regularSeatPrice"
                    onChange={handleInput}
                    value={show.regularSeatPrice}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label"><b>Premium Seat Price</b></label>
                  <input
                    type="number"
                    className="form-control"
                    name="premiumSeatPrice"
                    onChange={handleInput}
                    value={show.premiumSeatPrice}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label"><b>Gold Seat Price</b></label>
                  <input
                    type="number"
                    className="form-control"
                    name="goldSeatPrice"
                    onChange={handleInput}
                    value={show.goldSeatPrice}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label"><b>Language</b></label>
                  <select
                    className="form-select"
                    name="language"
                    onChange={handleInput}
                    value={show.language}
                  >
                    <option value="">-- Select Language --</option>
                    <option value="Hindi">Hindi</option>
                    <option value="English">English</option>
                    <option value="Tamil">Tamil</option>
                    <option value="Telugu">Telugu</option>
                    <option value="Kannada">Kannada</option>
                    <option value="Malayalam">Malayalam</option>
                    <option value="Marathi">Marathi</option>
                    <option value="Bengali">Bengali</option>
                    <option value="Gujarati">Gujarati</option>
                    <option value="Punjabi">Punjabi</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label"><b>Show Type</b></label>
                  <select
                    className="form-select"
                    name="showType"
                    onChange={handleInput}
                    value={show.showType}
                  >
                    <option value="">-- Select Show Type --</option>
                    <option value="2D">2D</option>
                    <option value="3D">3D</option>
                    <option value="IMAX">IMAX</option>
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label"><b>Show Date</b></label>
                  <input
                    type="date"
                    className="form-control"
                    name="showDate"
                    value={show.showDate}
                    onChange={handleInput}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label"><b>Start Time (HH:mm)</b></label>
                  <input
                    type="text"
                    className="form-control"
                    name="startTime"
                    placeholder="10:00"
                    value={show.startTime}
                    onChange={handleInput}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label"><b>End Time (HH:mm)</b></label>
                  <input
                    type="text"
                    className="form-control"
                    name="endTime"
                    placeholder="12:30"
                    value={show.endTime}
                    onChange={handleInput}
                  />
                </div>

                <div className="d-flex align-items-center justify-content-center mb-2">
                  <button type="submit" className="btn bg-color custom-bg-text" onClick={saveShow}>
                    Add Show
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

export default AddShowForm;
