import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import "../Styles/Admin.css";
import "../Styles/Main.css";
import "../Styles/Sidebar.css";
import AddEquipment from "./AddEquipment";

const EquipmentPage = () => {
  const [equipmentList, setEquipmentList] = useState([]);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination for equipment
  const [page, setPage] = useState(0);
  const [size] = useState(5);
  const [totalPages, setTotalPages] = useState(0);

  // Pagination for patients modal
  const [patientsModal, setPatientsModal] = useState([]);
  const [pagePatientsModal, setPagePatientsModal] = useState(0);
  const [totalPagesPatientsModal, setTotalPagesPatientsModal] = useState(1);

  const apiUrl = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem("jwtToken");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate("/");
  };

  // Fetch equipment list
  const fetchEquipment = async (pageNum = page, searchTerm = searchQuery) => {
    try {
      const response = await axios.get(`${apiUrl}admin/view-equipments`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page: pageNum, size, search: searchTerm },
      });
      setEquipmentList(response.data.content);
      setPage(response.data.number);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch equipment");
    }
  };

  // Fetch patients for modal (paginated)
  const fetchPatientsModal = async () => {
    if (!showAllocateModal) return;
    try {
      const res = await axios.get(`${apiUrl}admin/list-patients`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page: pagePatientsModal, size: 5, search: searchQuery },
      });
      setPatientsModal(res.data.content);
      setTotalPagesPatientsModal(res.data.totalPages);
    } catch (err) {
      console.error("Failed to fetch patients for modal", err);
      setPatientsModal([]);
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, []);

  useEffect(() => {
    fetchPatientsModal();
  }, [showAllocateModal, pagePatientsModal, searchQuery]);

  // Add Equipment
  const handleAddSuccess = () => {
    fetchEquipment(0, searchQuery);
    setShowAddForm(false);
  };

  // Delete Equipment
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}admin/delete-equipment`, {
        params: { id },
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchEquipment(page, searchQuery);
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete equipment");
    }
  };

  // Deallocate Equipment
  const handleDeallocate = async (equipmentId) => {
    try {
      await axios.post(
        `${apiUrl}admin/deallocate-equipment/${equipmentId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchEquipment(page, searchQuery);
      alert("Equipment deallocated successfully!");
    } catch (err) {
      console.error("Deallocation failed", err);
      alert("Failed to deallocate equipment");
    }
  };

  // Open Allocate modal
  const handleAllocate = (equipment) => {
    setSelectedEquipment(equipment);
    setSelectedPatient("");
    setPagePatientsModal(0);
    setShowAllocateModal(true);
  };

  // Confirm allocation
  const confirmAllocate = async () => {
    if (!selectedPatient) {
      alert("Please select a patient");
      return;
    }
    try {
      await axios.post(
        `${apiUrl}admin/allocate-equipment/${selectedEquipment.id}/to/${selectedPatient}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchEquipment(page, searchQuery);
      setShowAllocateModal(false);
    } catch (err) {
      console.error("Allocation failed", err);
      alert("Failed to allocate equipment");
    }
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
          <h1>Equipment Management</h1>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </header>

        <section className="content-section">
          {/* Add & Search */}
          <div className="mb-4 flex space-x-4" style={{ marginBottom: "20px", marginTop: "20px" }}>
            <button onClick={() => setShowAddForm(true)}>+ Add Equipment</button>
            <button
              onClick={() => fetchEquipment(0, searchQuery)}
              style={{ marginLeft: "15px" }}
            >
              Refresh List
            </button>
            <input
              type="text"
              placeholder="Search by name or allocated patient..."
              value={searchQuery}
              onChange={(e) => {
                setPage(0);
                setSearchQuery(e.target.value);
              }}
              className="search-input"
            />
          </div>

          {error && <p className="text-red-600">{error}</p>}

          {/* Add Equipment Form */}
          {showAddForm && (
            <div className="modal-overlay">
              <div className="form-container">
                <AddEquipment onSuccess={handleAddSuccess} />
                <button
                  onClick={() => setShowAddForm(false)}
                  className="btn-cancel"
                >
                  Close
                </button>
              </div>
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
                    <td>{item.patientName || "-"}</td>
                    <td>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 underline mr-2"
                      >
                        Delete
                      </button>

                      {item.allocated ? (
                        <button
                          onClick={() => handleDeallocate(item.id)}
                          className="text-yellow-600 underline"
                        >
                          Deallocate
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAllocate(item)}
                          className="text-blue-600 underline"
                        >
                          Allocate
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div style={{ marginTop: "15px" }}>
            <button
              disabled={page === 0}
              onClick={() => fetchEquipment(page - 1, searchQuery)}
            >
              Prev
            </button>
            <span style={{ margin: "0 10px" }}>
              Page {page + 1} of {totalPages}
            </span>
            <button
              disabled={page + 1 >= totalPages}
              onClick={() => fetchEquipment(page + 1, searchQuery)}
            >
              Next
            </button>
          </div>
        </section>

        {/* Allocate Modal */}
        {showAllocateModal && (
          <div className="modal-overlay">
            <div className="form-container">
              <h3 className="form-title">Allocate {selectedEquipment?.name}</h3>

              <input
                type="text"
                placeholder="Search patient by name or mobile..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPagePatientsModal(0);
                }}
                className="form-input mb-3"
              />

              <div className="patient-list">
                {patientsModal.length === 0 ? (
                  <p className="text-gray-500">No patients found</p>
                ) : (
                  patientsModal.map((p) => (
                    <div key={p.id} className="patient-option">
                      <input
                        type="radio"
                        name="patient"
                        value={p.id}
                        checked={selectedPatient === String(p.id)}
                        onChange={(e) => setSelectedPatient(e.target.value)}
                      />
                      <span>
                        {p.id} - {p.name} ({p.mobileNumber})
                      </span>
                    </div>
                  ))
                )}
              </div>

              {/* Pagination */}
              <div className="pagination" style={{ marginTop: "10px" }}>
                <button
                  disabled={pagePatientsModal === 0}
                  onClick={() =>
                    setPagePatientsModal((prev) => Math.max(prev - 1, 0))
                  }
                >
                  Prev
                </button>
                <span style={{ margin: "0 10px" }}>
                  Page {pagePatientsModal + 1} of {totalPagesPatientsModal}
                </span>
                <button
                  disabled={pagePatientsModal + 1 >= totalPagesPatientsModal}
                  onClick={() =>
                    setPagePatientsModal((prev) => prev + 1)
                  }
                >
                  Next
                </button>
              </div>

              <div className="form-actions">
                <button
                  onClick={() => setShowAllocateModal(false)}
                  className="btn-cancel"
                >
                  Cancel
                </button>
                <button onClick={confirmAllocate} className="btn-submit">
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
