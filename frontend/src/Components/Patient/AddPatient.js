import React, { useState } from 'react';
import axios from 'axios';

const AddPatient = () => {
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

    const handleChange = (e) => {
        setPatient({ ...patient, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("jwtToken");
            const apiUrl = process.env.REACT_APP_API_URL;

            await axios.post(
                `${apiUrl}admin/add-patient`,
                patient,
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

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="name"
                    value={patient.name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    required
                    className="w-full p-2 border rounded"
                />
                <input
                    type="number"
                    name="mobileNumber"
                    value={patient.mobileNumber}
                    onChange={handleChange}
                    placeholder="Mobile Number"
                    required
                    className="w-full p-2 border rounded"
                />
                <input
                    type="number"
                    name="age"
                    value={patient.age}
                    onChange={handleChange}
                    placeholder="Age"
                    required
                    className="w-full p-2 border rounded"
                />
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
                <textarea
                    name="address"
                    value={patient.address}
                    onChange={handleChange}
                    placeholder="Address"
                    required
                    className="w-full p-2 border rounded"
                />
                <input
                    type="text"
                    name="medicalCondition"
                    value={patient.medicalCondition}
                    onChange={handleChange}
                    placeholder="Medical Condition"
                    className="w-full p-2 border rounded"
                />
                <input
                    type="text"
                    name="emergencyContact"
                    value={patient.emergencyContact}
                    onChange={handleChange}
                    placeholder="Emergency Contact"
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

export default AddPatient;
