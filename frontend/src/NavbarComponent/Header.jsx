import { Link } from "react-router-dom";
import RoleNav from "./RoleNav";
import logo from "../images/e_logo.png";

const Header = () => {
  return (
    <div>
      <nav class="navbar  navbar-expand-lg custom-bg text-color">
        <div class="container-fluid text-color">
          <img
            src={logo}
            class="d-inline-block align-top"
            alt=""
            style={{
              width: "80px",
            }}
          />
          <Link to="/" className="navbar-brand">
            <i>
              <b className="agbalumo-regular text-color-second ms-2 brand-font">
                Movie Magic
              </b>
            </i>
          </Link>

          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0 ms-3">
              <li class="nav-item">
                <Link
                  to="/theatres"
                  class="nav-link active"
                  aria-current="page"
                >
                  <b className="text-color">Theatres</b>
                </Link>
              </li>

              {/* <li class="nav-item">
                <Link to="/aboutus" class="nav-link active" aria-current="page">
                  <b className="text-color">About Us</b>
                </Link>
              </li>

              <li class="nav-item">
                <Link
                  to="/contactus"
                  class="nav-link active"
                  aria-current="page"
                >
                  <b className="text-color">Contact Us</b>
                </Link>
              </li> */}

              <li class="nav-item">
                <Link to="/map" class="nav-link active" aria-current="page">
                  <b className="text-color"></b>
                </Link>
              </li>
            </ul>

            <RoleNav />
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
