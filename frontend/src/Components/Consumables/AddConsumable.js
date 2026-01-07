import React, { useState } from "react";
import axios from "axios";

const AddConsumable = ({ onSuccess, onCancel }) => {
  const [consumable, setConsumable] = useState({
    name: "",
    stockQuantity: "",  // allow empty string for typing
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setConsumable((prev) => ({
      ...prev,
      [name]:
        name === "stockQuantity"
          ? value === "" ? "" : Number(value) // ✅ convert only if not empty
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("jwtToken");
      const apiUrl = process.env.REACT_APP_API_URL;

      await axios.post(`${apiUrl}admin/consumable/add`, consumable, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccessMessage("Consumable added successfully!");
      setError("");
      setConsumable({ name: "", stockQuantity: "" });
      onSuccess();
    } catch (err) {
      console.error(err);
      setError("Failed to add consumable");
      setSuccessMessage("");
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4">Add Consumable</h2>

      {successMessage && <p className="text-green-600 font-medium">{successMessage}</p>}
      {error && <p className="text-red-600 font-medium">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Consumable Name</label>
          <input
            type="text"
            name="name"
            value={consumable.name}
            onChange={handleChange}
            placeholder="e.g. Cotton Swabs"
            required
            className="input-field"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Quantity</label>
          <input
            type="number"
            name="stockQuantity"
            value={consumable.stockQuantity}
            onChange={handleChange}
            placeholder="0"
            required
            className="input-field"
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', width: '100%' }}>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ flex: 1, height: '38px', fontSize: '0.8125rem', whiteSpace: 'nowrap' }}
          >
            Add Consumable
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-outline"
            style={{ flex: 1, height: '38px', fontSize: '0.8125rem', whiteSpace: 'nowrap' }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddConsumable;
