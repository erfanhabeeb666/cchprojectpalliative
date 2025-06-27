import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Styles/Procedures.css";

const Procedures = () => {
  const [procedures, setProcedures] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newProcedureName, setNewProcedureName] = useState("");
  const [error, setError] = useState("");

  const apiUrl = process.env.REACT_APP_API_URL; // make sure it ends with /

  /* ───────────── Fetch on mount ───────────── */
  useEffect(() => {
    fetchProcedures();
    // eslint-disable-next-line
  }, []);

  const fetchProcedures = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const res = await axios.get(`${apiUrl}admin/procedures`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProcedures(res.data);
      setError("");
    } catch {
      setError("Failed to load procedures");
    }
  };

  /* ───────────── Add new procedure ───────────── */
  const handleAddProcedure = async () => {
    if (!newProcedureName.trim()) {
      setError("Name is required");
      return;
    }
    try {
      const token = localStorage.getItem("jwtToken");
      await axios.post(
        `${apiUrl}admin/procedure?name=${encodeURIComponent(
          newProcedureName.trim()
        )}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewProcedureName("");
      setShowModal(false);
      fetchProcedures(); // reload list from server
    } catch {
      setError("Failed to add procedure");
    }
  };

  return (
    <div className="procedures-container">
      <h2>Procedures</h2>

      {error && <p className="error">{error}</p>}

      <ul>
        {procedures.map((p) => (
          <li key={p.procedureId || p.procedureName}>{p.procedureName}</li>
        ))}
      </ul>

      <button className="btn-primary" onClick={() => setShowModal(true)}>
        Add Procedure
      </button>

      {/* ───── Modal ───── */}
      {showModal && (
        <div className="procedures-modal">
          <div className="procedures-modal__content">
            <h3>Add New Procedure</h3>

            <input
              type="text"
              placeholder="Procedure name"
              value={newProcedureName}
              onChange={(e) => setNewProcedureName(e.target.value)}
            />

            {error && <p className="error">{error}</p>}

            <button className="btn-primary" onClick={handleAddProcedure}>
              Save
            </button>
            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Procedures;
