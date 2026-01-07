import React, { useState, useEffect } from "react";
import AddProcedure from "./AddProcedure";
import axios from "axios";

const ProcedurePage = () => {
  const [procedureList, setProcedureList] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchProcedures = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await axios.get(`${apiUrl}admin/procedures`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProcedureList(response.data);
    } catch (err) {
      console.error("Failed to fetch procedures", err);
    }
  };

  useEffect(() => {
    fetchProcedures();
  }, []);

  const handleAddSuccess = () => {
    fetchProcedures();
    setShowAddForm(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this procedure?")) {
      try {
        const token = localStorage.getItem("jwtToken");
        const apiUrl = process.env.REACT_APP_API_URL;

        await axios.delete(`${apiUrl}admin/delete-procedure`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { id },
        });
        fetchProcedures();
      } catch (err) {
        console.error("Failed to delete procedure", err);
      }
    }
  };

  return (
    <div className="procedure-page">
      <div className="flex justify-between items-center mb-4">
        <h2>Procedure Management</h2>
        <div className="flex gap-2">
          <button className="btn btn-primary" onClick={() => setShowAddForm(true)}>
            <i className="fas fa-plus" style={{ marginRight: '0.5rem' }}></i> Add Procedure
          </button>
          <button className="btn btn-outline" onClick={fetchProcedures}>
            <i className="fas fa-sync-alt"></i>
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <table className="main-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--background-color)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--text-secondary)' }}>ID</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--text-secondary)' }}>Procedure Name</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--text-secondary)' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {procedureList.length === 0 ? (
              <tr>
                <td colSpan="3" style={{ textAlign: "center", padding: "2rem", color: 'var(--text-secondary)' }}>
                  No procedures available
                </td>
              </tr>
            ) : (
              procedureList.map((procedure) => (
                <tr key={procedure.procedureId} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem' }}>{procedure.procedureId}</td>
                  <td style={{ padding: '1rem' }}>{procedure.procedureName}</td>
                  <td style={{ padding: '1rem' }}>
                    <button
                      className="btn btn-outline"
                      style={{ color: 'var(--error-color)', borderColor: 'var(--error-color)' }}
                      onClick={() => handleDelete(procedure.procedureId)}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--error-color)'; e.currentTarget.style.color = 'white'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--error-color)'; }}
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

      {/* Add Procedure Form Modal */}
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
            <AddProcedure onSuccess={handleAddSuccess} onCancel={() => setShowAddForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcedurePage;
