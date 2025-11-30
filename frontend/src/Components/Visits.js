import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, NavLink } from "react-router-dom";
import { getDisplayName } from "../utils/auth";
import "./Styles/Admin.css";
import "./Styles/Main.css";
import "./Styles/Sidebar.css";

// Modal Component for Visit Submission
const ProcedureModal = ({ visit, procedures, consumables, onClose, onSubmit }) => {
  const [selectedProcedures, setSelectedProcedures] = useState([]);
  const [selectedConsumables, setSelectedConsumables] = useState([]);
  const [status, setStatus] = useState("COMPLETED");
  const [notes, setNotes] = useState("");

  const getConsumableQty = (id) => {
    const item = selectedConsumables.find((c) => c.consumableId === id);
    return item ? item.quantity : "";
  };

  const handleConsumableChange = (id, quantity) => {
    setSelectedConsumables((prev) => {
      const existing = prev.find((c) => c.consumableId === id);
      if (existing) {
        return prev.map((c) =>
          c.consumableId === id ? { ...c, quantity: quantity } : c
        );
      } else {
        return [...prev, { consumableId: id, quantity: quantity }];
      }
    });
  };

  const handleSubmit = async () => {
    if (status !== "CANCELLED" && !selectedProcedures.length) {
      alert("Please select at least one procedure");
      return;
    }

    try {
      const procsToSend = status === "CANCELLED" ? [] : selectedProcedures;
      const consumablesToSend = status === "CANCELLED"
        ? []
        : selectedConsumables.filter((c) => c.quantity > 0);

      await onSubmit(visit.id, procsToSend, consumablesToSend, status, notes);
      onClose();
    } catch (err) {
      alert("Failed to submit visit");
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Submit Visit Report</h3>

        <label>Status:</label>
        <select 
          value={status} 
          onChange={(e) => {
            const val = e.target.value;
            setStatus(val);
            if (val === "CANCELLED") {
              setSelectedProcedures([]);
              setSelectedConsumables([]);
            }
          }}
        >
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>

        {status !== "CANCELLED" && (
          <div>
            <label>Procedures:</label>
            <select
              multiple
              value={selectedProcedures}
              onChange={(e) =>
                setSelectedProcedures(
                  Array.from(e.target.selectedOptions, (option) => option.value)
                )
              }
              className="custom-select"
            >
              {procedures.map((procedure) => (
                <option key={procedure.procedureId} value={procedure.procedureId}>
                  {procedure.procedureName}
                </option>
              ))}
            </select>
          </div>
        )}

        {status !== "CANCELLED" && (
          <div>
            <label>Consumables:</label>
            {consumables.map((consumable) => (
              <div key={consumable.id} className="flex items-center space-x-2 my-1">
                <span>
                  {consumable.name} (Stock: {consumable.stockQuantity})
                </span>
                {consumable.stockQuantity > 0 ? (
                  <input
                    type="number"
                    min="0"
                    max={consumable.stockQuantity}
                    value={getConsumableQty(consumable.id)}
                    placeholder="Qty"
                    onChange={(e) =>
                      handleConsumableChange(
                        consumable.id,
                        parseInt(e.target.value, 10) || 0
                      )
                    }
                    className="w-20 p-1 border rounded"
                  />
                ) : (
                  <span style={{ marginLeft: 8, color: '#888' }}>Out of stock</span>
                )}
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: 12 }}>
          <label htmlFor="visit-notes">Notes:</label>
          <textarea
            id="visit-notes"
            rows={4}
            placeholder="Add any notes about the visit..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            style={{ width: '100%', padding: 8, boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button 
            onClick={handleSubmit}
            style={{
              background: '#007bff',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#0056b3'}
            onMouseOut={(e) => e.currentTarget.style.background = '#007bff'}
          >
            Submit
          </button>
          <button 
            onClick={onClose}
            style={{
              background: '#6c757d',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#5a6268'}
            onMouseOut={(e) => e.currentTarget.style.background = '#6c757d'}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const Visits = () => {
  const [visits, setVisits] = useState([]);
  const [activeTab, setActiveTab] = useState("all"); // completed / pending / all
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(8);
  const [totalPages, setTotalPages] = useState(0);
  const [procedures, setProcedures] = useState([]);
  const [consumables, setConsumables] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [newPatientsCount, setNewPatientsCount] = useState(null);
  const [newPatientsLoading, setNewPatientsLoading] = useState(false);

  const navigate = useNavigate();

  const fetchVisits = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const apiUrl = process.env.REACT_APP_API_URL;

      let params = {
        page,
        size,
      };

      // Add status only if tab is not "all"
      if (activeTab !== "all") {
        params.status = activeTab.toUpperCase(); // backend expects COMPLETED / PENDING
      }

      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      setNewPatientsLoading(true);
      const response = await axios.get(`${apiUrl}admin/visits`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      // Debug: inspect backend payload
      console.debug('GET /admin/visits payload:', response.data);

      // Support both shapes:
      // 1) VisitPageResponseDTO { visits: Page<...>, newPatientsCount }
      // 2) Plain Page (legacy) { content, totalPages, ... }
      const maybeDto = response.data;
      const visitsPage = maybeDto?.visits && maybeDto.visits.content ? maybeDto.visits
                        : (maybeDto?.content ? maybeDto : null);

      setVisits(visitsPage?.content || []);
      setTotalPages(visitsPage?.totalPages || 0);

      const rawCount = maybeDto?.newPatientsCount;
      const parsedCount =
        typeof rawCount === 'number'
          ? rawCount
          : (typeof rawCount === 'string' && /^\d+$/.test(rawCount) ? parseInt(rawCount, 10) : null);
      setNewPatientsCount(parsedCount);
    } catch (err) {
      console.error("Failed to fetch visits", err);
    }
    finally {
      setNewPatientsLoading(false);
    }
  };

  const downloadVisitsCsv = async () => {
    try {
      if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
        alert("Invalid date range: 'From' is after 'To'.");
        return;
      }

      if (filteredVisits.length === 0) {
        alert("No visits found for the selected filters to export.");
        return;
      }

      const token = localStorage.getItem("jwtToken");
      const apiUrl = process.env.REACT_APP_API_URL;
      const qs = new URLSearchParams();
      if (startDate) qs.append("startDate", startDate);
      if (endDate) qs.append("endDate", endDate);

      const response = await axios.get(`${apiUrl}admin/export/visits?${qs.toString()}`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "text/csv" },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "visits.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to export visits CSV", err);
    }
  };

  useEffect(() => {
    fetchVisits();
    if (activeTab === 'pending') {
      fetchProcedures();
      fetchConsumables();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, page, size, startDate, endDate]);

  const fetchProcedures = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await axios.get(`${apiUrl}volunteer/procedures`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProcedures(response.data);
    } catch (err) {
      console.error("Failed to fetch procedures", err);
    }
  };

  const fetchConsumables = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await axios.get(`${apiUrl}volunteer/consumables`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setConsumables(response.data);
    } catch (err) {
      console.error("Failed to fetch consumables", err);
    }
  };

  const handleSubmitVisit = async (visitId, procedures, consumables, status, notes) => {
    try {
      const token = localStorage.getItem("jwtToken");
      const apiUrl = process.env.REACT_APP_API_URL;
      
      // Prepare the request body according to the backend's expected format
      const requestBody = {
        visitId: visitId,
        procedureIds: procedures,
        consumables: consumables,
        status: status,
        notes: notes
      };
      
      await axios.post(
        `${apiUrl}admin/submit-report`,
        requestBody,
        { 
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          } 
        }
      );
      
      // Refresh visits after submission
      fetchVisits();
      alert('Visit report submitted successfully!');
    } catch (err) {
      console.error("Failed to submit visit", err);
      // Show more detailed error message
      if (err.response) {
        const errorMsg = err.response.data || 'Failed to submit visit';
        alert(`Error: ${typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg}`);
      } else {
        alert('Failed to submit visit. Please check your connection and try again.');
      }
      throw err;
    }
  };

  // filter visits by patient name
  const filteredVisits = visits.filter((visit) =>
    visit.patientName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1>Visit Reports</h1>
          <div className="topbar-actions">
            <span className="greeting">Hello, {getDisplayName()}</span>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </header>

        {/* Tabs */}
        <div className="mb-4 flex space-x-4" style={{ marginBottom: "20px" }}>
          <button
            className={activeTab === "completed" ? "active-tab" : ""}
            onClick={() => {
              setActiveTab("completed");
              setPage(0);
            }}
          >
            Completed Visits
          </button>
          <button
            className={activeTab === "pending" ? "active-tab" : ""}
            onClick={() => {
              setActiveTab("pending");
              setPage(0);
            }}
          >
            Pending Visits
          </button>
          <button
            className={activeTab === "all" ? "active-tab" : ""}
            onClick={() => {
              setActiveTab("all");
              setPage(0);
            }}
          >
            All Visits
          </button>
        </div>

        {/* Filters */}
        <div className="filters" style={{ marginBottom: "20px" }}>
          {/* Search */}
          <label htmlFor="search">Search Patient: </label>
          <input
            id="search"
            type="text"
            placeholder="Enter patient name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: "5px", marginLeft: "10px", marginRight: "20px" }}
          />

          {/* Date Range */}
          <label htmlFor="startDate">From: </label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setPage(0);
            }}
            style={{ marginLeft: "10px", marginRight: "20px" }}
          />

          <label htmlFor="endDate">To: </label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              setPage(0);
            }}
            style={{ marginLeft: "10px" }}
          />
          <button onClick={downloadVisitsCsv} style={{ marginLeft: "20px" }}>Export CSV</button>
          <span style={{ marginLeft: "12px", padding: "4px 8px", background: "#f3f4f6", borderRadius: 6, border: '1px solid #e5e7eb' }}>
            Total new patients: {newPatientsLoading ? '...' : (newPatientsCount !== null ? newPatientsCount : '-')}
          </span>
        </div>

        {/* Table */}
        <div>
          <table className="main-table">
            <thead>
              <tr>
                <th>Visit Id</th>
                <th>Patient</th>
                <th>Volunteer</th>
                <th>Visit Date</th>
                <th>Completed Date</th>
                <th>Procedures Done</th>
                <th>Consumables Used</th>
                <th>Notes</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredVisits.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: "center", padding: "20px" }}>
                    No {activeTab} visits found
                  </td>
                </tr>
              ) : (
                filteredVisits.map((visit) => (
                  <tr key={visit.id}>
                    <td>{visit.visitCode}</td>
                    <td>{visit.patientName}</td>
                    <td>{visit.volunteerName}</td>
                    <td>
                      {visit.visitDate
                        ? new Date(visit.visitDate).toLocaleDateString()
                        : "-"}
                    </td>
                    <td>
                      {visit.completedDate
                        ? new Date(visit.completedDate).toLocaleDateString()
                        : "-"}
                    </td>
                    <td>
                      {visit.proceduresDone && visit.proceduresDone.length > 0
                        ? visit.proceduresDone.join(", ")
                        : "None"}
                    </td>
                    <td>
  {visit.consumablesUsed && visit.consumablesUsed.length > 0
    ? visit.consumablesUsed
        .map((usage) => `${usage.consumable.name} (${usage.quantityUsed})`)
        .join(", ")
    : "None"}
</td>

                    <td>{visit.notes || '-'}</td>

                    <td>
                      {visit.status}
                      {visit.status === 'PENDING' && (
                        <div style={{ display: 'inline-block', marginLeft: '10px' }}>
                          <button 
                            onClick={() => {
                              setSelectedVisit(visit);
                              setIsModalOpen(true);
                            }}
                            style={{
                              background: '#007bff',
                              color: 'white',
                              border: 'none',
                              padding: '4px 12px',
                              borderRadius: '4px',
                              cursor: 'pointer'
                            }}
                          >
                            Submit
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Submit Visit Modal */}
          {isModalOpen && selectedVisit && (
            <ProcedureModal
              visit={selectedVisit}
              procedures={procedures}
              consumables={consumables}
              onClose={() => {
                setIsModalOpen(false);
                setSelectedVisit(null);
              }}
              onSubmit={handleSubmitVisit}
            />
          )}

          {/* Modal Styles */}
          <style jsx>{`
            .modal {
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: rgba(0, 0, 0, 0.5);
              display: flex;
              align-items: center;
              justify-content: center;
              z-index: 1000;
            }
            .modal-content {
              background: white;
              padding: 20px;
              border-radius: 8px;
              max-width: 500px;
              width: 100%;
              max-height: 90vh;
              overflow-y: auto;
            }
            .custom-select {
              width: 100%;
              min-height: 100px;
              padding: 8px;
              border: 1px solid #ddd;
              border-radius: 4px;
            }
          `}</style>
        </div>

        {/* Pagination */}
        <div className="pagination" style={{ marginTop: "20px", textAlign: "center" }}>
          <button
            disabled={page === 0}
            onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
            style={{ marginRight: "10px" }}
          >
            Previous
          </button>
          <span>
            Page {page + 1} of {totalPages}
          </span>
          <button
            disabled={page + 1 >= totalPages}
            onClick={() => setPage((prev) => prev + 1)}
            style={{ marginLeft: "10px" }}
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
};

export default Visits;
