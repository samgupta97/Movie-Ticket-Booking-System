import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ShowCard from "./ShowCard";
import BASE_URL from "../api/api";

const  TheatreShows = () => {
  const { theatreId } = useParams();

  const [theatre, setTheatre] = useState({});
  const [shows, setShows] = useState([]);

  // Fetch theatre details
  useEffect(() => {
    axios
      .get(
        `${BASE_URL}/theatre/fetch/id-wise?theatreId=${theatreId}`
      )
      .then((res) => {
        if (res.data?.theatres?.length > 0) {
          setTheatre(res.data.theatres[0]);
        }
      })
      .catch(() => console.error("Error fetching theatre details"));
  }, []);

  // Fetch upcoming theatre shows
  useEffect(() => {
    axios
      .get(
        `${BASE_URL}/theatre/show/fetch/theatre-wise/upcoming?theatreId=${theatreId}`
      )
      .then((res) => setShows(res.data?.shows || []))
      .catch(() => console.error("Error fetching theatre shows"));
  }, [theatreId]);


  return (
    <div className="container-fluid mb-2">
      {/* Theatre heading */}
      <div
        className="bg-color custom-bg-text mt-2 d-flex justify-content-center align-items-center"
        style={{ borderRadius: "1em", height: "38px" }}
      >
        <h5 className="card-title ms-3 h5">Theatre Detail</h5>
      </div>

      {/* Theatre Info */}
      <div className="mt-2">
        <div className="card shadow-lg p-4">
          <div className="row">
            {/* Theatre Image */}
            <div className="col-md-4 d-flex justify-content-center">
              <img
                src={
                  theatre.image
                    ? `${BASE_URL}/theatre/${theatre.image}`
                    : "/no-image.png"
                }
                className="img-fluid rounded"
                alt={theatre.name || "Theatre"}
                style={{ maxHeight: "200px", objectFit: "cover" }}
              />
            </div>

            {/* Theatre Content */}
            <div className="col-md-8">
              <h5 className="text-uppercase fw-bold text-color-second mb-3 h5">
                {theatre.name || "—"}
              </h5>

              <div className="row">
                <div className="col-md-6">
                  <p>
                    <b>Description:</b> {theatre.description || "—"}
                  </p>
                  <p>
                    <b>Address:</b> {theatre.address || "—"}
                  </p>
                </div>

                <div className="col-md-6">
                  <p>
                    <b>Email:</b> {theatre.emailId || "—"}
                  </p>
                  <p>
                    <b>City:</b> {theatre.location?.city || "—"}
                  </p>
                  <p>
                    <b>Downtown:</b> {theatre.location?.downtown || "—"}
                  </p>
                  <p>
                    <b>Status:</b> {theatre.status || "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Shows List */}
      <div className="col-md-12 mt-4 mb-5">
        {shows.length === 0 ? (
          <h5 className="text-center text-muted mt-5">No shows available</h5>
        ) : (
          <div className="row row-cols-1 row-cols-md-4 g-4">
            {shows.map((show) => (
              <ShowCard key={show.id} item={show} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TheatreShows;
