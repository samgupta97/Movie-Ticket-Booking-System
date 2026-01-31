import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../api/api";

const AddTheatreForm = () => {
  const [locations, setLocations] = useState([]);
  const [selectedImage, setSelectImage] = useState(null);

  // Fixed coordinates
  const latitude = 28.6139;
  const longitude = 77.2090;

  const theatreManager = JSON.parse(sessionStorage.getItem("active-theatre"));
  const theatre_jwtToken = sessionStorage.getItem("theatre-jwtToken");

  const navigate = useNavigate();

  // Fetch all locations (NO async/await)
  useEffect(() => {
    axios
      .get(`${BASE_URL}/location/fetch/all`)
      .then((res) => {
        if (res.data) {
          setLocations(res.data.locations || []);
        }
      })
      .catch((err) => {
        console.error("Error fetching locations", err);
      });
  }, []);

  const [theatre, setTheatre] = useState({
    name: "",
    address: "",
    locationId: "",
    managerContact: "",
    emailId: "",
    description: "",
  });

  const handleInput = (e) => {
    setTheatre({ ...theatre, [e.target.name]: e.target.value });
  };

  const saveTheatre = (e) => {
    e.preventDefault();

    if (!theatre.name || !theatre.address || !theatre.locationId) {
      alert("Missing input fields!");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedImage);
    formData.append("name", theatre.name);
    formData.append("address", theatre.address);
    formData.append("locationId", theatre.locationId);
    formData.append("managerContact", theatre.managerContact);
    formData.append("emailId", theatre.emailId);
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);
    formData.append("managerId", theatreManager.id);
    formData.append("description", theatre.description);

    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    axios
      .post(`${BASE_URL}/theatre/add`, formData, {
        headers: {
          Authorization: "Bearer " + theatre_jwtToken,
        },
      })
      .then((resp) => {
        const response = resp.data;

        if (response.success) {
          alert("Theatre added successfully!");

          theatreManager.theatre = response.theatres[0];

          sessionStorage.setItem(
            "active-theatre",
            JSON.stringify(theatreManager)
          );

          navigate("/theatre/detail/view"); // better than reload
        } else {
          alert("Failed to add Theatre!");
        }
      })
      .catch((error) => {
        console.error(error);
        alert("Server error!");
      });
  };

  return (
    <div className="mt-2 d-flex align-items-center justify-content-center mb-4">
      <div className="card form-card shadow-lg" style={{ width: "45rem" }}>
        <div className="container-fluid">
          <div
            className="card-header bg-color custom-bg-text mt-2 text-center"
            style={{ borderRadius: "1em", height: "45px" }}
          >
            <h5 className="card-title h5">Add Theatre Detail</h5>
          </div>

          <div className="card-body">
            <form className="row g-3" onSubmit={saveTheatre}>
              <div className="col-md-6 mb-3">
                <label className="form-label"><b>Theatre Name</b></label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={theatre.name}
                  onChange={handleInput}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label"><b>Theatre Contact</b></label>
                <input
                  type="number"
                  className="form-control"
                  name="managerContact"
                  value={theatre.managerContact}
                  onChange={handleInput}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label"><b>Description</b></label>
                <textarea
                  className="form-control"
                  name="description"
                  rows="3"
                  value={theatre.description}
                  onChange={handleInput}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label"><b>Address</b></label>
                <textarea
                  className="form-control"
                  name="address"
                  rows="3"
                  value={theatre.address}
                  onChange={handleInput}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label"><b>Email ID</b></label>
                <input
                  type="email"
                  className="form-control"
                  name="emailId"
                  value={theatre.emailId}
                  onChange={handleInput}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label"><b>Location</b></label>
                <select
                  name="locationId"
                  className="form-control"
                  value={theatre.locationId}
                  onChange={handleInput}
                >
                  <option value="">Select Location</option>
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.city} - [{loc.downtown}]
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-12 mb-3">
                <label className="form-label"><b>Select Image</b></label>
                <input
                  type="file"
                  className="form-control"
                  onChange={(e) => setSelectImage(e.target.files[0])}
                  required
                />
              </div>

              <div className="col-md-12 mb-3">
                <b>Using Fixed Coordinates:</b><br />
                Latitude: {latitude}<br />
                Longitude: {longitude}
              </div>

              <div className="d-flex justify-content-center mb-2">
                <button type="submit" className="btn bg-color custom-bg-text">
                  Add Theatre
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTheatreForm;
