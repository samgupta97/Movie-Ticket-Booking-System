import React, { useState, useEffect } from "react";
import axios from "axios";
import TheatreCard from "../UserComponent/TheatreCard";
import BASE_URL from "../api/api";

const HomePage = () => {
  const [allLocations, setAllLocations] = useState([]);
  const [locationId, setLocationId] = useState("");
  const [theatres, setTheatres] = useState([]);

  // 1️⃣ Fetch ALL Locations (runs once)
  useEffect(() => {
    axios
      .get(`${BASE_URL}/location/fetch/all`)
      .then((res) => setAllLocations(res.data?.locations || []))
      .catch(() => console.error("Error fetching locations"));
  }, []);

  // 2️⃣ Fetch ALL Approved Theatres (runs once on first load)
  useEffect(() => {
    axios
      .get(`${BASE_URL}/theatre/fetch/status-wise?status=Approved`)
      .then((res) => setTheatres(res.data?.theatres || []))
      .catch(() => console.error("Error fetching approved theatres"));
  }, []);

  // 3️⃣ Fetch Theatres BY Location (runs only when locationId changes)
  useEffect(() => {
    if (!locationId || locationId === "0") return;

    axios
      .get(
        `${BASE_URL}/theatre/fetch/location-wise?locationId=${locationId}`
      )
      .then((res) => setTheatres(res.data?.theatres || []))
      .catch(() => console.error("Error fetching theatres by location"));
  }, [locationId]);

  return (
    <div className="container mt-4">

      <div className="d-flex justify-content-center mb-4">
        <select
          onChange={(e) => setLocationId(e.target.value)}
          className="form-select w-auto fw-bold"
        >
          <option value="0">Select Location</option>
          {allLocations.map((loc) => (
            <option key={loc.id} value={loc.id}>
              {loc.city} [{loc.downtown}]
            </option>
          ))}
        </select>
      </div>

      {theatres.length > 0 ? (
        <div className="row g-4">
          {theatres.map((theatre) => (
            <TheatreCard key={theatre.id} theatre={theatre} />
          ))}
        </div>
      ) : (
        <p className="text-center">
          {locationId && locationId !== "0"
            ? "No theatres found for this location."
            : "No theatres available."}
        </p>
      )}

    </div>
  );
};

export default HomePage;
