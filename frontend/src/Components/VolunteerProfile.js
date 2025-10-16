import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getDisplayName } from "../utils/auth";
import "./Styles/Main.css";
import "./Styles/Admin.css";
import "./Styles/Sidebar.css";

const VolunteerProfile = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <center><h2>P A S S</h2></center>
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

      <main className="main-content">
        <header className="topbar">
          <h1>Profile</h1>
          <div className="topbar-actions">
            <span className="greeting">Hello, {getDisplayName()}</span>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </header>

        <section style={{ background: "#fff", padding: 16, borderRadius: 8, marginTop: 24 }}>
          <h2 style={{ marginBottom: 8 }}>Profile</h2>
          <p>Coming soon...</p>
        </section>
      </main>
    </div>
  );
};

export default VolunteerProfile;
