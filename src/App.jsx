// App.js
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./credential/Login";
import Register from "./credential/Register";
import Dashboard from "./home/Dashboad";

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              user ? <Dashboard user={user} /> : <Navigate to="/login" /> // Replace with your Dashboard component
            }
          />
          <Route
            path="/"
            element={
              user ? <Navigate to="/dashboard" /> : <Navigate to="/login" /> // Replace with your Login component
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
