import React from "react";
import { NavLink, useNavigate } from "react-router-dom"; 
import "./Styles/Main.css";
import "./Styles/Admin.css";
import "./Styles/Sidebar.css";

const VolunteerDashboard = () => {
  const navigate = useNavigate(); // ✅ must be inside the component

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate("/"); // ✅ now this works
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
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

      {/* Main Content */}
      <main className="main-content">
        <header className="topbar">
          <h1>Today's Visits</h1>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </header>

        <section className="grid">
          <div className="card">
            <i className="fas fa-calendar-day"></i> Today's Visits: <strong>5</strong>
          </div>
          <div className="card">
            <i className="fas fa-check"></i> Completed Visits: <strong>12</strong>
          </div>
          <div className="card">
            <i className="fas fa-user-injured"></i> Patients Assigned: <strong>8</strong>
          </div>
          <div className="card">
            <i className="fas fa-notes-medical"></i> Total Visits: <strong>50</strong>
          </div>
          <div className="card">
            <i className="fas fa-dolly-flatbed"></i> Equipment in Use: <strong>3</strong>
          </div>
        </section>
      </main>
    </div>
  );
};

export default VolunteerDashboard;
