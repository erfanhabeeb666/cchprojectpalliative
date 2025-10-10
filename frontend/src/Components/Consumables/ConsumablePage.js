import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getDisplayName } from "../../utils/auth";
import AddConsumable from "./AddConsumable";
import axios from "axios";
import "../Styles/Admin.css";
import "../Styles/Main.css";
import "../Styles/Sidebar.css";

const ConsumablePage = () => {
  const [consumableList, setConsumableList] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [updateQuantity, setUpdateQuantity] = useState({}); // {id: qty}
  const apiUrl = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem("jwtToken");

  const fetchConsumables = async () => {
    try {
      const response = await axios.get(`${apiUrl}admin/consumable/list`, {
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
        await axios.delete(`${apiUrl}admin/consumable/delete/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchConsumables();
      } catch (err) {
        console.error("Failed to delete consumable", err);
      }
    }
  };

  const handleStockUpdate = async (id, action) => {
    const qty = updateQuantity[id] || 0;
    if (qty <= 0) {
      alert("Enter a valid quantity");
      return;
    }

    try {
      await axios.put(
        `${apiUrl}admin/consumable/${id}/${action}-stock`,
        {},
        {
          params: { quantity: qty },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchConsumables();
      setUpdateQuantity((prev) => ({ ...prev, [id]: "" }));
    } catch (err) {
      console.error(`Failed to ${action} stock`, err);
      alert(`Failed to ${action} stock`);
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
        <center>
          <h2>P A S S</h2>
        </center>
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
              <NavLink to="/admin/createnewvisit" className="sidebar-link">
                <i className="fas fa-stethoscope"></i> Create New Visit
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
          <h1>Consumables Management</h1>
          <div className="topbar-actions">
            <span className="greeting">Hello, {getDisplayName()}</span>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
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
                <th>Update Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {consumableList.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                    No consumables available
                  </td>
                </tr>
              ) : (
                consumableList.map((consumable) => (
                  <tr key={consumable.id}>
                    <td>{consumable.id}</td>
                    <td>{consumable.name}</td>
                    <td>{consumable.stockQuantity}</td>
                    <td>
                      <input
                        type="number"
                        min="1"
                        placeholder="Qty"
                        value={updateQuantity[consumable.id] || ""}
                        onChange={(e) =>
                          setUpdateQuantity((prev) => ({
                            ...prev,
                            [consumable.id]: e.target.value,
                          }))
                        }
                        style={{ width: "60px", marginRight: "5px" }}
                      />
                      <button
                        onClick={() => handleStockUpdate(consumable.id, "add")}
                        style={{ marginRight: "5px" }}
                      >
                        + Add
                      </button>
                      <button
                        onClick={() => handleStockUpdate(consumable.id, "subtract")}
                      >
                        - Subtract
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() => handleDelete(consumable.id)}
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

export default ConsumablePage;
