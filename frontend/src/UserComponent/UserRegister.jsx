import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../api/api";
const UserRegister = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    password: "",
    phoneNo: "",
    role: "",
  });

  useEffect(() => {
    if (document.URL.indexOf("customer") !== -1) {
      setUser((prev) => ({ ...prev, role: "Customer" }));
    } else if (document.URL.indexOf("theatre") !== -1) {
      setUser((prev) => ({ ...prev, role: "Theatre" }));
    }
  }, []);

  const handleUserInput = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const saveUser = (e) => {
    e.preventDefault();

    axios
      .post(`${BASE_URL}/user/register`, user, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((res) => {
        if (res.data.success) {
          alert(res.data.responseMessage);
          navigate("/user/login");
        } else {
          alert(res.data.responseMessage);
        }
      })
      .catch((error) => {
        console.error(error);
        alert("It seems server is down");
      });
  };

  return (
    <div className="mt-2 d-flex align-items-center justify-content-center ms-2 me-2 mb-2">
      <div className="form-card border-color" style={{ width: "50rem" }}>
        <div className="container-fluid">
          <div
            className="card-header bg-color custom-bg-text mt-2 d-flex justify-content-center align-items-center"
            style={{ borderRadius: "1em", height: "45px" }}
          >
            <h5 className="card-title h5">
              Register{" "}
              {user.role ? user.role : "User"}
            </h5>
          </div>

          <div className="card-body mt-3">
            <form className="row g-3" onSubmit={saveUser}>
              <div className="col-md-6 mb-3">
                <label className="form-label"><b>First Name</b></label>
                <input
                  type="text"
                  className="form-control"
                  name="firstName"
                  value={user.firstName}
                  onChange={handleUserInput}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label"><b>Last Name</b></label>
                <input
                  type="text"
                  className="form-control"
                  name="lastName"
                  value={user.lastName}
                  onChange={handleUserInput}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label"><b>Email Id</b></label>
                <input
                  type="email"
                  className="form-control"
                  name="emailId"
                  value={user.emailId}
                  onChange={handleUserInput}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label"><b>Password</b></label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  value={user.password}
                  onChange={handleUserInput}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label"><b>Contact No</b></label>
                <input
                  type="number"
                  className="form-control"
                  name="phoneNo"
                  value={user.phoneNo}
                  onChange={handleUserInput}
                />
              </div>

              <div className="d-flex justify-content-center">
                <input
                  type="submit"
                  className="btn bg-color custom-bg-text"
                  value="Register"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRegister;
