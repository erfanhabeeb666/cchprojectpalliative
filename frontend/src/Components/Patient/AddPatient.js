import React, { useState } from 'react';
import axios from 'axios';
import PatientLocationPicker from './PatientLocationPicker';

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
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [modalLocation, setModalLocation] = useState(null);

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
        if (!patient.emergencyContact.trim()) errs.emergencyContact = 'Mobile number is required';
        else if (!/^\d{7,11}$/.test(patient.emergencyContact.trim())) errs.emergencyContact = 'Enter a valid mobile number';
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
                emergencyContact: patient.emergencyContact ? patient.emergencyContact.trim() : '',
                latitude: selectedLocation ? selectedLocation.lat : undefined,
                longitude: selectedLocation ? selectedLocation.lng : undefined,
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
            setSelectedLocation(null);
        } catch (err) {
            console.error(err);
            const status = err && err.response ? err.response.status : undefined;
            const data = err && err.response ? err.response.data : undefined;
            const serverMessage =
                (typeof data === 'string' ? data : (data && (data.message || data.error || data.detail))) ||
                (err && err.message) ||
                "Failed to add patient";

            // Show a clear global error
            setError(serverMessage);
            setSuccessMessage('');

            // If duplicate mobile is indicated (often 409 Conflict or explicit message), mark the field
            const duplicateHints = [
                'duplicate',
                'already exists',
                'already registered',
                'exists',
            ];
            const isDuplicatePhone =
                status === 409 ||
                (typeof serverMessage === 'string' &&
                    duplicateHints.some((h) => serverMessage.toLowerCase().includes(h)));

            if (isDuplicatePhone) {
                setErrors({ ...errors, mobileNumber: serverMessage });
            }
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
                <div>
                    <label className="block font-medium mb-1">Patient Location (optional)</label>
                    {selectedLocation ? (
                        <p className="text-sm text-gray-700 mb-2">Selected: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}</p>
                    ) : (
                        <p className="text-sm text-gray-500 mb-2">No location selected</p>
                    )}
                    <button
                        type="button"
                        className="bg-gray-700 text-white px-3 py-2 rounded hover:bg-gray-800"
                        onClick={() => {
                            if (typeof navigator !== 'undefined' && !navigator.onLine) {
                                alert('You are offline — location selection is optional.');
                                return;
                            }
                            setModalLocation(selectedLocation);
                            setShowLocationModal(true);
                        }}
                    >
                        {selectedLocation ? 'Change Location' : 'Select Location'}
                    </button>
                </div>
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
                    type="tel"
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
                {showLocationModal && (
                    <div className="modal-overlay">
                        <div className="form-container" style={{ maxWidth: 800 }}>
                            <h3 className="text-xl font-semibold mb-2">Select Patient Location</h3>
                            <PatientLocationPicker
                                value={modalLocation}
                                onChange={setModalLocation}
                            />
                            <div className="mt-3 flex gap-2">
                                <button
                                    type="button"
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                    onClick={() => {
                                        setSelectedLocation(modalLocation || null);
                                        setShowLocationModal(false);
                                    }}
                                >
                                    Use This Location
                                </button>
                                <button
                                    type="button"
                                    className="btn-cancel"
                                    onClick={() => setShowLocationModal(false)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
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
