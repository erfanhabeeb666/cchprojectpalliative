import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import "./Styles/Consumables.css";

const Consumables = () => {
  const [items, setItems] = useState([]);
  const [newName, setNewName] = useState("");
  const [newQty, setNewQty] = useState(0);
  const [error, setError] = useState("");

  const api = process.env.REACT_APP_API_URL;
  const jwt = localStorage.getItem("jwtToken");

  // Use memoized headers to avoid ESLint warnings
  const headers = useMemo(() => ({
    Authorization: `Bearer ${jwt}`,
  }), [jwt]);

  // Load consumables
  const loadConsumables = useCallback(() => {
    axios
      .get(`${api}admin/consumables`, { headers })
      .then((response) => {
        setItems(response.data);
        setError("");
      })
      .catch(() => {
        setError("Failed to load consumables.");
      });
  }, [api, headers]);

  useEffect(() => {
    loadConsumables();
  }, [loadConsumables]);

  // Add new consumable
  const handleAdd = () => {
    if (!newName.trim()) {
      alert("Name is required");
      return;
    }

    axios
      .post(`${api}admin/consumable?name=${newName}&quantity=${newQty}`, {}, { headers })
      .then(() => {
        setNewName("");
        setNewQty(0);
        loadConsumables(); // Refresh list
      })
      .catch(() => {
        setError("Failed to add consumable.");
      });
  };

  return (
    <div className="consumables-container">
      <h2>Manage Consumables</h2>

      {error && <p className="error">{error}</p>}

      <div className="form-group">
        <input
          type="text"
          placeholder="Consumable name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Quantity"
          value={newQty}
          onChange={(e) => setNewQty(Number(e.target.value))}
        />
        <button onClick={handleAdd}>Add Consumable</button>
      </div>

      <ul className="consumable-list">
        {items.map((c) => (
          <li key={c.id}>
            {c.name} — <strong>{c.quantity}</strong> available
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Consumables;
