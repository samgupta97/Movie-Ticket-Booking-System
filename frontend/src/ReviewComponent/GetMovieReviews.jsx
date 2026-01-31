import { useEffect, useState } from "react";
import axios from "axios";
import star from "../images/star.png";
import BASE_URL from "../api/api";

const GetMovieReviews = ({ movie }) => {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState("0.0");

  useEffect(() => {
    const getAllReviews = async () => {
      if (!movie?.id) return;

      const response = await axios.get(
        `${BASE_URL}/movie/review/fetch?movieId=${movie.id}`
      );

      if (response.data) {
        setReviews(response.data.reviews);
        setRating(response.data.averageRating);
      }
    };

    getAllReviews();
  }, []);

  return (
    <div
      className="list-group form-card border-color"
      style={{ height: "28rem" }}
    >
      <div className="list-group-item list-group-item-action bg-color custom-bg-text">
        <b>
          Movie Rating: {rating}
          <img
            src={star}
            width="20"
            height="20"
            className="d-inline-block align-top ms-1"
            alt="star"
          />
        </b>
      </div>

      <div style={{ overflowY: "auto" }}>
        {reviews.map((review, index) => (
          <div
            key={index}
            className="list-group-item list-group-item-action"
          >
            <b>{review.user.firstName} </b>
            <b>{review.star} /5 </b>
            <img
              src={star}
              width="20"
              height="20"
              className="d-inline-block align-top ms-1"
              alt="star"
            />
            <br />
            <p>{review.review}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GetMovieReviews;
