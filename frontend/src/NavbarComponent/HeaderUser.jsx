import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HeaderUser = () => {
  const navigate = useNavigate();

  const userLogout = () => {
    toast.success("logged out!!!", {
      position: "top-center",
      autoClose: 1000,
    });

    sessionStorage.removeItem("active-customer");
    sessionStorage.removeItem("customer-jwtToken");

    setTimeout(() => {
      window.location.reload(true);
      navigate("/home");
    }, 2000);
  };

  const DropdownToggle = ({ children }) => (
    <button
      type="button"
      className="nav-link dropdown-toggle text-color bg-transparent border-0"
      data-bs-toggle="dropdown"
      aria-expanded="false"
    >
      <b>{children}</b>
    </button>
  );

  return (
    <ul className="navbar-nav ms-auto mb-2 mb-lg-0 me-5">

      {/* BOOKINGS */}
      <li className="nav-item dropdown">
        <DropdownToggle>Bookings</DropdownToggle>
        <ul className="dropdown-menu">
          <li>
            <Link
              to="/customer/show/bookings"
              className="dropdown-item"
            >
              My Bookings
            </Link>
          </li>
        </ul>
      </li>

      {/* WALLET */}
      <li className="nav-item dropdown">
        <DropdownToggle>Wallet</DropdownToggle>
        <ul className="dropdown-menu">
          <li>
            <Link
              to="/customer/wallet/detail"
              className="dropdown-item"
            >
              My Wallet
            </Link>
          </li>
        </ul>
      </li>

      {/* LOGOUT */}
      <li className="nav-item">
        <button
          onClick={userLogout}
          className="btn btn-link nav-link fw-bold text-color"
          style={{ textDecoration: "none" }}
        >
          Logout
        </button>
        <ToastContainer />
      </li>

    </ul>
  );
};

export default HeaderUser;
