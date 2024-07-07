import React from "react";
import { useNavigate } from "react-router-dom";

function Dashboard({ user }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Implement logout logic here
    // For example, clear user from state and localStorage
    // Then navigate to login page
    navigate("/login");
  };

  return (
    <div>
      <h1>Welcome to the Dashboard, {user.employee_name}!</h1>
      <p>Username: {user.username}</p> {/* Display the username */}
      <p>Position: {user.position}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;
