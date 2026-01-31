import { Link } from "react-router-dom";

const NormalHeader = () => {
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

      {/* REGISTER USER */}
      <li className="nav-item dropdown">
        <DropdownToggle>Register User</DropdownToggle>
        <ul className="dropdown-menu">
          <li>
            <Link
              to="/user/theatre/register"
              className="dropdown-item"
            >
              Theatre
            </Link>
          </li>

          <li>
            <Link
              to="/user/customer/register"
              className="dropdown-item"
            >
              Customer
            </Link>
          </li>
        </ul>
      </li>

      {/* LOGIN */}
      <li className="nav-item">
        <Link to="/user/login">
          <button
            className="btn btn-outline-danger ms-2 fw-bold"
            style={{ borderRadius: "30px" }}
          >
            Login User
          </button>
        </Link>
      </li>

    </ul>
  );
};

export default NormalHeader;
