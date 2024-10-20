import { Link, useParams } from "react-router-dom";
import { useLoadTimer } from "../hooks/useLoadTimer";

function UserDetails({ users }) {
  const { id } = useParams();
  const user = users.find((u) => u.id.toString() === id);
  const { loadTime, timer } = useLoadTimer(true); // Start timing on details mount

  if (!user) return <h1>User not found</h1>;

  return (
    <div className="user-details-page">
      <Link to="/" className="back-button">
        Back to Users
      </Link>
      <p>Render Time: {loadTime !== null ? `${loadTime} ms` : `${timer} ms`}</p>{" "}
      {/* Show timer while loading */}
      <h1>
        {user.firstName} {user.lastName}
      </h1>
      <img src={user.image} alt={user.firstName} className="user-image-large" />
      <div className="user-details">
        {Object.entries(user).map(([key, value]) =>
          typeof value !== "object" || Array.isArray(value) ? (
            <p key={key}>
              <strong>{key.toUpperCase()}:</strong>{" "}
              {Array.isArray(value) ? value.join(", ") : value}
            </p>
          ) : null
        )}
      </div>
    </div>
  );
}

export default UserDetails;
