import React, { useState, useEffect } from "react";
import axios from "axios";

const Visits = () => {
  const [visits, setVisits] = useState([]);
  const [activeTab, setActiveTab] = useState("completed"); // completed / pending / all
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(0);
  const [size] = useState(8);
  const [totalPages, setTotalPages] = useState(0);

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

      const response = await axios.get(`${apiUrl}admin/visits`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      setVisits(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
    } catch (err) {
      console.error("Failed to fetch visits", err);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, page, size, startDate, endDate]);

  // filter visits by patient name
  const filteredVisits = visits.filter((visit) =>
    visit.patientName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="visits-page">
      <div className="flex justify-between items-center mb-4">
        <h2>Visit Reports</h2>
        <button className="btn btn-outline" onClick={downloadVisitsCsv}>
          <i className="fas fa-file-export" style={{ marginRight: '0.5rem' }}></i> Export CSV
        </button>
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
    </div>
  );
};

export default Visits;
