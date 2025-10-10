import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getDisplayName } from "../utils/auth";
import "./Styles/Main.css";
import "./Styles/Admin.css";
import "./Styles/Sidebar.css";

const CreateNewVisit = () => {
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;
  const [step, setStep] = useState(1);

  const [patients, setPatients] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [selectedPatients, setSelectedPatients] = useState([]);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [visitDate, setVisitDate] = useState("");

  const [searchPatient, setSearchPatient] = useState("");
  const [searchVolunteer, setSearchVolunteer] = useState("");
  const [pagePatients, setPagePatients] = useState(0);
  const [pageVolunteers, setPageVolunteers] = useState(0);
  const [totalPagesPatients, setTotalPagesPatients] = useState(1);
  const [totalPagesVolunteers, setTotalPagesVolunteers] = useState(1);

  const jwtToken = localStorage.getItem("jwtToken");

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate("/");
  };

  // Fetch patients
  const fetchPatients = async () => {
    try {
      const res = await fetch(
        `${apiUrl}admin/list-patients?page=${pagePatients}&size=5&search=${searchPatient}`,
        {
          headers: { Authorization: `Bearer ${jwtToken}` },
        }
      );
      if (!res.ok) throw new Error("Failed to load patients");
      const data = await res.json();
      setPatients(data.content);
      setTotalPagesPatients(data.totalPages);
    } catch (err) {
      console.error(err.message);
    }
  };

  // Fetch volunteers
  const fetchVolunteers = async () => {
    try {
      const res = await fetch(
        `${apiUrl}admin/list-volunteers?page=${pageVolunteers}&size=5&search=${searchVolunteer}`,
        {
          headers: { Authorization: `Bearer ${jwtToken}` },
        }
      );
      if (!res.ok) throw new Error("Failed to load volunteers");
      const data = await res.json();
      setVolunteers(data.content);
      setTotalPagesVolunteers(data.totalPages);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (step === 1) fetchPatients();
  }, [pagePatients, searchPatient, step]);

  useEffect(() => {
    if (step === 2) fetchVolunteers();
  }, [pageVolunteers, searchVolunteer, step]);

  // Select/Deselect patients
  const togglePatientSelection = (id) => {
    setSelectedPatients((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  // Assign volunteer
  const handleAssign = async () => {
    if (!selectedPatients.length || !selectedVolunteer || !visitDate) {
      alert("Please complete all steps before confirming.");
      return;
    }

    try {
      const res = await fetch(`${apiUrl}admin/assign-volunteer`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          volunteerId: selectedVolunteer,
          patientIds: selectedPatients,
          visitDate,
        }),
      });

      if (!res.ok) throw new Error("Failed to assign volunteer");

      alert("Volunteer assigned successfully!");
      setSelectedPatients([]);
      setSelectedVolunteer(null);
      setVisitDate("");
      setStep(1);
    } catch (err) {
      alert(err.message);
    }
  };

  // Progress bar steps
  const steps = ["Select Patients", "Select Volunteer", "Select Date", "Review & Confirm"];

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
          <h1>Create New Visit</h1>
          <div className="topbar-actions">
            <span className="greeting">Hello, {getDisplayName()}</span>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </header>

        {/* Progress bar */}
        <div className="progress-bar" style={{ display: "flex", margin: "20px 0" }}>
          {steps.map((label, index) => (
            <div
              key={index}
              style={{
                flex: 1,
                textAlign: "center",
                padding: "10px",
                borderBottom: index + 1 === step ? "3px solid #007bff" : "1px solid #ccc",
                fontWeight: index + 1 === step ? "bold" : "normal",
              }}
            >
              {index + 1}. {label}
            </div>
          ))}
        </div>

        {/* Step 1: Select Patients */}
        {step === 1 && (
          <section className="content-section">
            <h2>Step 1: Select Patients</h2>
            <input
              type="text"
              placeholder="Search by name or mobile..."
              value={searchPatient}
              onChange={(e) => setSearchPatient(e.target.value)}
            />
            <table className="main-table">
              <thead>
                <tr>
                  <th>Select</th>
                  <th>Name</th>
                  <th>Mobile</th>
                  <th>Age</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedPatients.includes(p.id)}
                        onChange={() => togglePatientSelection(p.id)}
                      />
                    </td>
                    <td>{p.name}</td>
                    <td>{p.mobile}</td>
                    <td>{p.age}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pagination">
              <button
                disabled={pagePatients === 0}
                onClick={() => setPagePatients((prev) => prev - 1)}
              >
                Previous
              </button>
              <span>
                Page {pagePatients + 1} of {totalPagesPatients}
              </span>
              <button
                disabled={pagePatients + 1 >= totalPagesPatients}
                onClick={() => setPagePatients((prev) => prev + 1)}
              >
                Next
              </button>
            </div>
            <button
              className="btn-primary"
              disabled={!selectedPatients.length}
              onClick={() => setStep(2)}
            >
              Next
            </button>
          </section>
        )}

        {/* Step 2: Select Volunteer */}
        {step === 2 && (
          <section className="content-section">
            <h2>Step 2: Select Volunteer</h2>
            <input
              type="text"
              placeholder="Search volunteers..."
              value={searchVolunteer}
              onChange={(e) => setSearchVolunteer(e.target.value)}
            />
            <table className="main-table">
              <thead>
                <tr>
                  <th>Select</th>
                  <th>Name</th>
                  <th>Contact</th>
                </tr>
              </thead>
              <tbody>
                {volunteers.map((v) => (
                  <tr key={v.id}>
                    <td>
                      <input
                        type="radio"
                        name="volunteer"
                        checked={selectedVolunteer === v.id}
                        onChange={() => setSelectedVolunteer(v.id)}
                      />
                    </td>
                    <td>{v.name}</td>
                    <td>{v.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pagination">
              <button
                disabled={pageVolunteers === 0}
                onClick={() => setPageVolunteers((prev) => prev - 1)}
              >
                Previous
              </button>
              <span>
                Page {pageVolunteers + 1} of {totalPagesVolunteers}
              </span>
              <button
                disabled={pageVolunteers + 1 >= totalPagesVolunteers}
                onClick={() => setPageVolunteers((prev) => prev + 1)}
              >
                Next
              </button>
            </div>
            <button className="btn-secondary" onClick={() => setStep(1)}>
              Back
            </button>
            <button
              className="btn-primary"
              disabled={!selectedVolunteer}
              onClick={() => setStep(3)}
            >
              Next
            </button>
          </section>
        )}

        {/* Step 3: Select Date */}
        {step === 3 && (
          <section className="content-section">
            <h2>Step 3: Select Date</h2>
            <input
              type="date"
              value={visitDate}
              onChange={(e) => setVisitDate(e.target.value)}
            />
            <br />
            <button className="btn-secondary" onClick={() => setStep(2)}>
              Back
            </button>
            <button
              className="btn-primary"
              disabled={!visitDate}
              onClick={() => setStep(4)}
            >
              Next
            </button>
          </section>
        )}

        {/* Step 4: Review & Confirm */}
        {step === 4 && (
          <section className="content-section">
            <h2>Step 4: Review & Confirm</h2>
            <p>
              <strong>Patients:</strong> {selectedPatients.length} selected
            </p>
            <p>
              <strong>Volunteer:</strong>{" "}
              {volunteers.find((v) => v.id === selectedVolunteer)?.name}
            </p>
            <p>
              <strong>Date:</strong> {visitDate}
            </p>
            <button className="btn-secondary" onClick={() => setStep(3)}>
              Back
            </button>
            <button className="btn-primary" onClick={handleAssign}>
              Confirm & Assign
            </button>
          </section>
        )}
      </main>
    </div>
  );
};

export default CreateNewVisit;
