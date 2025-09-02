import React from "react";
import { useNavigate } from "react-router-dom";
import "./Styles/Main.css";
import "./Styles/Admin.css"; // your custom styles

const Admin = () => {
  const navigate = useNavigate();

  const handleGoToPatients = () => navigate("/admin/patient");
  const handleGoToVolunteers = () => navigate("/admin/volunteers");
  const handleGoToVisits = () => navigate("/admin/visits");
  const handleGoToEquipment = () => navigate("/admin/equipment");
  const handleGoToConsumables = () => navigate("/admin/consumables");
  const handleGoToSettings = () => navigate("/admin/settings");

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <center>
          <h2>P A S S</h2>
        </center>
        <nav>
          <ul>
            <li>
              <button onClick={() => navigate("/admin")}>
                <i className="fas fa-tachometer-alt"></i> Dashboard
              </button>
            </li>
            <li>
              <button onClick={handleGoToPatients}>
                <i className="fas fa-user-injured"></i> Patients
              </button>
            </li>
            <li>
              <button onClick={handleGoToVolunteers}>
                <i className="fas fa-hands-helping"></i> Volunteers
              </button>
            </li>
            <li>
              <button onClick={handleGoToVisits}>
                <i className="fas fa-notes-medical"></i> Visit Reports
              </button>
            </li>
            <li>
              <button onClick={handleGoToEquipment}>
                <i className="fas fa-dolly-flatbed"></i> Equipment
              </button>
            </li>
            <li>
              <button onClick={handleGoToConsumables}>
                <i className="fas fa-medkit"></i> Consumables
              </button>
            </li>
            <li>
              <button onClick={handleGoToSettings}>
                <i className="fas fa-cogs"></i> Settings
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Topbar */}
        <header className="topbar">
          <h1>Palliative Care Dashboard</h1>
          <button className="logout-btn">Logout</button>
        </header>

        {/* Dashboard Cards */}
        <section className="grid">
          <div className="card">
            <i className="fas fa-user-injured"></i> Total Patients:{" "}
            <strong>120</strong>
          </div>
          <div className="card">
            <i className="fas fa-hands-helping"></i> Active Volunteers:{" "}
            <strong>25</strong>
          </div>
          <div className="card">
            <i className="fas fa-dolly-flatbed"></i> Equipment Assigned:{" "}
            <strong>60</strong>
          </div>
          <div className="card">
            <i className="fas fa-medkit"></i> Consumables in Stock:{" "}
            <strong>350+</strong>
          </div>
          <div className="card">
            <i className="fas fa-check-circle"></i> Total Visits Done:{" "}
            <strong>85</strong>
          </div>
          <div className="card">
            <i className="fas fa-hourglass-half"></i> Pending Visits:{" "}
            <strong>15</strong>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Admin;
