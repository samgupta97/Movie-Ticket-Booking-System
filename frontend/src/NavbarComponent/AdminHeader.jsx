import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminHeader = () => {
  const navigate = useNavigate();

  const user = JSON.parse(sessionStorage.getItem("active-admin"));
  console.log(user);

  const adminLogout = () => {
    toast.success("logged out!!!", {
      position: "top-center",
      autoClose: 1000,
    });

    sessionStorage.removeItem("active-admin");
    sessionStorage.removeItem("admin-jwtToken");

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

      {/* THEATRES */}
      <li className="nav-item dropdown">
        <DropdownToggle>Theatres</DropdownToggle>
        <ul className="dropdown-menu">
          <li>
            <Link to="/theatre/pending/" className="dropdown-item">
              Pending
            </Link>
          </li>
          <li>
            <Link to="/theatre/approved" className="dropdown-item">
              Approved
            </Link>
          </li>
        </ul>
      </li>

      {/* USERS */}
      <li className="nav-item dropdown">
        <DropdownToggle>User</DropdownToggle>
        <ul className="dropdown-menu">
          <li>
            <Link to="/admin/customer/all" className="dropdown-item">
              View Customers
            </Link>
          </li>
          <li>
            <Link to="/admin/theatre/manager/all" className="dropdown-item">
              All Managers
            </Link>
          </li>
          <li>
            <Link to="/user/admin/register" className="dropdown-item">
              Register Admin
            </Link>
          </li>
        </ul>
      </li>

      {/* LOCATION */}
      <li className="nav-item dropdown">
        <DropdownToggle>Location</DropdownToggle>
        <ul className="dropdown-menu">
          <li>
            <Link to="/location/add" className="dropdown-item">
              Add Location
            </Link>
          </li>
          <li>
            <Link to="/location/view/all" className="dropdown-item">
              All Locations
            </Link>
          </li>
        </ul>
      </li>

      {/* SCREENS */}
      <li className="nav-item dropdown">
        <DropdownToggle>Screens</DropdownToggle>
        <ul className="dropdown-menu">
          <li>
            <Link to="/admin/theatre/screen/all" className="dropdown-item">
              All Screens
            </Link>
          </li>
        </ul>
      </li>

      {/* MOVIES */}
      <li className="nav-item dropdown">
        <DropdownToggle>Movies</DropdownToggle>
        <ul className="dropdown-menu">
          <li>
            <Link to="/admin/theatre/movies/all" className="dropdown-item">
              All Movies
            </Link>
          </li>
        </ul>
      </li>

      {/* SHOWS */}
      <li className="nav-item dropdown">
        <DropdownToggle>Shows</DropdownToggle>
        <ul className="dropdown-menu">
          <li>
            <Link to="/admin/theatre/show/all" className="dropdown-item">
              All Shows
            </Link>
          </li>
        </ul>
      </li>

      {/* BOOKINGS */}
      <li className="nav-item dropdown">
        <DropdownToggle>Bookings</DropdownToggle>
        <ul className="dropdown-menu">
          <li>
            <Link to="/admin/theatre/show/bookings" className="dropdown-item">
              All Bookings
            </Link>
          </li>
        </ul>
      </li>

      {/* LOGOUT */}
      <li className="nav-item">
        <button
          onClick={adminLogout}
          className="btn btn-outline-danger ms-2 fw-bold"
          style={{ borderRadius: "30px" }}
        >
          Logout
        </button>
        <ToastContainer />
      </li>
    </ul>
  );
};

export default AdminHeader;
