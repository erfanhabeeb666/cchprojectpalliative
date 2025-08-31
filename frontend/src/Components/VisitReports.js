import React, { useState, useEffect } from "react";

const VisitReports = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [reports, setReports] = useState([]);

  // Fetch all patients
  useEffect(() => {
    fetch("http://localhost:8080/api/patients")
      .then((res) => res.json())
      .then((data) => setPatients(data))
      .catch((err) => console.error("Error fetching patients:", err));
  }, []);

  // Filter patients
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredPatients([]);
    } else {
      setFilteredPatients(
        patients.filter((p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, patients]);

  // Fetch reports for selected patient
  const fetchReports = (patientId) => {
    fetch(`http://localhost:8080/api/visits/${patientId}`)
      .then((res) => res.json())
      .then((data) => setReports(data))
      .catch((err) => console.error("Error fetching reports:", err));
  };

  return (
    <main className="main-content">
      {/* Topbar */}
      <header className="topbar">
        <h1>Visit Reports</h1>
        <button className="logout-btn">Logout</button>
      </header>

      {/* Search box */}
      <div className="search-box">
        <label htmlFor="patientSearch">Search Patient: </label>
        <input
          type="text"
          id="patientSearch"
          placeholder="Type patient name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {filteredPatients.length > 0 && (
          <ul className="search-results">
            {filteredPatients.map((p) => (
              <li
                key={p.id}
                onClick={() => {
                  setSelectedPatient(p);
                  setSearchTerm(p.name);
                  setFilteredPatients([]);
                  fetchReports(p.id);
                }}
              >
                {p.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Reports table */}
      <div className="table-container">
        <table className="main-table">
          <thead>
            <tr>
              <th>Volunteer ID</th>
              <th>Submitted Date</th>
              <th>Volunteer Name</th>
              <th>Procedures Done</th>
              <th>Equipment Used</th>
              <th>Consumables Used</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {reports.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-data">
                  {selectedPatient
                    ? "No reports available for this patient."
                    : "Search and select a patient to see reports."}
                </td>
              </tr>
            ) : (
              reports.map((report, index) => (
                <tr key={index}>
                  <td>{report.volunteerId}</td>
                  <td>{report.submittedDate}</td>
                  <td>{report.volunteerName}</td>
                  <td>{report.proceduresDone.join(", ")}</td>
                  <td>{report.equipmentUsed.join(", ")}</td>
                  <td>{report.consumablesUsed.join(", ")}</td>
                  <td>{report.notes || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default VisitReports;
