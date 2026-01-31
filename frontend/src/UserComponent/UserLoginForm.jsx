import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../api/api";
const UserLoginForm = () => {
  const navigate = useNavigate();

  const [loginRequest, setLoginRequest] = useState({
    emailId: "",
    password: "",
    role: "",
  });

  const handleUserInput = (e) => {
    setLoginRequest({ ...loginRequest, [e.target.name]: e.target.value });
  };

  const loginAction = (e) => {
    e.preventDefault();

    axios
      .post(`${BASE_URL}/user/login`, loginRequest, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const res = response.data;

        if (res.success) {
          if (!res.jwtToken) {
            alert("Token missing! Please try again.");
            return;
          }

          const user = res.user;
          const token = res.jwtToken;

          // Save session based on role
          if (user.role === "Admin") {
            sessionStorage.setItem("active-admin", JSON.stringify(user));
            sessionStorage.setItem("admin-jwtToken", token);
          } else if (user.role === "Customer") {
            sessionStorage.setItem("active-customer", JSON.stringify(user));
            sessionStorage.setItem("customer-jwtToken", token);
          } else if (user.role === "Theatre") {
            sessionStorage.setItem("active-theatre", JSON.stringify(user));
            sessionStorage.setItem("theatre-jwtToken", token);
          }

          // Trigger navbar re-render
          window.dispatchEvent(new Event("storage"));

          alert(res.responseMessage || "Login successful");

          navigate("/home");
        } else {
          alert(res.responseMessage || "Login failed");
        }
      })
      .catch((error) => {
        console.error(error);
        alert("Server unavailable. Try again later.");
      });
  };

  return (
    <div className="mt-2 mb-5 d-flex align-items-center justify-content-center">
      <div className="form-card border-color" style={{ width: "25rem" }}>
        <div className="container-fluid">
          <div
            className="card-header bg-color custom-bg-text mt-2 d-flex justify-content-center align-items-center"
            style={{ borderRadius: "1em", height: "38px" }}
          >
            <h5 className="card-title h5">User Login</h5>
          </div>

          <div className="card-body mt-3">
            <form onSubmit={loginAction}>
              <div className="mb-3">
                <label className="form-label">
                  <b>User Role</b>
                </label>
                <select
                  className="form-control"
                  name="role"
                  value={loginRequest.role}
                  onChange={handleUserInput}
                  required
                >
                  <option value="">Select Role</option>
                  <option value="Admin">Admin</option>
                  <option value="Theatre">Theatre</option>
                  <option value="Customer">Customer</option>
                </select>

              </div>

              <div className="mb-3">
                <label className="form-label">
                  <b>Email Id</b>
                </label>
                <input
                  type="email"
                  className="form-control"
                  name="emailId"
                  value={loginRequest.emailId}
                  onChange={handleUserInput}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">
                  <b>Password</b>
                </label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  value={loginRequest.password}
                  onChange={handleUserInput}
                  required
                />
              </div>

              <div className="d-flex justify-content-center mb-2">
                <button type="submit" className="btn bg-color custom-bg-text">
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLoginForm;
