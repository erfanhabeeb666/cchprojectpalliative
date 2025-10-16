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
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name } = e.target;
    let { value } = e.target;
    if (name === 'phoneNumber') {
      value = value.replace(/\D/g, '');
    }
    setVolunteer({ ...volunteer, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: undefined });
  };

  const validate = () => {
    const errs = {};
    if (!volunteer.name.trim()) errs.name = 'Name is required';
    if (!volunteer.email.trim()) errs.email = 'Email is required';
    else if (!/^\S+@\S+\.[\w-]+$/.test(volunteer.email.trim())) errs.email = 'Enter a valid email';
    if (!volunteer.password) errs.password = 'Password is required';
    else if (volunteer.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (!volunteer.phoneNumber.trim()) errs.phoneNumber = 'Phone number is required';
    else if (!/^\d{10}$/.test(volunteer.phoneNumber.trim())) errs.phoneNumber = 'Enter a valid 10-digit phone number';
    if (!volunteer.address.trim()) errs.address = 'Address is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const token = localStorage.getItem("jwtToken");
      const apiUrl = process.env.REACT_APP_API_URL;

      const payload = {
        name: volunteer.name.trim(),
        email: volunteer.email.trim().toLowerCase(),
        password: volunteer.password,
        userType: volunteer.userType,
        phoneNumber: volunteer.phoneNumber.trim(),
        address: volunteer.address.trim(),
        specialization: volunteer.specialization.trim(),
      };

      await axios.post(
        `${apiUrl}admin/add-volunteer`,
        payload,
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
      setErrors({});

      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      const status = err && err.response ? err.response.status : undefined;
      const data = err && err.response ? err.response.data : undefined;
      const serverMessage =
        (typeof data === 'string' ? data : (data && (data.message || data.error || data.detail))) ||
        (err && err.message) ||
        'Failed to add volunteer';

      // Global error
      setError(serverMessage);
      setSuccessMessage('');

      // Field-level hints for duplicates (409 or message hints)
      const duplicateHints = ['duplicate', 'already exists', 'already registered', 'exists'];
      const msgLower = typeof serverMessage === 'string' ? serverMessage.toLowerCase() : '';
      const isDuplicate = status === 409 || duplicateHints.some((h) => msgLower.includes(h));

      if (isDuplicate) {
        const fieldUpdates = { ...errors };
        if (msgLower.includes('phone') || msgLower.includes('mobile')) {
          fieldUpdates.phoneNumber = serverMessage;
        }
        if (msgLower.includes('email')) {
          fieldUpdates.email = serverMessage;
        }
        setErrors(fieldUpdates);
      }
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Add Volunteer</h2>

      {successMessage && <p className="text-green-600">{successMessage}</p>}
      {error && <p className="text-red-600">{error}</p>}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <input
          type="text"
          name="name"
          value={volunteer.name}
          onChange={handleChange}
          placeholder="Full Name"
          required
          className="w-full p-2 border rounded"
        />
        {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
        <input
          type="email"
          name="email"
          value={volunteer.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="w-full p-2 border rounded"
        />
        {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
        <input
          type="password"
          name="password"
          value={volunteer.password}
          onChange={handleChange}
          placeholder="Password"
          required
          className="w-full p-2 border rounded"
        />
        {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}
         
        <input
          type="tel"
          name="phoneNumber"
          value={volunteer.phoneNumber}
          onChange={handleChange}
          placeholder="Phone Number"
          required
          inputMode="numeric"
          maxLength={10}
          onInvalid={(e) => e.target.setCustomValidity('')}
          onInput={(e) => e.currentTarget.setCustomValidity('')}
          className="w-full p-2 border rounded"
        />
        {errors.phoneNumber && <p className="text-red-600 text-sm">{errors.phoneNumber}</p>}
        <textarea
          name="address"
          value={volunteer.address}
          onChange={handleChange}
          placeholder="Address"
          required
          className="w-full p-2 border rounded"
        />
        {errors.address && <p className="text-red-600 text-sm">{errors.address}</p>}
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
