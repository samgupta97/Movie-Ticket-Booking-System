import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTrash } from "react-icons/fa";
import BASE_URL from "../api/api";

const ViewAllLocations = () => {
  const [allLocations, setAllLocations] = useState([]);
  const admin_jwtToken = sessionStorage.getItem("admin-jwtToken");

  useEffect(() => {
    axios
      .get(`${BASE_URL}/location/fetch/all`)
      .then((response) => {
        setAllLocations(response.data.locations);
      })
      .catch((error) => {
        console.error(error);
        alert("Failed to fetch locations");
      });
  }, []);

  const deleteLocation = (locationId) => {
    axios
      .delete(`${BASE_URL}/location/delete`, {
        params: { locationId },
        headers: {
          Authorization: "Bearer " + admin_jwtToken,
        },
      })
      .then((response) => {
        if (response.data.success) {
          alert(response.data.responseMessage);

          // remove deleted location from UI (NO reload)
          setAllLocations((prev) =>
            prev.filter((location) => location.id !== locationId)
          );
        } else {
          alert(response.data.responseMessage);
        }
      })
      .catch((error) => {
        console.error(error);
        alert("It seems the server is down");
      });
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
          <h5 className="h5">All Locations</h5>
        </div>

        <div className="card-body" style={{ overflowY: "auto" }}>
          <div className="table-responsive">
            <table className="table table-hover text-center">
              <thead className="table-bordered border-color bg-color custom-bg-text">
                <tr>
                  <th>Downtown</th>
                  <th>City</th>
                  <th>Latitude</th>
                  <th>Longitude</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {allLocations.map((location) => (
                  <tr key={location.id}>
                    <td><b>{location.downtown}</b></td>
                    <td><b>{location.city}</b></td>
                    <td><b>{location.latitude}</b></td>
                    <td><b>{location.longitude}</b></td>
                    <td>
                      <button
                        onClick={() => deleteLocation(location.id)}
                        className="btn btn-lg bg-color custom-bg-text ms-2"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAllLocations;
