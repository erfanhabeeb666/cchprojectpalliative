import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getDisplayName } from "../utils/auth";
import "./Styles/Admin.css";
import "./Styles/Main.css";
import "./Styles/Sidebar.css";

const apiUrl = process.env.REACT_APP_API_URL;

const decodeJwtToken = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to decode JWT token", error);
    return null;
  }
};

const CompletedVisits = () => {
  const [completedVisits, setCompletedVisits] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate("/");
  };

  useEffect(() => {
    fetchCompletedVisits();
  }, []);

  const fetchCompletedVisits = async () => {
    setLoading(true);
    setError("");

    const jwtToken = localStorage.getItem("jwtToken");
    if (!jwtToken) {
      setError("No JWT token found");
      setLoading(false);
      return;
    }

    const decodedToken = decodeJwtToken(jwtToken);
    if (!decodedToken || !decodedToken.userId) {
      setError("Invalid token or user ID not found");
      setLoading(false);
      return;
    }

    const volunteerId = decodedToken.userId;

    try {
      const response = await fetch(
        `${apiUrl}volunteer/completed-visits?volunteerId=${volunteerId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch completed visits");
      }

      const data = await response.json();
      setCompletedVisits(data);
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <center>
          <h2>P A S S</h2>
        </center>
        <nav>
          <ul className="sidebar-menu">
            <li>
              <NavLink to="/volunteer" className="sidebar-link">
                <i className="fas fa-tachometer-alt"></i> Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/volunteer/todays-visits" className="sidebar-link">
                <i className="fas fa-calendar-day"></i> Today's Visits
              </NavLink>
            </li>
            <li>
              <NavLink to="/volunteer/completed-visits" className="sidebar-link">
                <i className="fas fa-check"></i> Completed Visits
              </NavLink>
            </li>
            <li>
              <NavLink to="/volunteer/profile" className="sidebar-link">
                <i className="fas fa-user"></i> Profile
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="topbar">
          <h1>Completed Visits</h1>
          <div className="topbar-actions">
            <span className="greeting">Hello, {getDisplayName()}</span>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </header>

        <section className="content-section">
          {error && <p style={{ color: "red" }}>{error}</p>}
          {loading ? (
            <p>Loading...</p>
          ) : completedVisits.length === 0 ? (
            <p>No completed visits found.</p>
          ) : (
            <div>
              <table className="main-table">
                <thead>
                  <tr>
                    <th>Visit ID</th>
                    <th>Patient Name</th>
                    <th>Volunteer Name</th>
                    <th>Visit Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {completedVisits.map((visit) => (
                    <tr key={visit.id}>
                      <td>{visit.id}</td>
                      <td>{visit.patientName}</td>
                      <td>{visit.volunteerName}</td>
                      <td>
                        {visit.visitDate
                          ? new Date(visit.visitDate).toLocaleDateString()
                          : "-"}
                      </td>
                      <td>{visit.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default CompletedVisits;
