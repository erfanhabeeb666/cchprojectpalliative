import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import AddConsumable from "./AddConsumable";
import axios from "axios";
import "../Styles/Admin.css";
import "../Styles/Main.css";
import "../Styles/Sidebar.css";

const ConsumablePage = () => {
  const [consumableList, setConsumableList] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchConsumables = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await axios.get(`${apiUrl}admin/list-consumables`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setConsumableList(response.data);
    } catch (err) {
      console.error("Failed to fetch consumables", err);
    }
  };

  useEffect(() => {
    fetchConsumables();
  }, []);

  const handleAddSuccess = () => {
    fetchConsumables();
    setShowAddForm(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this consumable?")) {
      try {
        const token = localStorage.getItem("jwtToken");
        const apiUrl = process.env.REACT_APP_API_URL;

        await axios.delete(`${apiUrl}admin/delete-consumable`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { id }, // backend expects id as query param
        });
        fetchConsumables();
      } catch (err) {
        console.error("Failed to delete consumable", err);
      }
    }
  };

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
          <h1>Consumables Management</h1>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </header>

        <div className="mb-4 flex space-x-4" style={{ marginBottom: "20px" }}>
          <button onClick={() => setShowAddForm(true)}>+ Add Consumable</button>
          <button onClick={fetchConsumables} style={{ marginLeft: "10px" }}>Refresh List</button>
        </div>

        {showAddForm && (
          <div className="form-container">
            <AddConsumable onSuccess={handleAddSuccess} />
            <button onClick={() => setShowAddForm(false)} className="btn-cancel">Close</button>
          </div>
        )}

        <div>
          <table className="main-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Consumable Name</th>
                <th>Quantity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {consumableList.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>
                    No consumables available
                  </td>
                </tr>
              ) : (
                consumableList.map((consumable) => (
                  <tr key={consumable.id}>
                    <td>{consumable.id}</td>
                    <td>{consumable.name}</td>
                    <td>{consumable.quantity}</td>
                    <td>
                      <button 
                        onClick={() => handleDelete(consumable.id)} 
                        style={{ backgroundColor: "red", color: "white", border: "none", padding: "5px 10px", borderRadius: "5px", cursor: "pointer" }}
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

export default ConsumablePage;
