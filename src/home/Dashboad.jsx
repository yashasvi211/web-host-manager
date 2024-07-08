import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard({ user }) {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null); // State to handle fetch errors

  useEffect(() => {
    // Fetch the list of users from the server
    fetch("http://localhost:3000/Users")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        return response.json();
      })
      .then((data) => setUsers(data))
      .catch((error) => {
        console.error("Error fetching users:", error);
        setError(error.message); // Set error state for display
      });
  }, []); // Empty dependency array to run effect only once

  const handleLogout = () => {
    // Clear user data from local storage and navigate to login page
    localStorage.removeItem("user");
    navigate("/login");
  };

  const goToProfile = () => {
    navigate("/profile");
  };

  if (error) {
    return <div>Error fetching users: {error}</div>;
  }

  return (
    <div>
      <h1>Welcome to the Dashboard, {user.employee_name}!</h1>
      <p>Username: {user.username}</p>
      <p>Position: {user.position}</p>
      <button onClick={handleLogout}>Logout</button>
      <button onClick={goToProfile}>Go to Profile</button>{" "}
      {/* Button to navigate to profile page */}
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th>User ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Phone Number</th>
            <th>Registration Date</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.user_id}>
              <td>{user.user_id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.first_name}</td>
              <td>{user.last_name}</td>
              <td>{user.phone_number}</td>
              <td>{user.registration_date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
