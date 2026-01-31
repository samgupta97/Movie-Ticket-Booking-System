import { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Modal, Button } from "react-bootstrap";
import BASE_URL from "../api/api";

const ViewTheatreMovies = () => {
  const [movies, setMovies] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    const theatreManager = JSON.parse(sessionStorage.getItem("active-theatre"));
    const theatre_jwtToken = sessionStorage.getItem("theatre-jwtToken");

    axios
      .get(
        `${BASE_URL}/movie/fetch/theatre-wise?theatreId=${theatreManager.theatre.id}`,
        {
          headers: { Authorization: "Bearer " + theatre_jwtToken },
        }
      )
      .then((response) => {
        if (response.data) setMovies(response.data.movies);
      })
      .catch(() => {
        alert("Unable to fetch movies. Server error.");
      });
  }, []);

  const deleteMovie = (movieId) => {
    const theatre_jwtToken = sessionStorage.getItem("theatre-jwtToken");

    axios
      .delete(`${BASE_URL}/movie/delete?movieId=` + movieId, {
        headers: { Authorization: "Bearer " + theatre_jwtToken },
      })
      .then((response) => {
        if (response.data.success) {
          alert("Movie deleted successfully!");
          setMovies((prev) => prev.filter((m) => m.id !== movieId));
        } else {
          alert(response.data.responseMessage || "Failed to delete movie.");
        }
      })
      .catch(() => alert("Server error."));
  };

  const openEditModal = (movie) => {
    setSelectedMovie({ ...movie });
    setShowEditModal(true);
  };

  const saveMovieChanges = () => {
    const theatre_jwtToken = sessionStorage.getItem("theatre-jwtToken");

    axios
      .put(
        `${BASE_URL}/movie/update/detail`,
        {
          movieId: selectedMovie.id,
          ...selectedMovie,
        },
        {
          headers: {
            Authorization: "Bearer " + theatre_jwtToken,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        if (res.data.success) {
          alert("Movie details updated!");

          setMovies((prev) =>
            prev.map((m) =>
              m.id === selectedMovie.id ? selectedMovie : m
            )
          );
        } else {
          alert(res.data.responseMessage);
        }
      })
      .catch(() => alert("Server error while updating movie."));
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
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {movies.map((movie) => (
                  <tr key={movie.id}>
                    <td>
                      <img
                        src={`${BASE_URL}/theatre/${movie.posterImage}`}
                        alt="poster"
                        className="img-fluid"
                        style={{ maxWidth: "90px" }}
                      />
                    </td>

                    <td><b>{movie.title}</b></td>
                    <td><b>{movie.description}</b></td>
                    <td><b>{movie.director}</b></td>
                    <td><b>{movie.producer}</b></td>
                    <td><b>{movie.language}</b></td>
                    <td><b>{movie.duration}</b></td>

                    <td>
                      <button
                        onClick={() => deleteMovie(movie.id)}
                        className="btn btn-lg bg-color custom-bg-text"
                      >
                        <FaTrash />
                      </button>

                      <button
                        onClick={() => openEditModal(movie)}
                        className="btn btn-lg bg-color custom-bg-text mt-2"
                      >
                        <FaEdit />
                      </button>
                    </td>
                  </tr>
                ))}

                {movies.length === 0 && (
                  <tr>
                    <td colSpan="8">
                      <b>No movies found.</b>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Movie</Modal.Title>
        </Modal.Header>

        {selectedMovie && (
          <Modal.Body>
            <div className="row">
              <div className="col-md-4 text-center">
                <img
                  src={`${BASE_URL}/theatre/${selectedMovie.posterImage}`}
                  className="img-fluid mb-3"
                  style={{ maxHeight: "350px" }}
                  alt="poster"
                />
              </div>

              <div className="col-md-8">
                {/* form unchanged */}
                <button
                  className="btn btn-success w-100 mt-3"
                  onClick={saveMovieChanges}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </Modal.Body>
        )}

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ViewTheatreMovies;
