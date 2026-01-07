import React, { useState } from "react";
import axios from "axios";

const AddProcedure = ({ onSuccess, onCancel }) => {
  const [procedure, setProcedure] = useState({
    procedureName: ""
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setProcedure({ ...procedure, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("jwtToken");
      const apiUrl = process.env.REACT_APP_API_URL;

      await axios.post(
        `${apiUrl}admin/procedure?name=${procedure.procedureName}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccessMessage("Procedure added successfully!");
      setError("");
      setProcedure({ procedureName: "" });

      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      setError("Failed to add procedure");
      setSuccessMessage("");
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4">Add Procedure</h2>

      {successMessage && <p className="text-green-600 font-medium">{successMessage}</p>}
      {error && <p className="text-red-600 font-medium">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Procedure Name</label>
          <input
            type="text"
            name="procedureName"
            value={procedure.procedureName}
            onChange={handleChange}
            placeholder="e.g. Blood Pressure Check"
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
            Add Procedure
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

export default AddProcedure;
