import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Styles/Admin.css";
import "../Styles/Main.css"; // same styles as Admin/Patient pages
import AddEquipment from "./AddEquipment";

const EquipmentPage = () => {
  const navigate = useNavigate();
  const [equipmentList, setEquipmentList] = useState([]);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchEquipment = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const apiUrl = process.env.REACT_APP_API_URL;

      const response = await axios.get(`${apiUrl}admin/view-equipments`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEquipmentList(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch equipment");
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, []);

  const handleAddSuccess = () => {
    fetchEquipment(); // refresh table after adding
    setShowAddForm(false);
  };

  // Sidebar navigation handlers (same as Admin.js)
  const handleGoToDashboard = () => navigate("/admin");
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
              <button onClick={handleGoToDashboard}>
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
              <button className="active" onClick={handleGoToEquipment}>
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
          <h1>Equipment Management</h1>
          <button className="logout-btn">Logout</button>
        </header>

        {/* Page Content */}
        <section className="content-section">
          <div className="section-header">
            <h2 className="section-title">Equipment List</h2>
            <button
              className="add-btn"
              onClick={() => setShowAddForm(true)}
            >
              + Add Equipment
            </button>
          </div>

          {error && <p className="text-red-600">{error}</p>}

          {/* Add Equipment Form (Modal style) */}
          {showAddForm && (
            <div className="modal border p-4 rounded shadow bg-white">
              <AddEquipment onSuccess={handleAddSuccess} />
              <button
                onClick={() => setShowAddForm(false)}
                className="text-red-600 text-sm mt-2 underline"
              >
                Close
              </button>
            </div>
          )}

          {/* Equipment Table */}
          <table className="main-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Equipment Name</th>
                <th>Allocated</th>
                <th>Allocated To</th>
              </tr>
            </thead>
            <tbody>
              {equipmentList.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center">
                    No equipment available.
                  </td>
                </tr>
              ) : (
                equipmentList.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>{item.allocated ? "Yes" : "No"}</td>
                    <td>{item.allocatedTo ? item.allocatedTo.name : "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

export default EquipmentPage;
