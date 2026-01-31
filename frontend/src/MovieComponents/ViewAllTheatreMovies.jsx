import { useState, useEffect } from "react";
import axios from "axios";
import { FaEye, FaTrash } from "react-icons/fa";
import { Button, Modal } from "react-bootstrap";
import BASE_URL from "../api/api";

const ViewAllTheatreMovies = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState({ theatre: { name: "" } });
  const [showModal, setShowModal] = useState(false);

  const admin_jwtToken = sessionStorage.getItem("admin-jwtToken");


  useEffect(() => {
    const token = sessionStorage.getItem("admin-jwtToken");

    axios
      .get(`${BASE_URL}/movie/fetch/status-wise?status=Active`, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((response) => {
        if (response.data) {
          setMovies(response.data.movies);
        }
      })
      .catch(() => {
        alert("Unable to fetch movies. Server error.");
      });
  }, []);


  const viewMovieDetail = (movie) => {
    setSelectedMovie(movie);
    setShowModal(true);
  };

  const deleteMovie = (movieId) => {
    if (!window.confirm("Are you sure you want to delete this movie?")) return;

    axios
      .delete(`${BASE_URL}/movie/delete?movieId=` + movieId, {
        headers: { Authorization: "Bearer " + admin_jwtToken },
      })
      .then((response) => {
        const res = response.data;

        if (res.success) {
          alert("Movie deleted successfully!");
          setMovies((prev) => prev.filter((m) => m.id !== movieId));
        } else {
          alert(res.responseMessage || "Failed to delete movie.");
        }
      })
      .catch(() => {
        alert("Server error. Try again.");
      });
  };

  return (
    <div className="mt-3">
      <div className="card form-card ms-2 me-2 mb-5 shadow-lg" style={{ height: "45rem" }}>
        <div className="card-header custom-bg-text text-center bg-color" style={{ borderRadius: "1em", height: "50px" }}>
          <h4 className="h4">All Movies</h4>
        </div>

        <div className="card-body" style={{ overflowY: "auto" }}>
          <div className="table-responsive">
            <table className="table table-hover text-center">
              <thead className="table-bordered border-color bg-color custom-bg-text">
                <tr>
                  <th>Movie</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Director</th>
                  <th>Producer</th>
                  <th>Language</th>
                  <th>Duration</th>
                  <th>Theatre</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {movies.map((movie) => (
                  <tr key={movie.id}>
                    <td>
                      <img
                        src={`${BASE_URL}/theatre/` + movie.posterImage}
                        alt="poster"
                        style={{ maxWidth: "90px" }}
                      />
                    </td>
                    <td><b>{movie.title}</b></td>
                    <td><b>{movie.description}</b></td>
                    <td><b>{movie.director}</b></td>
                    <td><b>{movie.producer}</b></td>
                    <td><b>{movie.language}</b></td>
                    <td><b>{movie.duration}</b></td>
                    <td><b>{movie.theatre.name}</b></td>

                    <td>
                      <button
                        onClick={() => deleteMovie(movie.id)}
                        className="btn btn-lg bg-color custom-bg-text"
                      >
                        <FaTrash />
                      </button>

                      <button
                        onClick={() => viewMovieDetail(movie)}
                        className="btn btn-lg bg-color custom-bg-text mt-2"
                      >
                        <FaEye />
                      </button>
                    </td>
                  </tr>
                ))}

                {movies.length === 0 && (
                  <tr>
                    <td colSpan="9"><b>No movies found.</b></td>
                  </tr>
                )}
              </tbody>

            </table>
          </div>
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton className="bg-color custom-bg-text">
          <Modal.Title>Movie Detail</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="container-fluid">
            <div className="row">

              <div className="col-md-4 text-center mb-3">
                <img
                  src={`${BASE_URL}/theatre/` + selectedMovie.posterImage}
                  alt="poster"
                  style={{ maxHeight: "450px", width: "auto" }}
                />
              </div>

              <div className="col-md-8">
                <h3>{selectedMovie.title}</h3>
                <p><strong>Description:</strong> {selectedMovie.description}</p>
                <p><strong>Director:</strong> {selectedMovie.director}</p>
                <p><strong>Producer:</strong> {selectedMovie.producer}</p>
                <p><strong>Cast:</strong> {selectedMovie.cast}</p>
                <p><strong>Language:</strong> {selectedMovie.language}</p>
                <p><strong>Genre:</strong> {selectedMovie.genre}</p>
                <p><strong>Duration:</strong> {selectedMovie.duration}</p>
                <p><strong>Release Date:</strong> {selectedMovie.releaseDate}</p>
                <p><strong>Certification:</strong> {selectedMovie.certification}</p>
                <p><strong>Format:</strong> {selectedMovie.format}</p>
                <p>
                  <strong>Trailer:</strong>{" "}
                  <a href={selectedMovie.trailerUrl} target="_blank" rel="noreferrer">
                    Watch Trailer
                  </a>
                </p>
              </div>

              <div className="col-12 mt-4">
                <h5>Theatre Info</h5>
                <p><strong>Name:</strong> {selectedMovie.theatre.name}</p>
                <p><strong>Address:</strong> {selectedMovie.theatre.address}</p>
                <p><strong>Manager Contact:</strong> {selectedMovie.theatre.managerContact}</p>
                <p><strong>Email:</strong> {selectedMovie.theatre.emailId}</p>
                <p><strong>Description:</strong> {selectedMovie.theatre.description}</p>
                {/* <p>
                  <strong>Location:</strong>{" "}
                  {selectedMovie.theatre.location.city} - {selectedMovie.theatre.location.downtown}
                </p> */}
              </div>

            </div>
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

export default ViewAllTheatreMovies;
