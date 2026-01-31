import React from "react";
import { Link } from "react-router-dom";
import logo from "../images/e_logo.png";

const Footer = () => {
  return (
    <footer className="custom-bg text-white pt-5 pb-3 position-relative overflow-hidden">
      <div className="container">
        {/* Branding and Tagline */}
        <div className="row text-center text-md-start align-items-center mb-4">
          <div className="col-md-6 mb-3">
            <h2 className="fw-bold">
              <img
                src={logo}
                class="d-inline-block align-top"
                alt=""
                style={{
                  width: "80px",
                }}
              />
              <span className="agbalumo-regular text-color-second ms-2 brand-font">
                Movie Magic
              </span>
            </h2>
            <p className="text-white mt-3">
              A multi-theatre movie booking platform — your favorite movies,
              languages & formats from top theatres, all in one place.
            </p>
          </div>

          <div className="col-md-6 text-md-end">
            <button className="btn btn-danger fw-bold px-4 py-2 rounded-3">
              Book Show Now!!!
            </button>
          </div>
        </div>

        <hr className="border-light" />

        {/* Footer Columns */}
        <div className="row text-center text-md-start mt-3">
          <div className="col-md-4 mb-4">
            <h6 className="fw-bold mb-2">Support</h6>
            <p className="text-muted mb-1">Email: support@themoviemagic.com</p>
            <p className="text-muted mb-1">Phone: +1 234 567 890</p>
            <p className="text-muted">Live Chat: 8am – 10pm</p>
          </div>

          <div className="col-md-4 mb-4">
            <h6 className="fw-bold mb-2">Business Hours</h6>
            <p className="text-muted mb-1">Mon–Fri: 9am – 11pm</p>
            <p className="text-muted">Sat–Sun: 10am – 12am</p>
          </div>

          <div className="col-md-4 mb-4">
            <h6 className="fw-bold mb-2">Quick Links</h6>
            <ul className="list-unstyled text-muted">
              <li>
                <Link
                  to="/theatres"
                  className="text-decoration-none text-warning"
                >
                  Browse Theatres
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-decoration-none text-warning"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-decoration-none text-warning">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center pt-3">
          <p className="m-0 text-muted">
            &copy; {new Date().getFullYear()}{" "}
            <span className="text-warning fw-bold">TheMovieMagic</span> | All
            Rights Reserved.
          </p>
        </div>
      </div>

      {/* Scroll to Top */}
      <button
        className="btn btn-danger position-absolute"
        style={{ right: "20px", bottom: "20px", borderRadius: "50%" }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        ↑
      </button>
    </footer>
  );
};

export default Footer;
