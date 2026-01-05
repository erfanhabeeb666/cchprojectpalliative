import React, { useState } from "react";
import axios from "axios";

const AddProcedure = ({ onSuccess }) => {
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
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setError("Failed to add procedure");
      setSuccessMessage("");
    }
  };

  return (
    <div className="space-y-4">
      {successMessage && (
        <div className="p-3 mb-4 text-green-700 bg-green-100 rounded border border-green-200">
          <i className="fas fa-check-circle mr-2"></i> {successMessage}
        </div>
      )}
      {error && (
        <div className="p-3 mb-4 text-red-700 bg-red-100 rounded border border-red-200">
          <i className="fas fa-exclamation-circle mr-2"></i> {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Procedure Name</label>
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
        <button
          type="submit"
          className="btn btn-primary w-full"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddProcedure;
