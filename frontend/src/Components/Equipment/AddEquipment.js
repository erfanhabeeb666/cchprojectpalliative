import React, { useState } from 'react';
import axios from 'axios';

const AddEquipment = () => {
    const [equipment, setEquipment] = useState({ name: '' });
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setEquipment({ ...equipment, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("jwtToken");
            const apiUrl = process.env.REACT_APP_API_URL;

            await axios.post(
                `${apiUrl}admin/add-equipment`,
                equipment,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setSuccessMessage("Equipment added successfully!");
            setError('');
            setEquipment({ name: '' });
        } catch (err) {
            console.error(err);
            setError("Failed to add equipment");
            setSuccessMessage('');
        }
    };

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Add Equipment</h2>

            {successMessage && <p className="text-green-600">{successMessage}</p>}
            {error && <p className="text-red-600">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="name"
                    value={equipment.name}
                    onChange={handleChange}
                    placeholder="Equipment Name"
                    required
                    className="w-full p-2 border rounded"
                />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default AddEquipment;

