import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EquipmentTypeManager from './EquipmentTypeManager';

const AddEquipment = ({ onSuccess, onClose }) => {
    const [equipment, setEquipment] = useState({ 
        name: '',
        equipmentTypeId: ''
    });
    const [equipmentTypes, setEquipmentTypes] = useState([]);
    const [showTypeManager, setShowTypeManager] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingTypes, setIsLoadingTypes] = useState(true);
    const token = localStorage.getItem('jwtToken');
    const apiUrl = process.env.REACT_APP_API_URL;

    const fetchEquipmentTypes = async () => {
        try {
            const response = await axios.get(`${apiUrl}admin/equipment-types`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setEquipmentTypes(response.data);
        } catch (err) {
            console.error('Failed to fetch equipment types', err);
            setError('Failed to load equipment types');
        } finally {
            setIsLoadingTypes(false);
        }
    };

    useEffect(() => {
        fetchEquipmentTypes();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEquipment(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleTypeSelect = (type) => {
        setEquipment(prev => ({
            ...prev,
            equipmentTypeId: type.id
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!equipment.name.trim()) {
            setError('Equipment name is required');
            return;
        }
        if (!equipment.equipmentTypeId) {
            setError('Please select an equipment type');
            return;
        }

        setIsSubmitting(true);
        setError('');
        setSuccessMessage('');

        try {
            const response = await axios.post(
                `${apiUrl}admin/add-equipment`,
                equipment,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setSuccessMessage('Equipment added successfully!');
            setEquipment({ name: '', equipmentTypeId: '' });
            if (typeof onSuccess === 'function') {
                onSuccess();
            }
        } catch (err) {
            console.error('Error adding equipment:', err);
            setError(err.response?.data?.message || 'Failed to add equipment');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-4">
            {showTypeManager ? (
                <EquipmentTypeManager 
                    onClose={() => setShowTypeManager(false)}
                    onTypeSelect={handleTypeSelect}
                    token={token}
                    apiUrl={apiUrl}
                />
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="text-lg font-semibold">Add New Equipment</h3>
                    {error && <div className="text-red-600">{error}</div>}
                    {successMessage && <div className="text-green-600">{successMessage}</div>}
                    
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Equipment Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={equipment.name}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Enter equipment name"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center">
                            <label htmlFor="equipmentTypeId" className="block text-sm font-medium text-gray-700">
                                Equipment Type
                            </label>
                            <button
                                type="button"
                                onClick={() => setShowTypeManager(true)}
                                className="text-xs text-blue-600 hover:text-blue-800"
                            >
                                Manage Types
                            </button>
                        </div>
                        <select
                            id="equipmentTypeId"
                            name="equipmentTypeId"
                            value={equipment.equipmentTypeId}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            disabled={isSubmitting || isLoadingTypes}
                            required
                        >
                            <option value="">Select equipment type</option>
                            {equipmentTypes.map(type => (
                                <option key={type.id} value={type.id}>
                                    {type.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                       
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Adding...' : 'Add Equipment'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default AddEquipment;
