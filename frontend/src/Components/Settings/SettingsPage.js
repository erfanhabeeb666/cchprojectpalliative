import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getDisplayName } from "../../utils/auth";
import "../Styles/Admin.css";
import "../Styles/Main.css";
import "../Styles/Sidebar.css";

const SettingsPage = () => {
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
            <li><NavLink to="/admin" className="sidebar-link"><i className="fas fa-tachometer-alt"></i> Dashboard</NavLink></li>
            <li><NavLink to="/admin/patient" className="sidebar-link"><i className="fas fa-user-injured"></i> Patients</NavLink></li>
            <li><NavLink to="/admin/volunteers" className="sidebar-link"><i className="fas fa-hands-helping"></i> Volunteers</NavLink></li>
            <li><NavLink to="/admin/procedures" className="sidebar-link"><i className="fas fa-stethoscope"></i> Procedures</NavLink></li>
            <li><NavLink to="/admin/visits" className="sidebar-link"><i className="fas fa-notes-medical"></i> Visit Reports</NavLink></li>
            <li>
              <NavLink to="/admin/createnewvisit" className="sidebar-link">
                <i className="fas fa-stethoscope"></i> Create New Visit
              </NavLink>
            </li>
            <li><NavLink to="/admin/equipment" className="sidebar-link"><i className="fas fa-dolly-flatbed"></i> Equipment</NavLink></li>
            <li><NavLink to="/admin/consumables" className="sidebar-link"><i className="fas fa-medkit"></i> Consumables</NavLink></li>
            <li><NavLink to="/admin/settings" className="sidebar-link"><i className="fas fa-cogs"></i> Settings</NavLink></li>
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <h1>Settings</h1>
          <div className="topbar-actions">
            <span className="greeting">Hello, {getDisplayName()}</span>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </header>

        <div style={{ marginTop: 24 }}>
          <section style={{ background: "#fff", padding: 16, borderRadius: 8 }}>
            <h2 style={{ marginBottom: 12 }}>Coming soon</h2>
            <p>Configure application preferences here.</p>
          </section>

        
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
