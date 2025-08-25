// src/Components/TodaysVisit.js
import React, { useState, useEffect, useCallback, useMemo } from "react";
import "./Styles/TodayVisit.css";

/* ───────────────── VisitModal (inline) ───────────────── */
const VisitModal = ({
  visit,
  procedures,
  consumables,
  onClose,
  onSubmit,
}) => {
  const [selectedProcedures, setSelectedProcedures] = useState([]);
  const [status, setStatus] = useState("COMPLETED");
  const [consAdj, setConsAdj] = useState({}); // {id: delta}

  const toggleProc = (id, checked) =>
    setSelectedProcedures((prev) =>
      checked ? [...prev, id] : prev.filter((p) => p !== id)
    );

  const handleSend = () => {
    if (selectedProcedures.length === 0) {
      alert("Select at least one procedure");
      return;
    }
    const adjustments = Object.entries(consAdj)
      .filter(([, d]) => d !== 0)
      .map(([id, delta]) => ({ consumableId: Number(id), delta }));
    onSubmit(visit.id, selectedProcedures, status, adjustments);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Submit Visit</h3>

        <label>Status:</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>

        <div className="procedure-list">
          <strong>Procedures:</strong>
          {procedures.map((p) => (
            <div key={p.procedureId} className="checkbox-row">
              <input
                type="checkbox"
                checked={selectedProcedures.includes(p.procedureId)}
                onChange={(e) => toggleProc(p.procedureId, e.target.checked)}
              />
              <label>{p.procedureName}</label>
            </div>
          ))}
        </div>

        <div className="consumable-list">
          <strong>Consumables (– for given, + for returned)</strong>
          {consumables.map((c) => (
            <div key={c.id} className="consumable-row">
              <label>{c.name} (stock {c.quantity})</label>
              <input
                type="number"
                value={consAdj[c.id] ?? 0}
                onChange={(e) =>
                  setConsAdj({ ...consAdj, [c.id]: Number(e.target.value) })
                }
              />
            </div>
          ))}
        </div>

        <div className="modal-actions">
          <button onClick={handleSend}>Submit</button>
          <button className="secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

/* ───────────────── TodaysVisit main component ───────────────── */
const TodaysVisit = () => {
  const [visits, setVisits]           = useState([]);
  const [procedures, setProcedures]   = useState([]);
  const [consumables, setConsumables] = useState([]);
  const [loading, setLoading]         = useState(false);
  const [err, setErr]                 = useState("");
  const [modalVisit, setModalVisit]   = useState(null);

  const api = process.env.REACT_APP_API_URL;
  const jwt = localStorage.getItem("jwtToken");

  /* memoised headers so ESLint is happy */
  const headers = useMemo(() => ({
    Authorization: `Bearer ${jwt}`,
  }), [jwt]);

  /* memoised fetchAll */
  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      const [v, p, c] = await Promise.all([
        fetch(`${api}volunteer/assigned-visits`, { headers }).then(r => r.json()),
        fetch(`${api}volunteer/procedures`,      { headers }).then(r => r.json()),
        fetch(`${api}admin/consumables`,         { headers }).then(r => r.json()),
      ]);
      setVisits(v);
      setProcedures(p);
      setConsumables(c);
      setErr("");
    } catch {
      setErr("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [api, headers]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const submitVisit = async (id, procedureIds, status, adjustments) => {
    try {
      await fetch(`${api}volunteer/submit-report`, {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({
          visitId: id,
          procedureIds,
          status,
          consumableAdjustments: adjustments,
        }),
      });
      alert("Visit saved");
      setModalVisit(null);
      fetchAll();
    } catch {
      alert("Submit failed");
    }
  };

  return (
    <div className="todays-visit-container">
      <h2>Today's Visits</h2>

      {err && <p className="error">{err}</p>}

      {loading ? (
        <p>Loading…</p>
      ) : visits.length === 0 ? (
        <p>No assigned visits today.</p>
      ) : (
        <ul className="visit-list">
          {visits.map((v) => (
            <li key={v.id} className="visit-card">
              <p><strong>ID:</strong> {v.id}</p>
              <p><strong>Patient:</strong> {v.patientName}</p>
              <p><strong>Date:</strong> {v.visitDate}</p>
              <p><strong>Status:</strong> {v.status}</p>
              {v.status !== "COMPLETED" && (
                <button onClick={() => setModalVisit(v)}>Submit</button>
              )}
            </li>
          ))}
        </ul>
      )}

      {modalVisit && (
        <VisitModal
          visit={modalVisit}
          procedures={procedures}
          consumables={consumables}
          onClose={() => setModalVisit(null)}
          onSubmit={submitVisit}
        />
      )}
    </div>
  );
};

export default TodaysVisit;
