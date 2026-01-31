import { FaClock } from "react-icons/fa";
import { Link } from "react-router-dom";
import BASE_URL from "../api/api";
const ShowCard = ({ item }) => {
  const descriptionToShow = (description, maxLength) => {
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + "...";
  };

  function formatShowDateTime(showDate, startTime, endTime) {
    const pad = (n) => String(n).padStart(2, "0");
    return `${showDate[0]}-${pad(showDate[1])}-${pad(showDate[2])} ${pad(
      startTime[0]
    )}:${pad(startTime[1])} - ${pad(endTime[0])}:${pad(endTime[1])}`;
  }

  return (
    <div className="col">
      <Link
        to={`/theatre/show/detail/${item.id}`}
        className="text-decoration-none text-dark"
      >
        <div className="card show-card shadow-lg border-0 rounded-4 h-100">
          <div
            style={{
              height: "350px",
              backgroundColor: "#000",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderTopLeftRadius: "1rem",
              borderTopRightRadius: "1rem",
              overflow: "hidden",
            }}
          >
            <img
              src={`${BASE_URL}/theatre/${item?.movie?.posterImage}`}
              alt="img"
              style={{
                maxHeight: "100%",
                maxWidth: "100%",
                objectFit: "contain",
              }}
            />
          </div>

          <div className="card-body px-4 py-3">
            <h5 className="card-title text-color-second fw-bold text-truncate h5">
              {item?.movie?.title}
            </h5>
            <p
              className="card-text text-muted mb-2"
              style={{ fontSize: "0.9rem" }}
            >
              {descriptionToShow(item?.movie?.description, 60)}
            </p>
            <div
              className="d-flex align-items-center text-color-second"
              style={{ fontSize: "0.9rem" }}
            >
              <FaClock className="me-2" />
              <span>
                {formatShowDateTime(
                  item?.showDate,
                  item?.startTime,
                  item?.endTime
                )}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ShowCard;
