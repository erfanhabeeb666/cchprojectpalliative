import React, { useState, useEffect } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import "./Styles/Admin.css";
import "./Styles/Main.css";
import "./Styles/Sidebar.css";
const Visits = () => {
  const [visits, setVisits] = useState([]);
  const [activeTab, setActiveTab] = useState("completed");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchVisits = async (type) => {
    try {
      const token = localStorage.getItem("jwtToken");
      const apiUrl = process.env.REACT_APP_API_URL;
      const endpoint =
        type === "completed" ? "admin/completed-visits" : "admin/pending-visits";

      const response = await axios.get(`${apiUrl}${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setVisits(response.data);
    } catch (err) {
      console.error("Failed to fetch visits", err);
    }
  };

  useEffect(() => {
    fetchVisits(activeTab);
  }, [activeTab]);

  // filter visits by patient name
  const filteredVisits = visits.filter((visit) =>
    visit.patientName?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate("/");
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
              <a href="/admin" className="sidebar-link">
                <i className="fas fa-tachometer-alt"></i> Dashboard
              </a>
            </li>
            <li>
              <a href="/admin/patient" className="sidebar-link">
                <i className="fas fa-user-injured"></i> Patients
              </a>
            </li>
            <li>
              <a href="/admin/volunteers" className="sidebar-link">
                <i className="fas fa-hands-helping"></i> Volunteers
              </a>
            </li>
            <li>
              <a href="/admin/procedures" className="sidebar-link">
                <i className="fas fa-stethoscope"></i> Procedures
              </a>
            </li>
            <li>
              <a href="/admin/visits" className="sidebar-link">
                <i className="fas fa-notes-medical"></i> Visit Reports
              </a>
            </li>
            <li>
              <a href="/admin/equipment" className="sidebar-link">
                <i className="fas fa-dolly-flatbed"></i> Equipment
              </a>
            </li>
            <li>
              <a href="/admin/consumables" className="sidebar-link">
                <i className="fas fa-medkit"></i> Consumables
              </a>
            </li>
            <li>
              <a href="/admin/settings" className="sidebar-link">
                <i className="fas fa-cogs"></i> Settings
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="topbar">
          <h1>Visit Reports</h1>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </header>

        {/* Tabs */}
        <div className="mb-4 flex space-x-4" style={{ marginBottom: "20px" }}>
          <button
            className={activeTab === "completed" ? "active-tab" : ""}
            onClick={() => setActiveTab("completed")}
          >
            Completed Visits
          </button>
          <button
            className={activeTab === "pending" ? "active-tab" : ""}
            onClick={() => setActiveTab("pending")}
          >
            Pending Visits
          </button>
        </div>

        {/* Search */}
        <div className="search-box" style={{ marginBottom: "20px" }}>
          <label htmlFor="search">Search Patient: </label>
          <input
            id="search"
            type="text"
            placeholder="Enter patient name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: "5px", marginLeft: "10px" }}
          />
        </div>

        {/* Table */}
        <div>
          <table className="main-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Volunteer</th>
                <th>Visit Date</th>
                <th>Completed Date</th>
                <th>Procedures Done</th>
                <th>Consumables Used</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredVisits.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
                    No {activeTab} visits found
                  </td>
                </tr>
              ) : (
                filteredVisits.map((visit) => (
                  <tr key={visit.id}>
                    <td>{visit.patientName}</td>
                    <td>{visit.volunteerName}</td>
                    <td>
                      {visit.visitDate
                        ? new Date(visit.visitDate).toLocaleDateString()
                        : "-"}
                    </td>
                    <td>
                      {visit.completedDate
                        ? new Date(visit.completedDate).toLocaleDateString()
                        : "-"}
                    </td>
                    <td>
                      {visit.proceduresDone && visit.proceduresDone.length > 0
                        ? visit.proceduresDone.join(", ")
                        : "None"}
                    </td>
                    <td>
                      {visit.consumablesUsed &&
                      Object.keys(visit.consumablesUsed).length > 0
                        ? Object.entries(visit.consumablesUsed)
                            .map(([item, qty]) => `${item} (${qty})`)
                            .join(", ")
                        : "None"}
                    </td>
                    <td>{visit.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Visits;