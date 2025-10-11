import React, { useState } from 'react';
import axios from 'axios';

const AddPatient = ({ onSuccess }) => {
    const [patient, setPatient] = useState({
        name: '',
        mobileNumber: '',
        age: '',
        gender: '',
        address: '',
        medicalCondition: '',
        emergencyContact: ''
    });

    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name } = e.target;
        let { value } = e.target;
        if (name === 'mobileNumber' || name === 'emergencyContact') {
            value = value.replace(/\D/g, '');
        }
        setPatient({ ...patient, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: undefined });
        }
    };

    const validate = () => {
        const errs = {};
        if (!patient.name.trim()) errs.name = 'Name is required';
        if (!patient.mobileNumber.trim()) errs.mobileNumber = 'Mobile number is required';
        else if (!/^\d{10}$/.test(patient.mobileNumber.trim())) errs.mobileNumber = 'Enter a valid 10-digit mobile number';
        if (!patient.age && patient.age !== 0) errs.age = 'Age is required';
        else {
            const ageNum = Number(patient.age);
            if (!Number.isInteger(ageNum) || ageNum <= 0 || ageNum > 120) errs.age = 'Enter a valid age (1-120)';
        }
        if (!patient.gender) errs.gender = 'Gender is required';
        if (!patient.address.trim()) errs.address = 'Address is required';
        if (!patient.medicalCondition.trim()) errs.medicalCondition = 'Medical condition is required';
        if (patient.emergencyContact && !/^\d{7,15}$/.test(patient.emergencyContact.trim())) errs.emergencyContact = 'Enter a valid emergency contact';
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
                name: patient.name.trim(),
                mobileNumber: patient.mobileNumber.trim(),
                age: Number(patient.age),
                gender: patient.gender,
                address: patient.address.trim(),
                medicalCondition: patient.medicalCondition.trim(),
                emergencyContact: patient.emergencyContact ? patient.emergencyContact.trim() : ''
            };

            await axios.post(
                `${apiUrl}admin/add-patient`,
                payload,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setSuccessMessage("Patient added successfully!");
            setError('');
            setPatient({
                name: '',
                mobileNumber: '',
                age: '',
                gender: '',
                address: '',
                medicalCondition: '',
                emergencyContact: ''
            });
            setErrors({});
            if (onSuccess) onSuccess();
        } catch (err) {
            console.error(err);
            setError("Failed to add patient");
            setSuccessMessage('');
        }
    };

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Add Patient</h2>

            {successMessage && <p className="text-green-600">{successMessage}</p>}
            {error && <p className="text-red-600">{error}</p>}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <input
                    type="text"
                    name="name"
                    value={patient.name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    required
                    className="w-full p-2 border rounded"
                />
                {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
                <input
                    type="tel"
                    name="mobileNumber"
                    value={patient.mobileNumber}
                    onChange={handleChange}
                    placeholder="Mobile Number"
                    required
                    inputMode="numeric"
                    maxLength={10}
                    onInvalid={(e) => e.target.setCustomValidity('')}
                    onInput={(e) => e.currentTarget.setCustomValidity('')}
                    className="w-full p-2 border rounded"
                />
                {errors.mobileNumber && <p className="text-red-600 text-sm">{errors.mobileNumber}</p>}
                <input
                    type="number"
                    name="age"
                    value={patient.age}
                    onChange={handleChange}
                    placeholder="Age"
                    required
                    min={1}
                    max={120}
                    className="w-full p-2 border rounded"
                />
                {errors.age && <p className="text-red-600 text-sm">{errors.age}</p>}
                <select
                    name="gender"
                    value={patient.gender}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded"
                >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>
                {errors.gender && <p className="text-red-600 text-sm">{errors.gender}</p>}
                <textarea
                    name="address"
                    value={patient.address}
                    onChange={handleChange}
                    placeholder="Address"
                    required
                    className="w-full p-2 border rounded"
                />
                {errors.address && <p className="text-red-600 text-sm">{errors.address}</p>}
                <input
                    type="text"
                    name="medicalCondition"
                    value={patient.medicalCondition}
                    onChange={handleChange}
                    placeholder="Medical Condition"
                    required
                    className="w-full p-2 border rounded"
                />
                {errors.medicalCondition && <p className="text-red-600 text-sm">{errors.medicalCondition}</p>}
                <input
                    type="text"
                    name="emergencyContact"
                    value={patient.emergencyContact}
                    onChange={handleChange}
                    placeholder="Emergency Contact"
                    inputMode="numeric"
                    maxLength={15}
                    onInvalid={(e) => e.target.setCustomValidity('')}
                    onInput={(e) => e.currentTarget.setCustomValidity('')}
                    className="w-full p-2 border rounded"
                />
                {errors.emergencyContact && <p className="text-red-600 text-sm">{errors.emergencyContact}</p>}
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

export default AddPatient;
