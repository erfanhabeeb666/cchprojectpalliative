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
  const [patientToEdit, setPatientToEdit] = useState(null);
  const [modalMode, setModalMode] = useState("add"); // "add" or "edit"

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

  const downloadPatientsPdf = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const apiUrl = process.env.REACT_APP_API_URL;
      const params = { format: 'pdf' };
      if (search) params.search = search;

      const response = await axios.get(`${apiUrl}admin/export/patients`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/pdf" },
        params,
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "patients.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to export patients PDF", err);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [page, size, direction, search]);

  const handleAddSuccess = () => {
    fetchPatients();
    setShowModal(false);
    setPatientToEdit(null);
    setModalMode("add");
  };

  const handleEdit = (patient) => {
    setPatientToEdit(patient);
    setModalMode("edit");
    setShowModal(true);
  };

  // Logic from `ri`: support 'Remove' vs 'Removed' based on alivestatus
  const handleDelete = async (patient) => {
    const isRemoved = patient.alivestatus === "no";
    if (isRemoved) return; // already removed

    if (window.confirm("Are you sure you want to remove this patient?")) {
      try {
        const token = localStorage.getItem("jwtToken");
        const apiUrl = process.env.REACT_APP_API_URL;

        await axios.delete(`${apiUrl}admin/delete-patient`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { id: patient.id },
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
          <button className="btn btn-primary" onClick={() => {
            setModalMode("add");
            setPatientToEdit(null);
            setShowModal(true);
          }}>
            <i className="fas fa-plus" style={{ marginRight: '0.5rem' }}></i> Add Patient
          </button>
          <button className="btn btn-outline" onClick={fetchPatients}>
            <i className="fas fa-sync-alt"></i>
          </button>
          <button className="btn btn-outline" onClick={downloadPatientsCsv}>
            <i className="fas fa-file-csv"></i> CSV
          </button>
          <button className="btn btn-outline" onClick={downloadPatientsPdf}>
            <i className="fas fa-file-pdf"></i> PDF
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
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--text-secondary)' }}>Date</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--text-secondary)' }}>Condition</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--text-secondary)' }}>Status</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--text-secondary)' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {patients.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: "center", padding: "2rem", color: 'var(--text-secondary)' }}>
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
                  <td style={{ padding: '1rem' }}>
                    {patient.date ? new Date(patient.date).toLocaleDateString() : "-"}
                  </td>
                  <td style={{ padding: '1rem' }}>{patient.medicalCondition}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '999px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      backgroundColor: patient.alivestatus === 'no' ? '#f3f4f6' : 'var(--success-light)',
                      color: patient.alivestatus === 'no' ? '#9ca3af' : 'var(--success-dark)'
                    }}>
                      {patient.alivestatus === 'no' ? 'Deceased' : 'Alive'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div className="flex gap-2">
                      <button
                        className="btn btn-outline"
                        style={{ color: 'var(--primary-color)', borderColor: 'var(--primary-color)' }}
                        onClick={() => handleEdit(patient)}
                        title="Edit Patient"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        className="btn btn-outline"
                        disabled={patient.alivestatus === "no"}
                        style={{
                          color: patient.alivestatus === "no" ? '#9ca3af' : 'var(--error-color)',
                          borderColor: patient.alivestatus === "no" ? '#d1d5db' : 'var(--error-color)',
                          cursor: patient.alivestatus === "no" ? 'not-allowed' : 'pointer'
                        }}
                        onMouseEnter={(e) => {
                          if (patient.alivestatus !== 'no') {
                            e.currentTarget.style.backgroundColor = 'var(--error-color)';
                            e.currentTarget.style.color = 'white';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (patient.alivestatus !== 'no') {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = 'var(--error-color)';
                          }
                        }}
                        onClick={() => handleDelete(patient)}
                        title={patient.alivestatus === "no" ? "Patient removed" : "Mark as removed"}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
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
            <AddPatient
              onSuccess={handleAddSuccess}
              onCancel={() => setShowModal(false)}
              patientToEdit={patientToEdit}
              mode={modalMode}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientPage;
