import React, { useState, useEffect } from "react";
import AddVolunteer from "./AddVolunteer";

import axios from "axios";

const VolunteerPage = () => {
  const [volunteerList, setVolunteerList] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

  const [page, setPage] = useState(0);
  const [size] = useState(6); // kept as state to satisfy usage if needed, or remove setSize
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const fetchVolunteers = async (pageNum = page) => {
    try {
      const token = localStorage.getItem("jwtToken");
      const apiUrl = process.env.REACT_APP_API_URL;

      const response = await axios.get(`${apiUrl}admin/list-volunteers`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page: pageNum, size, search: search, sortBy: 'id' }
      });

      const data = response.data || {};
      setVolunteerList(Array.isArray(data.content) ? data.content : (Array.isArray(data) ? data : []));
      setTotalPages(typeof data.totalPages === 'number' ? data.totalPages : 0);
      setPage(typeof data.number === 'number' ? data.number : pageNum);
      setError("");
    } catch (err) {
      console.error("Failed to fetch volunteers", err);
      const status = err?.response?.status;
      const message = err?.response?.data || err?.message || 'Failed to fetch volunteers';
      setError(typeof message === 'string' ? message : JSON.stringify(message));
    }
  };

  // Fix: include fetchVolunteers in dependency, but wrap in useCallback or just use simpler approach.
  // Actually simplest is to include [page, search] in useEffect and call fetchVolunteers() inside.
  useEffect(() => {
    fetchVolunteers(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search]);
  // We ignore exhaustive-deps here because we want to trigger on page/search change, 
  // but fetchVolunteers itself is stable or we don't want to redefine it.

  // Handle setSize unused warning by just not destructuring it if not used, 
  // but we used 'size' in fetchVolunteers. 'setSize' is what was unused.
  // So we can just do: const [size] = useState(6);

  const handleAddSuccess = () => {
    fetchVolunteers();
    setShowAddForm(false);
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

  return (
    <div className="volunteer-page">
      <div className="flex justify-between items-center mb-4">
        <h2>Volunteer Management</h2>
        <div className="flex gap-2">
          <button
            className="btn btn-primary"
            onClick={() => setShowAddForm(true)}
          >
            <i className="fas fa-plus" style={{ marginRight: '0.5rem' }}></i> Add Volunteer
          </button>

        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search volunteers..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0); // reset to first page on search
          }}
          className="input-field"
          style={{ maxWidth: '300px' }}
        />
      </div>

      {error && (
        <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>
      )}

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="main-table" style={{ width: '100%', marginBottom: 0 }}>
          <thead style={{ backgroundColor: 'var(--background-color)', borderBottom: '1px solid var(--border-color)' }}>
            <tr>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--text-secondary)' }}>Name</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--text-secondary)' }}>Email</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--text-secondary)' }}>Phone</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--text-secondary)' }}>Specialization</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--text-secondary)' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {volunteerList.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "2rem", color: 'var(--text-secondary)' }}>
                  No volunteers found
                </td>
              </tr>
            ) : (
              volunteerList.map((volunteer) => (
                <tr key={volunteer.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem', fontWeight: '500' }}>{volunteer.name}</td>
                  <td style={{ padding: '1rem' }}>{volunteer.email}</td>
                  <td style={{ padding: '1rem' }}>{volunteer.phoneNumber}</td>
                  <td style={{ padding: '1rem' }}>{volunteer.specialization || <span className="text-gray-400">Not specified</span>}</td>
                  <td style={{ padding: '1rem' }}>
                    <button
                      onClick={() => handleDelete(volunteer.id)}
                      className="btn btn-outline"
                      style={{ color: 'var(--error-color)', borderColor: 'var(--error-color)', padding: '0.25rem 0.5rem' }}
                      title="Delete Volunteer"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
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

      {showAddForm && (
        <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
          justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div className="form-container" style={{
            background: 'white', padding: '2rem', borderRadius: 'var(--border-radius)',
            width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto'
          }}>
            <AddVolunteer onSuccess={handleAddSuccess} onCancel={() => setShowAddForm(false)} />
          </div>
        </div>
      )}


    </div>
  );
};

export default VolunteerPage;
