import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import AddEquipment from "./AddEquipment";

// Debounce function
const debounce = (func, delay) => {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };
};

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

  // Fetch equipment list
  const fetchEquipment = useCallback(async (pageNum = page, searchTerm = searchQuery) => {
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
  }, [apiUrl, page, searchQuery, size, token]);

  // Debounced search effect
  useEffect(() => {
    const debouncedSearch = debounce((searchTerm) => {
      fetchEquipment(0, searchTerm);
    }, 300);

    debouncedSearch(searchQuery);

    return () => {
      debouncedSearch.cancel?.();
    };
  }, [searchQuery, fetchEquipment]);

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
  }, [fetchEquipment]);

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
    if (!window.confirm("Are you sure you want to delete this equipment?")) return;
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
    <div className="equipment-page">
      <div className="flex justify-between items-center mb-4">
        <h2>Equipment Management</h2>
        <div className="flex gap-2">
          <button className="btn btn-primary" onClick={() => setShowAddForm(true)}>
            <i className="fas fa-plus" style={{ marginRight: '0.5rem' }}></i> Add Equipment
          </button>
          <button className="btn btn-outline" onClick={() => fetchEquipment(0, searchQuery)}>
            <i className="fas fa-sync-alt"></i>
          </button>
        </div>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or allocated patient..."
          value={searchQuery}
          onChange={(e) => {
            setPage(0);
            setSearchQuery(e.target.value);
          }}
          className="input-field"
          style={{ maxWidth: '350px' }}
        />
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <table className="main-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: 'var(--background-color)', borderBottom: '1px solid var(--border-color)' }}>
            <tr>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--text-secondary)' }}>ID</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--text-secondary)' }}>Equipment Name</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--text-secondary)' }}>Allocated</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--text-secondary)' }}>Allocated To</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--text-secondary)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {equipmentList.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "2rem", color: 'var(--text-secondary)' }}>
                  No equipment available.
                </td>
              </tr>
            ) : (
              equipmentList.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem' }}>{item.id}</td>
                  <td style={{ padding: '1rem' }}>{item.name}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '999px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      backgroundColor: item.allocated ? 'var(--primary-light)' : '#f3f4f6',
                      color: item.allocated ? 'var(--primary-dark)' : 'var(--text-secondary)'
                    }}>
                      {item.allocated ? "Yes" : "No"}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>{item.patientName || "-"}</td>
                  <td style={{ padding: '1rem' }}>
                    <div className="flex gap-2">
                      <button
                        className="btn btn-outline"
                        style={{ color: 'var(--error-color)', borderColor: 'var(--error-color)', padding: '0.25rem 0.5rem' }}
                        onClick={() => handleDelete(item.id)}
                        title="Delete"
                      >
                        <i className="fas fa-trash"></i>
                      </button>

                      {item.allocated ? (
                        <button
                          onClick={() => handleDeallocate(item.id)}
                          className="btn btn-outline"
                          style={{ color: 'var(--warning-color)', borderColor: 'var(--warning-color)', padding: '0.25rem 0.5rem' }}
                          title="Deallocate"
                        >
                          <i className="fas fa-unlink"></i>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAllocate(item)}
                          className="btn btn-outline"
                          style={{ color: 'var(--primary-color)', borderColor: 'var(--primary-color)', padding: '0.25rem 0.5rem' }}
                          title="Allocate"
                        >
                          <i className="fas fa-link"></i>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-4">
        <button
          className="btn btn-outline"
          disabled={page === 0}
          onClick={() => fetchEquipment(page - 1, searchQuery)}
        >
          Previous
        </button>
        <span style={{ color: 'var(--text-secondary)' }}>
          Page {page + 1} of {totalPages}
        </span>
        <button
          className="btn btn-outline"
          disabled={page + 1 >= totalPages}
          onClick={() => fetchEquipment(page + 1, searchQuery)}
        >
          Next
        </button>
      </div>

      {/* Add Equipment Form */}
      {showAddForm && (
        <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
          justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div className="form-container" style={{
            background: 'white', padding: '2rem', borderRadius: 'var(--border-radius)',
            width: '100%', maxWidth: '500px'
          }}>
            <AddEquipment onSuccess={handleAddSuccess} onCancel={() => setShowAddForm(false)} />
          </div>
        </div>
      )}

      {/* Allocate Modal */}
      {showAllocateModal && (
        <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex',
          justifyContent: 'center', alignItems: 'center', zIndex: 1000,
          backdropFilter: 'blur(2px)'
        }}>
          <div className="form-container" style={{
            background: 'white', padding: '2rem', borderRadius: 'var(--border-radius)',
            width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto'
          }}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold m-0">Allocate {selectedEquipment?.name}</h3>
              <button
                onClick={() => setShowAllocateModal(false)}
                className="text-gray-300 hover:text-gray-500 transition-colors"
                title="Close"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <input
              type="text"
              placeholder="Search patient by name or mobile..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPagePatientsModal(0);
              }}
              className="input-field mb-4"
            />

            <div className="patient-list mb-4" style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {patientsModal.length === 0 ? (
                <p className="text-gray-500 text-center">No patients found</p>
              ) : (
                patientsModal.map((p) => (
                  <div
                    key={p.id}
                    className="flex justify-between items-center p-2 border-b border-gray-100 hover:bg-gray-50"
                  >
                    <div>
                      <div className="font-medium">{p.name}</div>
                      <div className="text-sm text-gray-400">{p.mobileNumber}</div>
                    </div>
                    <input
                      type="checkbox"
                      name="patient"
                      value={p.id}
                      checked={selectedPatient === String(p.id)}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        if (isChecked) {
                          setSelectedPatient(String(p.id));
                        } else if (selectedPatient === String(p.id)) {
                          setSelectedPatient("");
                        }
                      }}
                      style={{ width: '1.2rem', height: '1.2rem' }}
                    />
                  </div>
                ))
              )}
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', width: '100%' }}>
              <button
                onClick={confirmAllocate}
                className="btn btn-primary"
                style={{ flex: 1, height: '38px', fontSize: '0.8125rem', whiteSpace: 'nowrap' }}
              >
                Confirm
              </button>
              <button
                onClick={() => setShowAllocateModal(false)}
                className="btn btn-outline"
                style={{ flex: 1, height: '38px', fontSize: '0.8125rem', whiteSpace: 'nowrap' }}
              >
                Cancel
              </button>
            </div>

            {/* Pagination for Modal */}
            <div className="flex justify-center items-center gap-4" style={{ marginTop: '1.5rem' }}>
              <button
                className="btn btn-outline"
                style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem', minWidth: 'auto' }}
                disabled={pagePatientsModal === 0}
                onClick={() =>
                  setPagePatientsModal((prev) => Math.max(prev - 1, 0))
                }
                title="Previous"
              >
                <i className="fas fa-chevron-left text-xs"></i>
              </button>
              <span className="text-xs font-medium text-gray-500">
                {pagePatientsModal + 1} / {totalPagesPatientsModal}
              </span>
              <button
                className="btn btn-outline"
                style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem', minWidth: 'auto' }}
                disabled={pagePatientsModal + 1 >= totalPagesPatientsModal}
                onClick={() =>
                  setPagePatientsModal((prev) => prev + 1)
                }
                title="Next"
              >
                <i className="fas fa-chevron-right text-xs"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EquipmentPage;
