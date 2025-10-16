import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getDisplayName } from "../../utils/auth";
import AddProcedure from "./AddProcedure";
import axios from "axios";
import "../Styles/Admin.css";
import "../Styles/Main.css";
import "../Styles/Sidebar.css";

const ProcedurePage = () => {
  const [procedureList, setProcedureList] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchProcedures = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await axios.get(`${apiUrl}admin/procedures`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProcedureList(response.data);
    } catch (err) {
      console.error("Failed to fetch procedures", err);
    }
  };

  useEffect(() => {
    fetchProcedures();
  }, []);

  const handleAddSuccess = () => {
    fetchProcedures();
    setShowAddForm(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this procedure?")) {
      try {
        const token = localStorage.getItem("jwtToken");
        const apiUrl = process.env.REACT_APP_API_URL;

        await axios.delete(`${apiUrl}admin/delete-procedure`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { id }, // backend expects id as query param
        });
        fetchProcedures();
      } catch (err) {
        console.error("Failed to delete procedure", err);
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
             <li>
        <NavLink to="/admin/procedures" className="sidebar-link">
          <i className="fas fa-stethoscope"></i> Procedures
        </NavLink>
      </li>
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

      {/* Main Content */}
      <main className="main-content">
        <header className="topbar">
          <h1>Procedure Management</h1>
          <div className="topbar-actions">
            <span className="greeting">Hello, {getDisplayName()}</span>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </header>

        <div className="mb-4 flex space-x-4" style={{ marginBottom: "20px" }}>
          <button onClick={() => setShowAddForm(true)}>+ Add Procedure</button>
          <button onClick={fetchProcedures} style={{ marginLeft: "10px" }}>Refresh List</button>
        </div>

       {/* Add Procedure Form Modal */}
{showAddForm && (
  <div className="modal-overlay">
    <div className="form-container">
      <AddProcedure onSuccess={handleAddSuccess} />
      <button onClick={() => setShowAddForm(false)} className="btn-cancel">Close</button>
    </div>
  </div>
)}


        <div>
          <table className="main-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Procedure Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {procedureList.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center", padding: "20px" }}>
                    No procedures available
                  </td>
                </tr>
              ) : (
                procedureList.map((procedure) => (
                  <tr key={procedure.procedureId}>
                    <td>{procedure.procedureId}</td>
                    <td>{procedure.procedureName}</td>
                    <td>
                      <button 
                        onClick={() => handleDelete(procedure.procedureId)} 
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

export default ProcedurePage;
