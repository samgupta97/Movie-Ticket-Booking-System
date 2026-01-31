import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../api/api";

const AddMovieForm = () => {
  const [selectedImage, setSelectImage] = useState(null);

  const theatreManager = JSON.parse(sessionStorage.getItem("active-theatre"));
  const theatre_jwtToken = sessionStorage.getItem("theatre-jwtToken");

  const navigate = useNavigate();

  const [movie, setMovie] = useState({
    title: "",
    description: "",
    director: "",
    producer: "",
    cast: "",
    language: "",
    genre: "",
    duration: "",
    releaseDate: "",
    certification: "",
    format: "",
    trailerUrl: "",
  });

  const handleInput = (e) => {
    setMovie({ ...movie, [e.target.name]: e.target.value });
  };

  const saveMovie = (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("image", selectedImage);
    formData.append("theatreId", theatreManager.theatre.id);

    for (let key in movie) {
      formData.append(key, movie[key]);
    }

    axios
      .post(`${BASE_URL}/movie/add`, formData, {
        headers: {
          Authorization: "Bearer " + theatre_jwtToken,
        },
      })
      .then((resp) => {
        const response = resp.data;

        if (response.success) {
          alert("Movie added successfully!");
          navigate("/theatre/home");
        } else {
          alert(response.responseMessage || "Something went wrong");
        }
      })
      .catch(() => {
        alert("Server error!");
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
              <h5 className="card-title h5">Add Movie Detail</h5>
            </div>

            <div className="card-body">
              <form className="row g-3">

                <div className="col-md-12 mb-3">
                  <label className="form-label"><b>Movie Title</b></label>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    onChange={handleInput}
                    value={movie.title}
                  />
                </div>

                <div className="col-md-12 mb-3">
                  <label className="form-label"><b>Description</b></label>
                  <textarea
                    className="form-control"
                    name="description"
                    rows="3"
                    onChange={handleInput}
                    value={movie.description}
                  ></textarea>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label"><b>Director</b></label>
                  <input
                    type="text"
                    className="form-control"
                    name="director"
                    onChange={handleInput}
                    value={movie.director}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label"><b>Producer</b></label>
                  <input
                    type="text"
                    className="form-control"
                    name="producer"
                    onChange={handleInput}
                    value={movie.producer}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label"><b>Cast</b></label>
                  <input
                    type="text"
                    className="form-control"
                    name="cast"
                    onChange={handleInput}
                    value={movie.cast}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label"><b>Language</b></label>
                  <select
                    className="form-select"
                    name="language"
                    onChange={handleInput}
                    value={movie.language}
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
                  <label className="form-label"><b>Genre</b></label>
                  <select
                    className="form-select"
                    name="genre"
                    onChange={handleInput}
                    value={movie.genre}
                  >
                    <option value="">-- Select Genre --</option>
                    <option value="Action">Action</option>
                    <option value="Comedy">Comedy</option>
                    <option value="Drama">Drama</option>
                    <option value="Horror">Horror</option>
                    <option value="Thriller">Thriller</option>
                    <option value="Romance">Romance</option>
                    <option value="Fantasy">Fantasy</option>
                    <option value="Sci-Fi">Sci-Fi</option>
                    <option value="Animation">Animation</option>
                    <option value="Documentary">Documentary</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Mystery">Mystery</option>
                    <option value="Crime">Crime</option>
                    <option value="Musical">Musical</option>
                    <option value="Historical">Historical</option>
                    <option value="Biography">Biography</option>
                    <option value="Family">Family</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label"><b>Duration</b></label>
                  <input
                    type="text"
                    className="form-control"
                    name="duration"
                    onChange={handleInput}
                    value={movie.duration}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label"><b>Release Date</b></label>
                  <input
                    type="date"
                    className="form-control"
                    name="releaseDate"
                    onChange={handleInput}
                    value={movie.releaseDate}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label"><b>Certification</b></label>
                  <select
                    className="form-select"
                    name="certification"
                    onChange={handleInput}
                    value={movie.certification}
                  >
                    <option value="">-- Select Certification --</option>
                    <option value="UA">UA</option>
                    <option value="A">A</option>
                    <option value="U">U</option>
                    <option value="S">S</option>
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label"><b>Format</b></label>
                  <select
                    className="form-select"
                    name="format"
                    onChange={handleInput}
                    value={movie.format}
                  >
                    <option value="">-- Select Format --</option>
                    <option value="2D">2D</option>
                    <option value="3D">3D</option>
                    <option value="IMAX">IMAX</option>
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label"><b>Trailer URL</b></label>
                  <input
                    type="text"
                    className="form-control"
                    name="trailerUrl"
                    onChange={handleInput}
                    value={movie.trailerUrl}
                  />
                </div>

                <div className="col-md-12 mb-3">
                  <label className="form-label"><b>Select Poster</b></label>
                  <input
                    className="form-control"
                    type="file"
                    name="image"
                    onChange={(e) => setSelectImage(e.target.files[0])}
                  />
                </div>

                <div className="d-flex align-items-center justify-content-center mb-2">
                  <button
                    type="submit"
                    className="btn bg-color custom-bg-text"
                    onClick={saveMovie}
                  >
                    Add Movie
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

export default AddMovieForm;
