import React, { useState } from 'react';
import axios from 'axios';

const AddVolunteer = ({ onSuccess }) => {
  const [volunteer, setVolunteer] = useState({
    name: '',
    email: '',
    password: '',
    userType: 'VOLUNTEER',
    phoneNumber: '',
    address: '',
    specialization: ''
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setVolunteer({ ...volunteer, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("jwtToken");
      const apiUrl = process.env.REACT_APP_API_URL;

      await axios.post(
        `${apiUrl}admin/add-volunteer`,
        volunteer,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccessMessage("Volunteer added successfully!");
      setError('');
      setVolunteer({
        name: '',
        email: '',
        password: '',
        userType: 'VOLUNTEER',
        phoneNumber: '',
        address: '',
        specialization: ''
      });

      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      setError("Failed to add volunteer");
      setSuccessMessage('');
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Add Volunteer</h2>

      {successMessage && <p className="text-green-600">{successMessage}</p>}
      {error && <p className="text-red-600">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={volunteer.name}
          onChange={handleChange}
          placeholder="Full Name"
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="email"
          name="email"
          value={volunteer.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          name="password"
          value={volunteer.password}
          onChange={handleChange}
          placeholder="Password"
          required
          className="w-full p-2 border rounded"
        />
         
        <input
          type="text"
          name="phoneNumber"
          value={volunteer.phoneNumber}
          onChange={handleChange}
          placeholder="Phone Number"
          required
          className="w-full p-2 border rounded"
        />
        <textarea
          name="address"
          value={volunteer.address}
          onChange={handleChange}
          placeholder="Address"
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="specialization"
          value={volunteer.specialization}
          onChange={handleChange}
          placeholder="Specialization"
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

export default AddVolunteer;
