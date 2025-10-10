import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getDisplayName } from "../utils/auth";
import "./Styles/Admin.css";
import "./Styles/Main.css";
import "./Styles/Sidebar.css";

// Modal Component


const ProcedureModal = ({ visit, procedures, consumables, onClose, onSubmit }) => {
  const [selectedProcedure, setSelectedProcedure] = useState([]);
  const [selectedConsumables, setSelectedConsumables] = useState([]);
  const [status, setStatus] = useState("COMPLETED");

  // Helper: get quantity from state for each consumable
  const getConsumableQty = (id) => {
    const item = selectedConsumables.find((c) => c.consumableId === id);
    return item ? item.quantity : "";
  };

  // Handle consumable selection + quantity
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
    if (!selectedProcedure.length) {
      alert("Please select at least one procedure");
      return;
    }

    try {
      // clean zero/empty quantities
      const consumablesToSend = selectedConsumables.filter(
        (c) => c.quantity > 0
      );

      await onSubmit(visit.id, selectedProcedure, consumablesToSend, status);
      onClose();
    } catch (err) {
      alert("Failed to submit visit");
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Submit Visit Report</h3>

        {/* Status */}
        <label>Status:</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>

        {/* Procedures */}
        <div>
          <label>Procedures:</label>
          <select
            multiple
            value={selectedProcedure}
            onChange={(e) =>
              setSelectedProcedure(
                Array.from(e.target.selectedOptions, (option) => option.value)
              )
            }
            className="custom-select"
          >
            {procedures.map((procedure) => (
              <option key={procedure.procedureId} value={procedure.procedureId}>
                {procedure.procedureName}
              </option>
            ))}
          </select>
        </div>

        {/* Consumables */}
        <div>
          <label>Consumables:</label>
          {consumables.map((consumable) => (
            <div key={consumable.id} className="flex items-center space-x-2 my-1">
              <span>
                {consumable.name} (Stock: {consumable.stockQuantity})
              </span>
              <input
                type="number"
                min="0"
                value={getConsumableQty(consumable.id)} // ✅ bind value
                placeholder="Qty"
                onChange={(e) =>
                  handleConsumableChange(
                    consumable.id,
                    parseInt(e.target.value, 10) || 0
                  )
                }
                className="w-20 p-1 border rounded"
              />
            </div>
          ))}
        </div>

        <div className="flex space-x-2 mt-4">
          <button onClick={handleSubmit}>Submit</button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};


const TodaysVisit = () => {
  const [assignedVisits, setAssignedVisits] = useState([]);
  const [procedures, setProcedures] = useState([]);
  const [consumables, setConsumables] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState(null);

  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate("/");
  };

  useEffect(() => {
    fetchAssignedVisits();
    fetchProcedures();
    fetchConsumables();
  }, []);

  // Fetch assigned visits
  const fetchAssignedVisits = async () => {
    setLoading(true);
    setError("");
    const jwtToken = localStorage.getItem("jwtToken");
    if (!jwtToken) {
      setError("No JWT token found");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${apiUrl}volunteer/assigned-visits`, {
        method: "GET",
        headers: { Authorization: `Bearer ${jwtToken}` },
      });

      if (!response.ok) throw new Error("Failed to fetch assigned visits");

      const data = await response.json();
      setAssignedVisits(data);
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Fetch procedures
  const fetchProcedures = async () => {
    const jwtToken = localStorage.getItem("jwtToken");
    if (!jwtToken) {
      setError("No JWT token found");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}volunteer/procedures`, {
        method: "GET",
        headers: { Authorization: `Bearer ${jwtToken}` },
      });

      if (!response.ok) throw new Error("Failed to fetch procedures");

      const data = await response.json();
      setProcedures(data);
    } catch (err) {
      setError(err.message || "Error fetching procedures");
    }
  };

  // Fetch consumables
  const fetchConsumables = async () => {
    const jwtToken = localStorage.getItem("jwtToken");
    if (!jwtToken) {
      setError("No JWT token found");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}volunteer/consumables`, {
        method: "GET",
        headers: { Authorization: `Bearer ${jwtToken}` },
      });

      if (!response.ok) throw new Error("Failed to fetch consumables");

      const data = await response.json();
      setConsumables(data);
    } catch (err) {
      setError(err.message || "Error fetching consumables");
    }
  };

  // Open/close modal
  const handleModalOpen = (visit) => {
    setSelectedVisit(visit);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedVisit(null);
    setIsModalOpen(false);
  };

  // Submit procedure + consumables
  const handleProcedureSubmit = async (visitId, procedureIds, consumables, status) => {
    const jwtToken = localStorage.getItem("jwtToken");
    if (!jwtToken) {
      setError("No JWT token found");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}volunteer/submit-report`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          visitId,
          procedureIds,
          consumables, // [{ consumableId, quantityUsed }]
          status,
        }),
      });

      if (!response.ok) throw new Error("Failed to submit visit");

      alert("Visit submitted successfully");
      fetchAssignedVisits();
    } catch (err) {
      setError("Failed to submit visit");
    }
  };

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
              <NavLink to="/volunteer" className="sidebar-link">
                <i className="fas fa-tachometer-alt"></i> Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/volunteer/todays-visits" className="sidebar-link">
                <i className="fas fa-calendar-day"></i> Today's Visits
              </NavLink>
            </li>
            <li>
              <NavLink to="/volunteer/completed-visits" className="sidebar-link">
                <i className="fas fa-check"></i> Completed Visits
              </NavLink>
            </li>
            <li>
              <NavLink to="/volunteer/profile" className="sidebar-link">
                <i className="fas fa-user"></i> Profile
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="topbar">
          <h1>Today's Visits</h1>
          <div className="topbar-actions">
            <span className="greeting">Hello, {getDisplayName()}</span>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </header>

        <section className="content-section">
          {error && <p style={{ color: "red" }}>{error}</p>}
          {loading ? (
            <p>Loading...</p>
          ) : assignedVisits.length === 0 ? (
            <p>No assigned visits today.</p>
          ) : (
            <div>
              <table className="main-table">
                <thead>
                  <tr>
                    <th>Visit ID</th>
                    <th>Patient Name</th>
                    <th>Volunteer Name</th>
                    <th>Visit Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {assignedVisits.map((visit) => (
                    <tr key={visit.id}>
                      <td>{visit.id}</td>
                      <td>{visit.patientName}</td>
                      <td>{visit.volunteerName}</td>
                      <td>
                        {visit.visitDate
                          ? new Date(visit.visitDate).toLocaleDateString()
                          : "-"}
                      </td>
                      <td>{visit.status}</td>
                      <td>
                        {visit.status !== "COMPLETED" && (
                          <button onClick={() => handleModalOpen(visit)}>
                            Submit
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {/* Modal */}
      {isModalOpen && selectedVisit && (
        <ProcedureModal
          visit={selectedVisit}
          procedures={procedures}
          consumables={consumables}
          onClose={handleModalClose}
          onSubmit={handleProcedureSubmit}
        />
      )}
    </div>
  );
};

export default TodaysVisit;
