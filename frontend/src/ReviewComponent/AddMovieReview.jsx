import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import BASE_URL from "../api/api";

const AddMovieReview = () => {
  const user = JSON.parse(sessionStorage.getItem("active-customer"));
  const customer_jwtToken = sessionStorage.getItem("customer-jwtToken");

  const location = useLocation();
  const movie = location.state;

  const [userId, setUserId] = useState(user.id);
  const { movieId } = useParams();

  const [star, setStar] = useState("");
  const [review, setReview] = useState("");

  const navigate = useNavigate();

  const saveReview = (e) => {
    e.preventDefault();

    if (user == null) {
      alert("Please login as Customer for adding your review!!!");
      return;
    }

    setUserId(user.id);

    const data = { userId, movieId, star, review };

    fetch(`${BASE_URL}/movie/review/add`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + customer_jwtToken,
      },
      body: JSON.stringify(data),
    }).then((result) => {
      result.json().then((res) => {
        if (res.success) {
          toast.success(res.responseMessage, {
            position: "top-center",
            autoClose: 1000,
          });

          setTimeout(() => {
            navigate("/home");
          }, 2000);
        } else {
          toast.error(res.responseMessage || "It seems server is down!", {
            position: "top-center",
            autoClose: 1000,
          });

          setTimeout(() => {
            window.location.reload(true);
          }, 2000);
        }
      });
    });
  };

  return (
    <div className="container-fluid mb-5">
      <div className="row">
        <div className="col-sm-2 mt-2"></div>

        <div className="col-sm-3 mt-2">
          <div className="card form-card border-color custom-bg">
            <img
              src={`${BASE_URL}/theatre/${movie.posterImage}`}
              className="d-block card-img-top img-fluid"
              alt="poster_img"
              style={{
                maxHeight: "450px",
                width: "auto",
                margin: "0 auto",
              }}
            />
          </div>
        </div>

        <div className="col-sm-5 mt-2">
          <div className="card form-card" style={{ width: "30rem" }}>
            <div
              className="card-header bg-color text-center"
              style={{ borderRadius: "1em", height: "45px" }}
            >
              <h5 className="card-title h5 text-white">
                Add Movie Review
              </h5>
            </div>

            <div className="card-body">
              <form onSubmit={saveReview}>
                <div className="mb-3">
                  <label className="form-label">
                    <b>Star</b>
                  </label>

                  <select
                    className="form-control"
                    onChange={(e) => setStar(e.target.value)}
                  >
                    <option value="">Select Star</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="review" className="form-label">
                    <b>Movie Review</b>
                  </label>
                  <textarea
                    className="form-control"
                    id="review"
                    rows="3"
                    placeholder="enter review.."
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                  />
                </div>

                <input
                  type="submit"
                  className="btn bg-color custom-bg-text"
                  value="Add Review"
                />

                <ToastContainer />
              </form>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AddMovieReview;
