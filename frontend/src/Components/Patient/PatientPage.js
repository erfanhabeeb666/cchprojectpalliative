import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AddPatient from "./AddPatient";
import axios from "axios";
import "../Styles/Admin.css";
import "../Styles/Main.css";

const PatientPage = () => {
  const navigate = useNavigate();
  const [patientList, setPatientList] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await axios.get(`${apiUrl}admin/list-patients`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatientList(response.data);
    } catch (err) {
      console.error("Failed to fetch patients", err);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleAddSuccess = () => {
    fetchPatients();
    setShowAddForm(false);
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <center>
          <h2>P A S S</h2>
        </center>
        <nav>
          <ul>
            <li>
              <button onClick={() => navigate("/admin")}>Dashboard</button>
            </li>
            <li>
              <button onClick={() => navigate("/admin/patient")}>Patients</button>
            </li>
            <li>
              <button onClick={() => navigate("/admin/volunteers")}>Volunteers</button>
            </li>
            <li>
              <button onClick={() => navigate("/admin/visits")}>Visit Reports</button>
            </li>
            <li>
              <button onClick={() => navigate("/admin/equipment")}>Equipment</button>
            </li>
            <li>
              <button onClick={() => navigate("/admin/consumables")}>Consumables</button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Topbar */}
        <header className="topbar">
          <h1>Patient Management</h1>
          <button className="logout-btn">Logout</button>
        </header>

        {/* Buttons */}
        <div className="mb-4 flex space-x-4" style={{ marginBottom: "20px" }}>
          <button onClick={() => setShowAddForm(true)}>+ Add Patient</button>
          <button onClick={fetchPatients} style={{ marginLeft: "10px" }}>
            Refresh List
          </button>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <div className="form-container">
            <AddPatient onSuccess={handleAddSuccess} />
            <button
              onClick={() => setShowAddForm(false)}
              className="btn-cancel"
            >
              Close
            </button>
          </div>
        )}

        {/* Patient Table */}
        <div>
          <table className="main-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Mobile</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Address</th>
                <th>Medical Condition</th>
                <th>Emergency Contact</th>
              </tr>
            </thead>
            <tbody>
              {patientList.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center", padding: "20px" }}>
                    No patients available
                  </td>
                </tr>
              ) : (
                patientList.map((patient) => (
                  <tr key={patient.id}>
                    <td>{patient.name}</td>
                    <td>{patient.mobileNumber}</td>
                    <td>{patient.age}</td>
                    <td>{patient.gender}</td>
                    <td>{patient.address}</td>
                    <td>{patient.medicalCondition}</td>
                    <td>{patient.emergencyContact}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default PatientPage;
