import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import AddPatient from "./AddPatient";
import axios from "axios";
import "../Styles/Admin.css";
import "../Styles/Main.css";
import "../Styles/Sidebar.css";

const PatientPage = () => {
  const [patients, setPatients] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [direction, setDirection] = useState("asc");
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const apiUrl = process.env.REACT_APP_API_URL;

      const response = await axios.get(`${apiUrl}admin/list-patients`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, size, direction, search },
      });

      setPatients(response.data.content); // Page content
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error("Failed to fetch patients", err);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [page, size, direction, search]); // re-fetch when params change

  const handleAddSuccess = () => {
    fetchPatients();
    setShowModal(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this patient?")) {
      try {
        const token = localStorage.getItem("jwtToken");
        const apiUrl = process.env.REACT_APP_API_URL;

        await axios.delete(`${apiUrl}admin/delete-patient`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { id },
        });
        fetchPatients();
      } catch (err) {
        console.error("Failed to delete patient", err);
      }
    }
  };

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
          <h1>Patient Management</h1>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </header>
        <div className="mb-4 flex space-x-4" style={{ marginBottom: "20px" ,marginTop:"30px"}}>
          <button onClick={() => setShowModal(true)}>+ Add Patient</button>
          <button onClick={fetchPatients} style={{ marginLeft: "10px" }}>Refresh List</button>
          <input type="text" placeholder="Search by name or mobile..." value={search} onChange={(e) => {
                                                                                        setPage(0);
                                                                                        setSearch(e.target.value);
                                                                                                        }
                                                                                                }
            className="search-input" />
        </div>

        {/* Modal for AddPatient */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <AddPatient onSuccess={handleAddSuccess} />
              <button
                onClick={() => {
                                setShowModal(false);
                                fetchPatients();
                              }
                        }

                className="btn-cancel"
                style={{ marginTop: "10px" }}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Patients Table */}
        <div>
          <table className="main-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Mobile</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Address</th>
                <th>Medical Condition</th>
                <th>Emergency Contact</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {patients.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center", padding: "20px" }}>
                    No patients available
                  </td>
                </tr>
              ) : (
                patients.map((patient) => (
                  <tr key={patient.id}>
                    <td>{patient.name}</td>
                    <td>{patient.mobileNumber}</td>
                    <td>{patient.age}</td>
                    <td>{patient.gender}</td>
                    <td>{patient.address}</td>
                    <td>{patient.medicalCondition}</td>
                    <td>{patient.emergencyContact}</td>
                    <td>
                      <button 
                        onClick={() => handleDelete(patient.id)} 
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

        {/* Pagination Controls */}
        <div style={{ marginTop: "15px", display: "flex", justifyContent: "center", gap: "10px" }}>
          <button
            disabled={page === 0}
            onClick={() => setPage((prev) => prev - 1)}
          >
            Previous
          </button>
          <span>Page {page + 1} of {totalPages}</span>
          <button
            disabled={page + 1 >= totalPages}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
};

export default PatientPage;
