import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { getDisplayName } from "../utils/auth";
import "./Styles/Main.css";
import "./Styles/Admin.css";
import "./Styles/Sidebar.css";

const VolunteerDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ todayVisits: 0, completedVisits: 0 });
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = process.env.REACT_APP_API_URL;
  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate("/");
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const response = await axios.get(`${API_BASE_URL}volunteer/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [API_BASE_URL]);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <center><h2>P A S S</h2></center>
        <nav>
          <ul className="sidebar-menu">
            <li><NavLink to="/volunteer" className="sidebar-link"><i className="fas fa-tachometer-alt"></i> Dashboard</NavLink></li>
            <li><NavLink to="/volunteer/todays-visits" className="sidebar-link"><i className="fas fa-calendar-day"></i> Today's Visits</NavLink></li>
            <li><NavLink to="/volunteer/completed-visits" className="sidebar-link"><i className="fas fa-check"></i> Completed Visits</NavLink></li>
            <li><NavLink to="/volunteer/profile" className="sidebar-link"><i className="fas fa-user"></i> Profile</NavLink></li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="topbar">
          <h1>Dashboard</h1>
          <div className="topbar-actions">
            <span className="greeting">Hello, {getDisplayName()}</span>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </header>

        <section className="grid">
          {loading ? (
            <p>Loading dashboard stats...</p>
          ) : (
            <>
              <div className="card">
                <i className="fas fa-calendar-day"></i> Today's Visits:{" "}
                <strong>{stats.todayVisits}</strong>
              </div>
              <div className="card">
                <i className="fas fa-check"></i> Completed Visits:{" "}
                <strong>{stats.completedVisits}</strong>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
};

export default VolunteerDashboard;
