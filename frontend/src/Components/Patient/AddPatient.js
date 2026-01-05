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
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            console.error(err);
            const status = err && err.response ? err.response.status : undefined;
            const data = err && err.response ? err.response.data : undefined;
            const serverMessage =
                (typeof data === 'string' ? data : (data && (data.message || data.error || data.detail))) ||
                (err && err.message) ||
                "Failed to add patient";

            setError(serverMessage);
            setSuccessMessage('');

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
                        value={patient.name}
                        onChange={handleChange}
                        placeholder="e.g. John Doe"
                        required
                        className="input-field"
                    />
                    {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
                </div>

                <div className="flex gap-4 mb-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                        <input
                            type="tel"
                            name="mobileNumber"
                            value={patient.mobileNumber}
                            onChange={handleChange}
                            placeholder="10-digit number"
                            required
                            inputMode="numeric"
                            maxLength={10}
                            className="input-field"
                        />
                        {errors.mobileNumber && <p className="text-red-600 text-xs mt-1">{errors.mobileNumber}</p>}
                    </div>
                    <div className="w-1/3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                        <input
                            type="number"
                            name="age"
                            value={patient.age}
                            onChange={handleChange}
                            placeholder="Age"
                            required
                            min={1}
                            max={120}
                            className="input-field"
                        />
                        {errors.age && <p className="text-red-600 text-xs mt-1">{errors.age}</p>}
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select
                        name="gender"
                        value={patient.gender}
                        onChange={handleChange}
                        required
                        className="input-field"
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                    {errors.gender && <p className="text-red-600 text-xs mt-1">{errors.gender}</p>}
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <textarea
                        name="address"
                        value={patient.address}
                        onChange={handleChange}
                        placeholder="Full address"
                        required
                        className="input-field"
                        rows="2"
                    />
                    {errors.address && <p className="text-red-600 text-xs mt-1">{errors.address}</p>}
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Patient Location (optional)</label>
                    <div className="flex items-center gap-2">
                        {selectedLocation ? (
                            <span className="text-sm text-gray-700 bg-gray-100 px-2 py-1 rounded">
                                <i className="fas fa-map-marker-alt text-red-500 mr-1"></i>
                                {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                            </span>
                        ) : (
                            <span className="text-sm text-gray-400 italic">No location selected</span>
                        )}
                        <button
                            type="button"
                            className="btn btn-outline"
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                            onClick={() => {
                                if (typeof navigator !== 'undefined' && !navigator.onLine) {
                                    alert('You are offline — location selection is optional.');
                                    return;
                                }
                                setModalLocation(selectedLocation);
                                setShowLocationModal(true);
                            }}
                        >
                            {selectedLocation ? 'Change' : 'Select on Map'}
                        </button>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Medical Condition</label>
                    <input
                        type="text"
                        name="medicalCondition"
                        value={patient.medicalCondition}
                        onChange={handleChange}
                        placeholder="e.g. Diabetic, Hypertensive"
                        required
                        className="input-field"
                    />
                    {errors.medicalCondition && <p className="text-red-600 text-xs mt-1">{errors.medicalCondition}</p>}
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact (Optional)</label>
                    <input
                        type="text"
                        name="emergencyContact"
                        value={patient.emergencyContact}
                        onChange={handleChange}
                        placeholder="Contact number"
                        inputMode="numeric"
                        maxLength={15}
                        className="input-field"
                    />
                    {errors.emergencyContact && <p className="text-red-600 text-xs mt-1">{errors.emergencyContact}</p>}
                </div>

                {showLocationModal && (
                    <div className="modal-overlay" style={{ zIndex: 1100 }}>
                        <div className="form-container" style={{ maxWidth: 800, width: '95%' }}>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold">Select Patient Location</h3>
                                <button onClick={() => setShowLocationModal(false)} className="text-gray-500 hover:text-gray-700">
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                            <PatientLocationPicker
                                value={modalLocation}
                                onChange={setModalLocation}
                            />
                            <div className="mt-4 flex justify-end gap-2">
                                <button
                                    type="button"
                                    className="btn btn-outline"
                                    onClick={() => setShowLocationModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => {
                                        setSelectedLocation(modalLocation || null);
                                        setShowLocationModal(false);
                                    }}
                                >
                                    Confirm Location
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <button
                    type="submit"
                    className="btn btn-primary w-full"
                >
                    Register Patient
                </button>
            </form>
        </div>
    );
};

export default AddPatient;
