import React, { useState, useEffect } from "react";


const apiUrl = process.env.REACT_APP_API_URL;

const decodeJwtToken = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to decode JWT token", error);
    return null;
  }
};

const CompletedVisits = () => {
  const [completedVisits, setCompletedVisits] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchCompletedVisits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const fetchCompletedVisits = async () => {
    setLoading(true);
    setError("");

    const jwtToken = localStorage.getItem("jwtToken");
    if (!jwtToken) {
      setError("No JWT token found");
      setLoading(false);
      return;
    }

    const decodedToken = decodeJwtToken(jwtToken);
    if (!decodedToken || !decodedToken.userId) {
      setError("Invalid token or user ID not found");
      setLoading(false);
      return;
    }

    try {
      const url = new URL(`${apiUrl}volunteer/completed-visits`);
      url.searchParams.set("page", page);
      url.searchParams.set("size", size);
      const response = await fetch(url.toString(), {
        method: "GET",
        headers: { Authorization: `Bearer ${jwtToken}` },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch completed visits");
      }

      const data = await response.json();
      setCompletedVisits(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="completed-visits-page">
      <h2 className="mb-4">Completed Visits</h2>

      {error && <div className="p-4 mb-4 text-red-700 bg-red-100 rounded border border-red-200">{error}</div>}

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading visits...</div>
      ) : completedVisits.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-gray-400 mb-2">
            <i className="fas fa-clipboard-check fa-3x"></i>
          </div>
          <p className="text-lg text-gray-600">No completed visits found.</p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="main-table" style={{ width: '100%', marginBottom: 0 }}>
            <thead style={{ backgroundColor: 'var(--background-color)', borderBottom: '1px solid var(--border-color)' }}>
              <tr>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--text-secondary)' }}>Visit ID</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--text-secondary)' }}>Patient Name</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--text-secondary)' }}>Volunteer Name</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--text-secondary)' }}>Visit Date</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--text-secondary)' }}>Completed Date</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--text-secondary)' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {completedVisits.map((visit) => (
                <tr key={visit.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem', fontWeight: '500' }}>{visit.visitCode}</td>
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
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '999px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      backgroundColor: 'var(--primary-light)',
                      color: 'var(--primary-dark)'
                    }}>
                      {visit.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-4">
        <button
          className="btn btn-outline"
          disabled={page === 0}
          onClick={() => setPage((p) => Math.max(p - 1, 0))}
        >
          Previous
        </button>
        <span style={{ color: 'var(--text-secondary)' }}>
          Page {page + 1} of {totalPages}
        </span>
        <button
          className="btn btn-outline"
          disabled={page + 1 >= totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CompletedVisits;
