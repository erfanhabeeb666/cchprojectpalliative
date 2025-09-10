import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import AddVolunteer from "./AddVolunteer";
import AssignVolunteer from "./AssignVolunteer"; // ✅ Import assign volunteer
import axios from "axios";
import "../Styles/Admin.css";
import "../Styles/Main.css";
import "../Styles/Sidebar.css";

const VolunteerPage = () => {
  const [volunteerList, setVolunteerList] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAssignForm, setShowAssignForm] = useState(false); // ✅ new state

  // Fetch volunteers
  const fetchVolunteers = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await axios.get(`${apiUrl}admin/list-volunteers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVolunteerList(response.data);
    } catch (err) {
      console.error("Failed to fetch volunteers", err);
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  // Add success handler
  const handleAddSuccess = () => {
    fetchVolunteers();
    setShowAddForm(false);
  };

  // Delete volunteer
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this volunteer?")) {
      try {
        const token = localStorage.getItem("jwtToken");
        const apiUrl = process.env.REACT_APP_API_URL;

        await axios.delete(`${apiUrl}admin/delete-volunteer`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { id },
        });
        fetchVolunteers();
      } catch (err) {
        console.error("Failed to delete volunteer", err);
      }
    }
  };

  // Logout
  const navigate = useNavigate();
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
            <li><NavLink to="/admin" className="sidebar-link"><i className="fas fa-tachometer-alt"></i> Dashboard</NavLink></li>
            <li><NavLink to="/admin/patient" className="sidebar-link"><i className="fas fa-user-injured"></i> Patients</NavLink></li>
            <li><NavLink to="/admin/volunteers" className="sidebar-link"><i className="fas fa-hands-helping"></i> Volunteers</NavLink></li>
            <li><NavLink to="/admin/procedures" className="sidebar-link"><i className="fas fa-stethoscope"></i> Procedures</NavLink></li>
            <li><NavLink to="/admin/visits" className="sidebar-link"><i className="fas fa-notes-medical"></i> Visit Reports</NavLink></li>
            <li><NavLink to="/admin/equipment" className="sidebar-link"><i className="fas fa-dolly-flatbed"></i> Equipment</NavLink></li>
            <li><NavLink to="/admin/consumables" className="sidebar-link"><i className="fas fa-medkit"></i> Consumables</NavLink></li>
            <li><NavLink to="/admin/settings" className="sidebar-link"><i className="fas fa-cogs"></i> Settings</NavLink></li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="topbar">
          <h1>Volunteer Management</h1>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </header>

        <div className="mb-4 flex space-x-4" style={{ marginBottom: "20px" }}>
          <button onClick={() => setShowAddForm(true)}>+ Add Volunteer</button>
          <button onClick={() => setShowAssignForm(true)} style={{ marginLeft: "10px" }}>+ Assign Volunteer</button>
          <button onClick={fetchVolunteers} style={{ marginLeft: "10px" }}>Refresh List</button>
        </div>

        {/* Add Volunteer Form */}
       {showAddForm && (
  <div className="modal-overlay">
    <div className="form-container">
      <AddVolunteer onSuccess={handleAddSuccess} />
      <button onClick={() => setShowAddForm(false)} className="btn-cancel">Close</button>
    </div>
  </div>
)}

{/* Assign Volunteer Form Modal */}
{showAssignForm && (
  <div className="modal-overlay">
    <div className="form-container">
      <AssignVolunteer />
      <button onClick={() => setShowAssignForm(false)} className="btn-cancel">Close</button>
    </div>
  </div>
)}

        {/* Volunteer Table */}
        <div>
          <table className="main-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Specialization</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {volunteerList.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                    No volunteers available
                  </td>
                </tr>
              ) : (
                volunteerList.map((vol) => (
                  <tr key={vol.id}>
                    <td>{vol.name}</td>
                    <td>{vol.email}</td>
                    <td>{vol.phoneNumber}</td>
                    <td>{vol.address}</td>
                    <td>{vol.specialization}</td>
                    <td>
                      <button
                        onClick={() => handleDelete(vol.id)}
                        style={{
                          backgroundColor: "red",
                          color: "white",
                          border: "none",
                          padding: "5px 10px",
                          borderRadius: "5px",
                          cursor: "pointer",
                        }}
                      >
                        Remove
                      </button>
                    </td>
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

export default VolunteerPage;
