import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import "../Styles/Admin.css";
import "../Styles/Main.css";
import "../Styles/Sidebar.css";
import AddEquipment from "./AddEquipment";
import EquipmentTypeManager from "./EquipmentTypeManager";



const EquipmentPage = () => {
  const [equipmentList, setEquipmentList] = useState([]);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [showTypeManager, setShowTypeManager] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [equipmentTypes, setEquipmentTypes] = useState({});
  const [isLoadingTypes, setIsLoadingTypes] = useState(true);

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

  // Fetch equipment types
  const fetchEquipmentTypes = async () => {
    try {
      const response = await axios.get(`${apiUrl}admin/equipment-types`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Convert array to object for easier lookup
      const typesMap = {};
      response.data.forEach(type => {
        typesMap[type.id] = type.name;
      });
      setEquipmentTypes(typesMap);
    } catch (err) {
      console.error('Failed to fetch equipment types', err);
      setError('Failed to load equipment types');
    } finally {
      setIsLoadingTypes(false);
    }
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

  useEffect(() => {
    fetchEquipment();
    fetchEquipmentTypes();
  }, []);

  // ... rest of your existing code ...

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      {/* ... existing sidebar code ... */}

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
            <div className="flex space-x-2">
              <button 
                onClick={() => setShowAddForm(true)}
                className="btn-primary"
              >
                + Add Equipment
              </button>
              <button
                onClick={() => setShowTypeManager(true)}
                className="btn-secondary"
              >
                Manage Types
              </button>
              <button
                onClick={() => fetchEquipment(0, searchQuery)}
                className="btn-secondary"
              >
                Refresh List
              </button>
            </div>
            <div className="flex-1 ml-4">
              <input
                type="text"
                placeholder="Search by name, type, or allocated patient..."
                value={searchQuery}
                onChange={(e) => {
                  setPage(0);
                  setSearchQuery(e.target.value);
                }}
                className="search-input w-full"
              />
            </div>
          </div>

          {error && <p className="text-red-600">{error}</p>}

          {/* Add Equipment Form */}
          {showAddForm && (
            <div className="modal-overlay">
              <div className="form-container">
                <AddEquipment 
                  onSuccess={handleAddSuccess} 
                  onClose={() => setShowAddForm(false)}
                  equipmentTypes={Object.entries(equipmentTypes).map(([id, name]) => ({ id, name }))}
                  isLoadingTypes={isLoadingTypes}
                />
              </div>
            </div>
          )}

          {/* Equipment Table */}
          <table className="main-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Equipment Name</th>
                <th>Type</th>
                <th>Allocated</th>
                <th>Allocated To</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {equipmentList.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">
                    No equipment available.
                  </td>
                </tr>
              ) : (
                equipmentList.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>{equipmentTypes[item.equipmentTypeId] || 'N/A'}</td>
                    <td>{item.allocated ? "Yes" : "No"}</td>
                    <td>{item.patientName || "-"}</td>
                    <td className="space-x-2">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="btn-delete"
                        title="Delete Equipment"
                      >
                        <i className="fas fa-trash"></i>
                      </button>

                      {item.allocated ? (
                        <button
                          onClick={() => handleDeallocate(item.id)}
                          className="btn-warning"
                          title="Deallocate Equipment"
                        >
                          <i className="fas fa-unlink"></i>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAllocate(item)}
                          className="btn-primary"
                          title="Allocate Equipment"
                        >
                          <i className="fas fa-link"></i>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Equipment Type Manager Modal */}
          {showTypeManager && (
            <div className="modal-overlay">
              <div className="form-container" style={{ maxWidth: '600px' }}>
                <EquipmentTypeManager 
                  onClose={() => {
                    setShowTypeManager(false);
                    fetchEquipmentTypes(); // Refresh types when closing
                  }}
                  token={token}
                  apiUrl={apiUrl}
                />
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default EquipmentPage;