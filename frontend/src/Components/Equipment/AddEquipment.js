import React, { useState } from 'react';
import axios from 'axios';

const AddEquipment = ({ onSuccess, onCancel }) => {
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
            onSuccess();
        } catch (err) {
            console.error(err);
            setError("Failed to add equipment");
            setSuccessMessage('');
        }
    };

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold mb-4">Add Equipment</h2>

            {successMessage && <p className="text-green-600 font-medium">{successMessage}</p>}
            {error && <p className="text-red-600 font-medium">{error}</p>}

            <form onSubmit={handleSubmit}>
                <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Equipment Name</label>
                    <input
                        type="text"
                        name="name"
                        value={equipment.name}
                        onChange={handleChange}
                        placeholder="e.g. Wheelchair"
                        required
                        className="input-field"
                    />
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', width: '100%' }}>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ flex: 1, height: '38px', fontSize: '0.8125rem', whiteSpace: 'nowrap' }}
                    >
                        Add Equipment
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="btn btn-outline"
                        style={{ flex: 1, height: '38px', fontSize: '0.8125rem', whiteSpace: 'nowrap' }}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddEquipment;
