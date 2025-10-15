import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EquipmentTypeManager = ({ onClose, onTypeSelect, token, apiUrl }) => {
  const [types, setTypes] = useState([]);
  const [newType, setNewType] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTypes = async () => {
    try {
      const response = await axios.get(`${apiUrl}admin/equipment-types`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTypes(response.data);
    } catch (err) {
      console.error('Failed to fetch equipment types', err);
      setError('Failed to load equipment types');
    } finally {
      setLoading(false);
    }
  };

  const addType = async () => {
    if (!newType.trim()) return;
    
    try {
      await axios.post(
        `${apiUrl}admin/equipment-types`,
        { name: newType },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewType('');
      fetchTypes();
    } catch (err) {
      console.error('Failed to add equipment type', err);
      setError('Failed to add equipment type');
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  return (
    <div className="modal-overlay">
      <div className="form-container" style={{ maxWidth: '500px' }}>
        <h3>Manage Equipment Types</h3>
        {error && <p className="text-red-600">{error}</p>}
        
        <div className="mb-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              placeholder="New equipment type"
              className="flex-1 p-2 border rounded"
              onKeyPress={(e) => e.key === 'Enter' && addType()}
            />
            <button onClick={addType} className="btn-primary">
              Add
            </button>
          </div>
        </div>

        <div className="border rounded p-4 max-h-60 overflow-y-auto">
          {loading ? (
            <p>Loading types...</p>
          ) : types.length === 0 ? (
            <p>No equipment types found</p>
          ) : (
            <ul className="space-y-2">
              {types.map((type) => (
                <li 
                  key={type.id} 
                  className="p-2 hover:bg-gray-100 cursor-pointer rounded"
                  onClick={() => {
                    onTypeSelect(type);
                    onClose();
                  }}
                >
                  {type.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-4 flex justify-end space-x-2">
          <button onClick={onClose} className="btn-cancel">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EquipmentTypeManager;
