import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TheatreHeader = () => {
  const navigate = useNavigate();

  const user = JSON.parse(sessionStorage.getItem("active-theatre"));
  console.log(user);

  const theatreLogout = () => {
    toast.success("logged out!!!", {
      position: "top-center",
      autoClose: 1000,
    });

    sessionStorage.removeItem("active-theatre");
    sessionStorage.removeItem("theatre-jwtToken");

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

      {/* SCREENS */}
      <li className="nav-item dropdown">
        <DropdownToggle>Screens</DropdownToggle>
        <ul className="dropdown-menu">
          <li>
            <Link to="/theatre/screen/add" className="dropdown-item">
              Add Screen
            </Link>
          </li>
          <li>
            <Link to="/theatre/screen/view" className="dropdown-item">
              View Screens
            </Link>
          </li>
        </ul>
      </li>

      {/* MOVIES */}
      <li className="nav-item dropdown">
        <DropdownToggle>Movies</DropdownToggle>
        <ul className="dropdown-menu">
          <li>
            <Link to="/theatre/movie/add" className="dropdown-item">
              Add Movie
            </Link>
          </li>
          <li>
            <Link to="/theatre/movie/view" className="dropdown-item">
              View Movies
            </Link>
          </li>
        </ul>
      </li>

      {/* SHOWS */}
      <li className="nav-item dropdown">
        <DropdownToggle>Shows</DropdownToggle>
        <ul className="dropdown-menu">
          <li>
            <Link to="/theatre/show/add" className="dropdown-item">
              Add Show
            </Link>
          </li>
          <li>
            <Link to="/theatre/show/view" className="dropdown-item">
              View Shows
            </Link>
          </li>
        </ul>
      </li>

      {/* BOOKINGS */}
      <li className="nav-item dropdown">
        <DropdownToggle>Bookings</DropdownToggle>
        <ul className="dropdown-menu">
          <li>
            <Link to="/theatre/show/bookings" className="dropdown-item">
              Movie Bookings
            </Link>
          </li>
        </ul>
      </li>

      {/* THEATRE */}
      <li className="nav-item dropdown">
        <DropdownToggle>Theatre</DropdownToggle>
        <ul className="dropdown-menu">
          {!user?.theatre ? (
            <li>
              <Link to="/theatre/add" className="dropdown-item">
                Add Theatre
              </Link>
            </li>
          ) : (
            <>
              <li>
                <Link to="/theatre/detail/view" className="dropdown-item">
                  View Detail
                </Link>
              </li>
              <li>
                <Link to="/theatre/wallet/detail" className="dropdown-item">
                  Wallet
                </Link>
              </li>
            </>
          )}
        </ul>
      </li>

      {/* LOGOUT */}
      <li className="nav-item">
        <button
          onClick={theatreLogout}
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

export default TheatreHeader;
