import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavLink,useNavigate } from "react-router-dom"; 
import "../Styles/Admin.css";
import "../Styles/Main.css";
import "../Styles/Sidebar.css"; 
import AddEquipment from "./AddEquipment";

const EquipmentPage = () => {
  const [equipmentList, setEquipmentList] = useState([]);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  // allocate modal states
  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState("");

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

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await axios.get(`${apiUrl}admin/list-patients`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatients(response.data);
    } catch (err) {
      console.error("Failed to fetch patients", err);
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, []);

  const handleAddSuccess = () => {
    fetchEquipment();
    setShowAddForm(false);
  };

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate("/");
  };

  // === DELETE ===
const handleDelete = async (id) => {
  try {
    const token = localStorage.getItem("jwtToken"); // ✅ Get token
    const apiUrl = process.env.REACT_APP_API_URL;
    await axios.delete(`${apiUrl}admin/delete-equipment`, {
      params: { id: id }, // ✅ Pass as query param
      headers: {
        Authorization: `Bearer ${token}`, // ✅ Attach token
      },
    });

    setEquipmentList(equipmentList.filter((item) => item.id !== id));
    alert("Equipment deleted successfully!");
  } catch (error) {
    console.error("Delete error:", error.response || error.message);
    alert("Failed to delete equipment. Check console for details.");
  }
};



  // === ALLOCATE ===
  const handleAllocate = (equipment) => {
    setSelectedEquipment(equipment);
    fetchPatients();
    setShowAllocateModal(true);
  };

  const confirmAllocate = async () => {
    if (!selectedPatient) {
      alert("Please select a patient");
      return;
    }
    try {
      const token = localStorage.getItem("jwtToken");
      const apiUrl = process.env.REACT_APP_API_URL;
      await axios.post(
        `${apiUrl}admin/allocate-equipment/${selectedEquipment.id}/to/${selectedPatient}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchEquipment();
      setShowAllocateModal(false);
    } catch (err) {
      console.error("Allocation failed", err);
      alert("Failed to allocate equipment");
    }
  };

  // filter patients by search
  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <li><NavLink to="/admin/equipment" className="sidebar-link"><i className="fas fa-dolly-flatbed"></i> Equipment</NavLink></li>
            <li><NavLink to="/admin/consumables" className="sidebar-link"><i className="fas fa-medkit"></i> Consumables</NavLink></li>
            <li><NavLink to="/admin/settings" className="sidebar-link"><i className="fas fa-cogs"></i> Settings</NavLink></li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="topbar">
          <h1>Equipment Management</h1>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </header>

        <section className="content-section">
          <div className="section-header">
            <h2 className="section-title">Equipment List</h2>
            <button className="add-btn" onClick={() => setShowAddForm(true)}>
              + Add Equipment
            </button>
                      <button onClick={fetchPatients} style={{ marginLeft: "10px" }}>Refresh List</button>
          </div>

          {error && <p className="text-red-600">{error}</p>}

          {/* Add Equipment Form Modal */}
{showAddForm && (
  <div className="modal-overlay">
    <div className="form-container">
      <AddEquipment onSuccess={handleAddSuccess} />
      <button onClick={() => setShowAddForm(false)} className="btn-cancel">Close</button>
    </div>
  </div>
)}


          <table className="main-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Equipment Name</th>
                <th>Allocated</th>
                <th>Allocated To</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {equipmentList.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center">
                    No equipment available.
                  </td>
                </tr>
              ) : (
                equipmentList.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>{item.allocated ? "Yes" : "No"}</td>
                    <td>{item.patientName ? item.patientName : "-"}</td>
                    <td>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 underline mr-2"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => handleAllocate(item)}
                        className="text-blue-600 underline"
                      >
                        Allocate
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>

        {/* Allocate Modal */}
{showAllocateModal && (
  <div className="modal-overlay">
    <div className="form-container">
      <h3 className="form-title">Allocate {selectedEquipment?.name}</h3>

      <input
        type="text"
        placeholder="Search patient..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="form-input mb-3"
      />

      <div className="patient-list">
        {filteredPatients.map((p) => (
          <div key={p.id} className="patient-option">
            <input
              type="radio"
              name="patient"
              value={p.id}
              checked={selectedPatient === String(p.id)}
              onChange={(e) => setSelectedPatient(e.target.value)}
            />
            <span>{p.id} - {p.name}</span>
          </div>
        ))}
        {filteredPatients.length === 0 && (
          <p className="text-gray-500">No patients found</p>
        )}
      </div>

      <div className="form-actions">
        <button
          onClick={() => setShowAllocateModal(false)}
          className="btn-cancel"
        >
          Cancel
        </button>
        <button
          onClick={confirmAllocate}
          className="btn-submit"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
)}

      </main>
    </div>
  );
};

export default EquipmentPage;
