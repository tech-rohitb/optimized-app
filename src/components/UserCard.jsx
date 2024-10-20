import React from "react";
import { Link } from "react-router-dom";
import { useLoadTimer } from "../hooks/useLoadTimer";
function UserCard({ user }) {
  const { loadTime } = useLoadTimer(false); // Not loading on card mount
  return (
    <div className="user-card">
      <img src={user.image} alt={user.firstName} className="user-image" />
      <h2>
        {user.firstName} {user.lastName}
      </h2>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Age:</strong> {user.age}
      </p>
      <p>
        <strong>Gender:</strong> {user.gender}
      </p>
      <p>
        <strong>Company:</strong> {user.company.name}
      </p>
      <p>
        <strong>Phone:</strong> {user.phone}
      </p>
      <Link to={`/user/${user.id}`}>View More Details</Link>
    </div>
  );
}

export default UserCard;

// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { useLoadTimer } from "../hooks/useLoadTimer";

// function UserCard({ user }) {
//   const { timer, loadTime } = useLoadTimer(); // Use timer for UserCard
//   const navigate = useNavigate();

//   return (
//     <div className="user-card">
//       <img src={user.image} alt={user.firstName} className="user-image" />
//       <h2>
//         {user.firstName} {user.lastName}
//       </h2>
//       <div className="user-details">
//         <h4>Card Load Time: {timer} ms</h4>
//         {loadTime && <h4>Card fully loaded in: {loadTime} ms</h4>}
//         {Object.entries(user)
//           .slice(0, 5)
//           .map(([key, value]) =>
//             typeof value !== "object" || Array.isArray(value) ? (
//               <p key={key}>
//                 <strong>{key}:</strong>{" "}
//                 {Array.isArray(value) ? value.join(", ") : value}
//               </p>
//             ) : null
//           )}
//         <button onClick={() => navigate(`/user/${user.id}`)}>
//           Show more details...
//         </button>
//       </div>
//     </div>
//   );
// }

// export default UserCard;
