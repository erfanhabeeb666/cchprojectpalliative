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
        <div className="space-y-6">
            {successMessage && (
                <div className="p-4 mb-6 text-teal-700 bg-teal-50 rounded-lg border border-teal-100 flex items-center shadow-sm">
                    <i className="fas fa-check-circle mr-3 text-lg"></i>
                    <span className="font-semibold">{successMessage}</span>
                </div>
            )}
            {error && (
                <div className="p-4 mb-6 text-red-700 bg-red-50 rounded-lg border border-red-100 flex items-center shadow-sm">
                    <i className="fas fa-exclamation-circle mr-3 text-lg"></i>
                    <span className="font-semibold">{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
                <div className="mb-5">
                    <label className="block text-sm font-semibold text-secondary mb-1.5">Full Name</label>
                    <input
                        type="text"
                        name="name"
                        value={patient.name}
                        onChange={handleChange}
                        placeholder="e.g. John Doe"
                        required
                        className="input-field"
                        style={{ height: '44px' }}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.name}</p>}
                </div>

                <div className="flex gap-4 mb-5">
                    <div className="flex-1">
                        <label className="block text-sm font-semibold text-secondary mb-1.5">Mobile Number</label>
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
                            style={{ height: '44px' }}
                        />
                        {errors.mobileNumber && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.mobileNumber}</p>}
                    </div>
                    <div className="w-1/3">
                        <label className="block text-sm font-semibold text-secondary mb-1.5">Age</label>
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
                            style={{ height: '44px' }}
                        />
                        {errors.age && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.age}</p>}
                    </div>
                </div>

                <div className="mb-5">
                    <label className="block text-sm font-semibold text-secondary mb-1.5">Gender</label>
                    <select
                        name="gender"
                        value={patient.gender}
                        onChange={handleChange}
                        required
                        className="input-field"
                        style={{ height: '44px' }}
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                    {errors.gender && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.gender}</p>}
                </div>

                <div className="mb-5">
                    <label className="block text-sm font-semibold text-secondary mb-1.5">Address</label>
                    <textarea
                        name="address"
                        value={patient.address}
                        onChange={handleChange}
                        placeholder="Full address"
                        required
                        className="input-field"
                        rows="3"
                    />
                    {errors.address && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.address}</p>}
                </div>

                <div className="mb-5">
                    <label className="block text-sm font-semibold text-secondary mb-1.5">Patient Location (optional)</label>
                    <div className="flex items-center gap-3">
                        {selectedLocation ? (
                            <span className="text-sm font-semibold text-secondary bg-slate-100 px-3 py-1.5 rounded-full flex items-center shadow-sm">
                                <i className="fas fa-map-marker-alt text-red-500 mr-2"></i>
                                {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                            </span>
                        ) : (
                            <span className="text-sm text-muted italic">No location selected</span>
                        )}
                        <button
                            type="button"
                            className="btn btn-outline"
                            style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', height: '36px' }}
                            onClick={() => {
                                if (typeof navigator !== 'undefined' && !navigator.onLine) {
                                    alert('You are offline — location selection is optional.');
                                    return;
                                }
                                setModalLocation(selectedLocation);
                                setShowLocationModal(true);
                            }}
                        >
                            <i className={selectedLocation ? 'fas fa-edit' : 'fas fa-map'}></i>
                            {selectedLocation ? 'Change' : 'Select on Map'}
                        </button>
                    </div>
                </div>

                <div className="mb-5">
                    <label className="block text-sm font-semibold text-secondary mb-1.5">Medical Condition</label>
                    <input
                        type="text"
                        name="medicalCondition"
                        value={patient.medicalCondition}
                        onChange={handleChange}
                        placeholder="e.g. Diabetic, Hypertensive"
                        required
                        className="input-field"
                        style={{ height: '44px' }}
                    />
                    {errors.medicalCondition && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.medicalCondition}</p>}
                </div>

                <div className="mb-8">
                    <label className="block text-sm font-semibold text-secondary mb-1.5">Emergency Contact (Optional)</label>
                    <input
                        type="text"
                        name="emergencyContact"
                        value={patient.emergencyContact}
                        onChange={handleChange}
                        placeholder="Contact number"
                        inputMode="numeric"
                        maxLength={15}
                        className="input-field"
                        style={{ height: '44px' }}
                    />
                    {errors.emergencyContact && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.emergencyContact}</p>}
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
                    className="btn btn-primary w-full mt-8"
                    style={{ marginTop: '0.5rem', height: '48px', fontSize: '1rem' }}
                >
                    <i className="fas fa-user-plus mr-2"></i>
                    Register Patient
                </button>
            </form>
        </div>
    );
};

export default AddPatient;
