import React, { useState, useEffect } from "react";
import AddPatient from "./AddPatient";
import axios from "axios";

const PatientPage = () => {
  const [patients, setPatients] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(6);
  const [direction] = useState("asc");
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(0);

  const [showModal, setShowModal] = useState(false);

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const apiUrl = process.env.REACT_APP_API_URL;

      const response = await axios.get(`${apiUrl}admin/list-patients`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, size, direction, search },
      });

      setPatients(response.data.content); // Page content
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error("Failed to fetch patients", err);
    }
  };

  const downloadPatientsCsv = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const apiUrl = process.env.REACT_APP_API_URL;
      const params = {};
      if (search) params.search = search;

      const response = await axios.get(`${apiUrl}admin/export/patients`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "patients.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to export patients CSV", err);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [page, size, direction, search]);

  const handleAddSuccess = () => {
    fetchPatients();
    setShowModal(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this patient?")) {
      try {
        const token = localStorage.getItem("jwtToken");
        const apiUrl = process.env.REACT_APP_API_URL;

        await axios.delete(`${apiUrl}admin/delete-patient`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { id },
        });
        fetchPatients();
      } catch (err) {
        console.error("Failed to delete patient", err);
      }
    }
  };

  return (
    <div className="patients-page">
      <div className="flex justify-between items-center mb-4">
        <h2>Patient Management</h2>
        <div className="flex gap-2">
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <i className="fas fa-plus" style={{ marginRight: '0.5rem' }}></i> Add Patient
          </button>
          <button className="btn btn-outline" onClick={fetchPatients}>
            <i className="fas fa-sync-alt"></i>
          </button>
          <button className="btn btn-outline" onClick={downloadPatientsCsv}>
            <i className="fas fa-file-export"></i> CSV
          </button>
        </div>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or mobile..."
          value={search}
          onChange={(e) => {
            setPage(0);
            setSearch(e.target.value);
          }}
          className="input-field"
          style={{ maxWidth: '300px' }}
        />
      </div>

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <table className="main-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: 'var(--background-color)', borderBottom: '1px solid var(--border-color)' }}>
            <tr>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--text-secondary)' }}>Name</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--text-secondary)' }}>Mobile</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--text-secondary)' }}>Age</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--text-secondary)' }}>Gender</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--text-secondary)' }}>Address</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--text-secondary)' }}>Condition</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--text-secondary)' }}>Emergency</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--text-secondary)' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {patients.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: "center", padding: "2rem", color: 'var(--text-secondary)' }}>
                  No patients found.
                </td>
              </tr>
            ) : (
              patients.map((patient) => (
                <tr key={patient.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem' }}>{patient.name}</td>
                  <td style={{ padding: '1rem' }}>{patient.mobileNumber}</td>
                  <td style={{ padding: '1rem' }}>{patient.age}</td>
                  <td style={{ padding: '1rem' }}>{patient.gender}</td>
                  <td style={{ padding: '1rem' }}>{patient.address}</td>
                  <td style={{ padding: '1rem' }}>{patient.medicalCondition}</td>
                  <td style={{ padding: '1rem' }}>{patient.emergencyContact}</td>
                  <td style={{ padding: '1rem' }}>
                    <button
                      className="btn btn-outline"
                      style={{ color: 'var(--error-color)', borderColor: 'var(--error-color)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--error-color)'; e.currentTarget.style.color = 'white'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--error-color)'; }}
                      onClick={() => handleDelete(patient.id)}
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

      <div className="flex justify-center items-center gap-4 mt-4">
        <button
          className="btn btn-outline"
          disabled={page === 0}
          onClick={() => setPage((prev) => prev - 1)}
        >
          Previous
        </button>
        <span style={{ color: 'var(--text-secondary)' }}>Page {page + 1} of {totalPages || 1}</span>
        <button
          className="btn btn-outline"
          disabled={page + 1 >= totalPages}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>

      {showModal && (
        <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
          justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div className="form-container" style={{
            background: 'white', padding: '2rem', borderRadius: 'var(--border-radius)',
            width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto'
          }}>
            <AddPatient onSuccess={handleAddSuccess} />
            <button
              onClick={() => { setShowModal(false); fetchPatients(); }}
              className="btn btn-outline"
              style={{ marginTop: '1rem', width: '100%' }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientPage;
