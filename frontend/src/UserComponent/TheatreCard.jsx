import { Link } from "react-router-dom";
import locationIcon from "../images/location.png";
import BASE_URL from "../api/api";

const TheatreCard = ({ theatre }) => {
  const { id, name, description, image, location } = theatre; // destructure fields

  return (
    <div className="col">
      <div className="card theatre-card shadow-lg border-0 rounded-4 h-100">
        {/* Image */}
        <div style={{ height: "200px", overflow: "hidden", position: "relative", borderTopLeftRadius: "1rem", borderTopRightRadius: "1rem" }}>
          <img
            src={`${BASE_URL}/theatre/${image}`}
            alt={name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <span style={{ backgroundColor: "#EB455F", color: "#fff", fontWeight: "bold", padding: "4px 10px", borderRadius: "8px", position: "absolute", top: "10px", right: "10px", fontSize: "0.85rem" }}>
            {location.city}
          </span>
        </div>

        {/* Card Body */}
        <div className="card-body px-4 py-3">
          <h5 className="fw-bold text-truncate">{name}</h5>
          <p className="text-muted">{description}</p>
        </div>

        {/* Card Footer */}
        <div className="card-footer bg-white border-top-0 px-4 pb-4 d-flex justify-content-between align-items-center">
          <Link to={`/customer/theatre/${id}/shows`} className="btn rounded-pill" style={{ backgroundColor: "#eb455f", color: "#fff" }}>
            View Shows
          </Link>
          <div className="d-flex align-items-center">
            <img src={locationIcon} width="20" className="me-2" alt="location" />
            <small className="text-muted">{location.downtown}</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TheatreCard;
