import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../api/api";

const AddLocation = () => {
  const admin_jwtToken = sessionStorage.getItem("admin-jwtToken");

  const [city, setCity] = useState("");
  const [downtown, setDowntown] = useState("");

  const navigate = useNavigate();

  // Fixed Lat & Lng
  const FIXED_LAT = 19.0760;
  const FIXED_LNG = 72.8777;

  const handleSubmit = (e) => {
    e.preventDefault();

    const locationData = {
      city,
      downtown,
      latitude: FIXED_LAT,
      longitude: FIXED_LNG,
    };

    axios
      .post(`${BASE_URL}/location/add`, locationData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${admin_jwtToken}`,
        },
      })
      .then((res) => {
        if (res.data.success) {
          alert("Location added successfully!");
          navigate("/home");
        } else {
          alert("Something went wrong!");
        }
      })
      .catch(() => {
        alert("Server error. Please try again later.");
      });
  };

  return (
    <div style={{ width: "100vw", padding: "30px" }}>
      <h2>Add Location</h2>

      <form onSubmit={handleSubmit} style={{ width: "400px" }}>
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
            border: "1px solid gray",
            borderRadius: "5px",
          }}
        />

        <input
          type="text"
          placeholder="Downtown (e.g. BKC)"
          value={downtown}
          onChange={(e) => setDowntown(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
            border: "1px solid gray",
            borderRadius: "5px",
          }}
        />

        <p>Latitude: {FIXED_LAT}</p>
        <p>Longitude: {FIXED_LNG}</p>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            background: "blue",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Add Location
        </button>
      </form>
    </div>
  );
};

export default AddLocation;
