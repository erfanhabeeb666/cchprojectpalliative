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
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error(err);
      const status = err && err.response ? err.response.status : undefined;
      const data = err && err.response ? err.response.data : undefined;
      const serverMessage =
        (typeof data === 'string' ? data : (data && (data.message || data.error || data.detail))) ||
        (err && err.message) ||
        'Failed to add volunteer';

      setError(serverMessage);
      setSuccessMessage('');

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

      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            value={volunteer.name}
            onChange={handleChange}
            placeholder="Full Name"
            required
            className="input-field"
          />
          {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={volunteer.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="input-field"
          />
          {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={volunteer.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="input-field"
          />
          {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input
            type="tel"
            name="phoneNumber"
            value={volunteer.phoneNumber}
            onChange={handleChange}
            placeholder="Phone Number"
            required
            inputMode="numeric"
            maxLength={10}
            className="input-field"
          />
          {errors.phoneNumber && <p className="text-red-600 text-xs mt-1">{errors.phoneNumber}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <textarea
            name="address"
            value={volunteer.address}
            onChange={handleChange}
            placeholder="Address"
            required
            className="input-field"
            rows="2"
          />
          {errors.address && <p className="text-red-600 text-xs mt-1">{errors.address}</p>}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
          <input
            type="text"
            name="specialization"
            value={volunteer.specialization}
            onChange={handleChange}
            placeholder="Specialization (Optional)"
            className="input-field"
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full mt-8"
          style={{ marginTop: '1rem' }}
        >
          Register Volunteer
        </button>
      </form>
    </div>
  );
};

export default AddVolunteer;
