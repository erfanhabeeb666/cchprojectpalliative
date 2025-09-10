import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Styles/Main.css";
import "./Styles/Admin.css";
import "./Styles/Sidebar.css"; // keep this LAST

const Admin = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalPatients: 0,
    activeVolunteers: 0,
    equipmentsTotal: 0,
    totalVisitDone: 0,
    pendingVisits: 0,
  });

  // Fetch dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
          navigate("/"); // redirect if not logged in
          return;
        }

        const response = await fetch("http://localhost:8080/admin/dashboard-stats", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard stats");
        }

        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };

    fetchStats();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <center><h2>P A S S</h2></center>
        <nav>
          <ul className="sidebar-menu">
            <li>
              <NavLink to="/admin" className="sidebar-link">
                <i className="fas fa-tachometer-alt"></i> Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/patient" className="sidebar-link">
                <i className="fas fa-user-injured"></i> Patients
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/volunteers" className="sidebar-link">
                <i className="fas fa-hands-helping"></i> Volunteers
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/procedures" className="sidebar-link">
                <i className="fas fa-stethoscope"></i> Procedures
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/visits" className="sidebar-link">
                <i className="fas fa-notes-medical"></i> Visit Reports
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/equipment" className="sidebar-link">
                <i className="fas fa-dolly-flatbed"></i> Equipment
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/consumables" className="sidebar-link">
                <i className="fas fa-medkit"></i> Consumables
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/settings" className="sidebar-link">
                <i className="fas fa-cogs"></i> Settings
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="topbar">
          <h1>Palliative Care Dashboard</h1>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </header>

        <section className="grid">
          <div className="card">
            <i className="fas fa-user-injured"></i> Total Patients:{" "}
            <strong>{stats.totalPatients}</strong>
          </div>
          <div className="card">
            <i className="fas fa-hands-helping"></i> Active Volunteers:{" "}
            <strong>{stats.activeVolunteers}</strong>
          </div>
          <div className="card">
            <i className="fas fa-medkit"></i> Equipments Total:{" "}
            <strong>{stats.equipmentsTotal}</strong>
          </div>
          <div className="card">
            <i className="fas fa-check-circle"></i> Total Visits Done:{" "}
            <strong>{stats.totalVisitDone}</strong>
          </div>
          <div className="card">
            <i className="fas fa-hourglass-half"></i> Pending Visits:{" "}
            <strong>{stats.pendingVisits}</strong>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Admin;