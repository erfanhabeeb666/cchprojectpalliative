import React, { useState } from "react";
import axios from "axios";

const AddConsumable = ({ onSuccess }) => {
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
      <h2 className="text-2xl font-semibold">Add Consumable</h2>

      {successMessage && <p className="text-green-600">{successMessage}</p>}
      {error && <p className="text-red-600">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={consumable.name}
          onChange={handleChange}
          placeholder="Consumable Name"
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          name="stockQuantity"
          value={consumable.stockQuantity}
          onChange={handleChange}
          placeholder="Quantity"
          required
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddConsumable;
