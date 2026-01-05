import React, { useState, useEffect } from "react";
import axios from "axios";

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
    <div className="modal-overlay" style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
      justifyContent: 'center', alignItems: 'center', zIndex: 1000
    }}>
      <div className="form-container" style={{
        background: 'white', padding: '2rem', borderRadius: 'var(--border-radius)',
        maxWidth: '500px', width: '100%', maxHeight: '90vh', overflowY: 'auto'
      }}>
        <h3 className="mb-4 text-xl font-bold">Submit Visit Report</h3>

        <label className="block mb-2 font-medium">Status:</label>
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
          className="input-field mb-4"
        >
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>

        {status !== "CANCELLED" && (
          <div className="mb-4">
            <label className="block mb-2 font-medium">Procedures:</label>
            <select
              multiple
              value={selectedProcedures}
              onChange={(e) =>
                setSelectedProcedures(
                  Array.from(e.target.selectedOptions, (option) => option.value)
                )
              }
              className="input-field"
              style={{ minHeight: '100px' }}
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
          <div className="mb-4">
            <label className="block mb-2 font-medium">Consumables:</label>
            {consumables.map((consumable) => (
              <div key={consumable.id} className="flex items-center justify-between mb-2">
                <span className="text-sm">
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
                    className="input-field"
                    style={{ width: '80px', padding: '0.25rem' }}
                  />
                ) : (
                  <span className="text-sm text-gray-500 italic">Out of stock</span>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mb-6">
          <label htmlFor="visit-notes" className="block mb-2 font-medium">Notes:</label>
          <textarea
            id="visit-notes"
            rows={4}
            placeholder="Add any notes about the visit..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="input-field"
          />
        </div>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="btn btn-outline flex-1"
          >
            Close
          </button>
          <button
            onClick={handleSubmit}
            className="btn btn-primary flex-1"
          >
            Submit
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
  const [size] = useState(8);
  const [totalPages, setTotalPages] = useState(0);
  const [procedures, setProcedures] = useState([]);
  const [consumables, setConsumables] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [newPatientsCount, setNewPatientsCount] = useState(null);
  const [newPatientsLoading, setNewPatientsLoading] = useState(false);

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

  const downloadVisitsPdf = async () => {
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
      qs.append("format", "pdf");

      const response = await axios.get(`${apiUrl}admin/export/visits?${qs.toString()}`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/pdf" },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "visits.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to export visits PDF", err);
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

      fetchVisits();
      alert('Visit report submitted successfully!');
    } catch (err) {
      console.error("Failed to submit visit", err);
      if (err.response) {
        const errorMsg = err.response.data || 'Failed to submit visit';
        alert(`Error: ${typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg}`);
      } else {
        alert('Failed to submit visit. Please check your connection and try again.');
      }
      throw err;
    }
  };

  const filteredVisits = visits.filter((visit) =>
    visit.patientName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="visits-page">
      <div className="flex justify-between items-center mb-4">
        <h2>Visit Reports</h2>
        <div className="flex gap-2">
          <button className="btn btn-outline" onClick={downloadVisitsCsv}>
            <i className="fas fa-file-csv" style={{ marginRight: '0.5rem' }}></i> Export CSV
          </button>
          <button className="btn btn-outline" onClick={downloadVisitsPdf}>
            <i className="fas fa-file-pdf" style={{ marginRight: '0.5rem' }}></i> Export PDF
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-4 border-b border-gray-200">
        {['completed', 'pending', 'all'].map((tab) => (
          <button
            key={tab}
            className={`py-2 px-4 font-medium transition-colors ${activeTab === tab ? 'text-teal-700 border-b-2 border-teal-700' : 'text-gray-500 hover:text-gray-700'}`}
            style={activeTab === tab ? { color: 'var(--primary-color)', borderBottom: '2px solid var(--primary-color)' } : {}}
            onClick={() => {
              setActiveTab(tab);
              setPage(0);
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)} Visits
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="card mb-4" style={{ padding: '1rem' }}>
        <div className="flex items-center gap-4 flex-wrap">
          <input
            type="text"
            placeholder="Search Patient..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field"
            style={{ maxWidth: '250px' }}
          />

          <div className="flex items-center gap-2">
            <label htmlFor="startDate" className="text-sm font-medium text-gray-700">From:</label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setPage(0);
              }}
              className="input-field"
              style={{ maxWidth: '160px' }}
            />
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="endDate" className="text-sm font-medium text-gray-700">To:</label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setPage(0);
              }}
              className="input-field"
              style={{ maxWidth: '160px' }}
            />
          </div>

          <span style={{ marginLeft: "auto", padding: "4px 8px", background: "#f3f4f6", borderRadius: 6, border: '1px solid #e5e7eb', fontSize: '0.9rem' }}>
            New patients in period: {newPatientsLoading ? '...' : (newPatientsCount !== null ? newPatientsCount : '-')}
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <table className="main-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: 'var(--background-color)', borderBottom: '1px solid var(--border-color)' }}>
            <tr>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--text-secondary)' }}>Visit ID</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--text-secondary)' }}>Patient</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--text-secondary)' }}>Volunteer</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--text-secondary)' }}>Visit Date</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--text-secondary)' }}>Completed</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--text-secondary)' }}>Procedures</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--text-secondary)' }}>Consumables</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--text-secondary)' }}>Notes</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--text-secondary)' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredVisits.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: "center", padding: "2rem", color: 'var(--text-secondary)' }}>
                  No {activeTab} visits found
                </td>
              </tr>
            ) : (
              filteredVisits.map((visit) => (
                <tr key={visit.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem' }}>{visit.visitCode}</td>
                  <td style={{ padding: '1rem' }}>{visit.patientName}</td>
                  <td style={{ padding: '1rem' }}>{visit.volunteerName}</td>
                  <td style={{ padding: '1rem' }}>
                    {visit.visitDate
                      ? new Date(visit.visitDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {visit.completedDate
                      ? new Date(visit.completedDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {visit.proceduresDone && visit.proceduresDone.length > 0
                      ? visit.proceduresDone.join(", ")
                      : "None"}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {visit.consumablesUsed && visit.consumablesUsed.length > 0
                      ? visit.consumablesUsed
                        .map((usage) => `${usage.consumable.name} (${usage.quantityUsed})`)
                        .join(", ")
                      : "None"}
                  </td>
                  <td style={{ padding: '1rem', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={visit.notes || ''}>{visit.notes || '-'}</td>
                  <td style={{ padding: '1rem' }}>
                    <div className="flex items-center gap-2">
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '999px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        backgroundColor: visit.status === 'COMPLETED' ? 'var(--primary-light)' : '#fef3c7',
                        color: visit.status === 'COMPLETED' ? 'var(--primary-dark)' : 'var(--warning-color)'
                      }}>
                        {visit.status}
                      </span>
                      {visit.status === 'PENDING' && (
                        <button
                          className="btn btn-primary"
                          style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', minWidth: 'auto' }}
                          onClick={() => {
                            setSelectedVisit(visit);
                            setIsModalOpen(true);
                          }}
                        >
                          Submit
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
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
        >
          Previous
        </button>
        <span style={{ color: 'var(--text-secondary)' }}>
          Page {page + 1} of {totalPages}
        </span>
        <button
          className="btn btn-outline"
          disabled={page + 1 >= totalPages}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>

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
    </div>
  );
};

export default Visits;
