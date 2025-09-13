import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import AddVolunteer from "./AddVolunteer";
import AssignVolunteer from "./AssignVolunteer";
import axios from "axios";
import "../Styles/Admin.css";
import "../Styles/Main.css";
import "../Styles/Sidebar.css";

const VolunteerPage = () => {
  const [volunteerList, setVolunteerList] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");

  const fetchVolunteers = async (pageNum = page, searchTerm = search) => {
    try {
      const token = localStorage.getItem("jwtToken");
      const apiUrl = process.env.REACT_APP_API_URL;

      const response = await axios.get(`${apiUrl}admin/list-volunteers`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page: pageNum, size, search: searchTerm },
      });

      setVolunteerList(response.data.content);
      setTotalPages(response.data.totalPages);
      setPage(response.data.number);
    } catch (err) {
      console.error("Failed to fetch volunteers", err);
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const handleAddSuccess = () => {
    fetchVolunteers();
    setShowAddForm(false);
  };

  const handleAssignSuccess = () => {
    fetchVolunteers(); // Refresh list after assignment
    setShowAssignForm(false); // Close modal
  };

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
            <li><NavLink to="/admin" className="sidebar-link">Dashboard</NavLink></li>
            <li><NavLink to="/admin/patient" className="sidebar-link">Patients</NavLink></li>
            <li><NavLink to="/admin/volunteers" className="sidebar-link">Volunteers</NavLink></li>
            <li><NavLink to="/admin/procedures" className="sidebar-link">Procedures</NavLink></li>
            <li><NavLink to="/admin/visits" className="sidebar-link">Visit Reports</NavLink></li>
            <li><NavLink to="/admin/equipment" className="sidebar-link">Equipment</NavLink></li>
            <li><NavLink to="/admin/consumables" className="sidebar-link">Consumables</NavLink></li>
            <li><NavLink to="/admin/settings" className="sidebar-link">Settings</NavLink></li>
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <h1>Volunteer Management</h1>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </header>

        <div className="mb-4 flex space-x-4" style={{ marginBottom: "20px" }}>
          <button onClick={() => setShowAddForm(true)}>+ Add Volunteer</button>
          <button onClick={() => setShowAssignForm(true)} style={{ marginLeft: "10px" }}>+ Assign Volunteer</button>
          <button onClick={() => fetchVolunteers()} style={{ marginLeft: "10px" }}>Refresh List</button>

          <input
            type="text"
            placeholder="Search by name or mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchVolunteers(0, e.target.value)}
            style={{ marginLeft: "20px", padding: "5px" }}
          />
        </div>

        {/* Add Volunteer Modal */}
        {showAddForm && (
          <div className="modal-overlay">
            <div className="form-container">
              <AddVolunteer onSuccess={handleAddSuccess} />
              <button onClick={() => setShowAddForm(false)} className="btn-cancel">Close</button>
            </div>
          </div>
        )}

        {/* Assign Volunteer Modal */}
        {showAssignForm && (
          <div className="modal-overlay">
            <div className="form-container">
              <AssignVolunteer onSuccess={handleAssignSuccess} />
              <button onClick={() => setShowAssignForm(false)} className="btn-cancel">Close</button>
            </div>
          </div>
        )}

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
                  <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>No volunteers available</td>
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

        {/* Pagination */}
        <div style={{ marginTop: "15px" }}>
          <button disabled={page === 0} onClick={() => fetchVolunteers(page - 1, search)}>Prev</button>
          <span style={{ margin: "0 10px" }}>Page {page + 1} of {totalPages}</span>
          <button disabled={page + 1 >= totalPages} onClick={() => fetchVolunteers(page + 1, search)}>Next</button>
        </div>
      </main>
    </div>
  );
};

export default VolunteerPage;
