import { Link } from "react-router-dom";

import pizza from "../images/Pizza.png";
import burger from "../images/Burger.png";
import drinks from "../images/Drinks.png";
import combo from "../images/Combo.png";
import chicken from "../images/Chicken.png";
import puff from "../images/Puff.png";

import cinema2 from "../images/cinema2.png";
import movie1 from "../images/movie1.png";
import movie2 from "../images/movie2.png";

import cinemaseating1 from "../images/cinemaseating1.png";
import cinemaseating2 from "../images/cinemaseating2.png";

const LandingPage = () => {
  const foodImages = {
    Pizza: pizza,
    Burger: burger,
    Drinks: drinks,
    Chicken: chicken,
    Combo: combo,
    Puff: puff,
  };

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <div
        className="hero-section text-white d-flex align-items-center custom-bg"
        style={{ minHeight: "90vh" }}
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 text-center text-md-start mb-4 mb-md-0">
              <h1 className="display-4 fw-bold">
                Book Movie Shows at Your Favorite Theatres Instantly
              </h1>
              <p className="lead mt-3">
                Discover the latest blockbusters, exclusive shows, and seamless
                ticket booking — all in one magical platform.
              </p>
              <Link
                to="/theatres"
                className="btn btn-danger px-4 py-2 mt-4 fw-bold rounded-pill shadow-sm"
              >
                Explore Theatres
              </Link>
            </div>

            <div className="col-md-6 text-center">
              <img
                src={cinema2}
                alt="Cinema"
                className="img-fluid rounded-4"
                style={{ maxWidth: "650px" }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="restaurant-section py-5 text-dark">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 mb-4 mb-md-0">
              <div className="row g-3">
                <div className="col-6">
                  <img
                    src={movie1}
                    alt="Movie 1"
                    className="img-fluid rounded-4 shadow"
                  />
                </div>
                <div className="col-6">
                  <img
                    src={movie2}
                    alt="Movie 2"
                    className="img-fluid rounded-4 shadow"
                  />
                </div>
              </div>
            </div>

            <div className="col-md-6 text-center text-md-start ps-md-5">
              <h2 className="fw-bold mb-3 h2">
                Discover Movies at Top Theatres Near You
              </h2>
              <p className="fs-5 text-muted">
                Explore the latest blockbusters, timeless classics, and
                exclusive shows playing in your local theatres.
              </p>
              <Link
                to="/theatres"
                className="btn btn-outline-danger fw-bold px-4 py-2 rounded-pill mt-3"
              >
                Explore Theatres
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container my-5">
        <div className="common-title-area text-center mb-5">
          <h3 className="h3 text-color-second fw-bold">
            <i>Theatre Food Items</i>
          </h3>
        </div>

        <div className="row justify-content-center">
          {Object.keys(foodImages).map((item, index) => (
            <div className="col-6 col-md-4 col-lg-2 mb-4" key={index}>
              <div className="card text-center shadow-sm border-0 p-2 h-100">
                <img
                  src={foodImages[item]}
                  alt={item}
                  style={{ width: 60, height: 60 }}
                />
                <h6 className="mt-2 fw-bold">{item}</h6>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="restaurant-section py-5 text-dark">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 text-center text-md-start ps-md-5">
              <h2 className="fw-bold mb-3 h2">
                Seamless Show Booking, Anytime
              </h2>
              <p className="fs-5 text-muted">
                Book your favorite shows with real-time seat availability and
                instant confirmation.
              </p>
              <Link
                to="/theatres"
                className="btn btn-outline-danger fw-bold px-4 py-2 rounded-pill mt-3"
              >
                Explore Theatres
              </Link>
            </div>

            <div className="col-md-6 mb-4 mb-md-0">
              <div className="row g-3">
                <div className="col-6">
                  <img
                    src={cinemaseating1}
                    alt="Cinema Seating"
                    className="img-fluid rounded-4 shadow"
                  />
                </div>
                <div className="col-6">
                  <img
                    src={cinemaseating2}
                    alt="Cinema Seating"
                    className="img-fluid rounded-4 shadow"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
