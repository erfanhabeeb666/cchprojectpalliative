import React, { useState, useEffect } from "react";
import AddEquipment from "./AddEquipment";
import ListEquipment from "./ListEquipment";
import axios from "axios";

const EquipmentPage = () => {
    const [equipmentList, setEquipmentList] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showList, setShowList] = useState(false);

    const fetchEquipment = async () => {
        try {
            const token = localStorage.getItem("jwtToken");
            const apiUrl = process.env.REACT_APP_API_URL;

            const response = await axios.get(`${apiUrl}admin/view-equipments`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setEquipmentList(response.data);
        } catch (err) {
            console.error("Failed to fetch equipment", err);
        }
    };

    useEffect(() => {
        fetchEquipment();
    }, []);

    const handleAddSuccess = () => {
        fetchEquipment(); // Refresh list
        setShowAddForm(false); // Close modal
        setShowList(true);     // Show updated list
    };

    return (
        <div className="equipment-dashboard">
            <p> manage equipment.</p>

            <div className="button-group space-x-4 mb-4">
                <button
                    onClick={() => {
                        setShowAddForm(true);
                        setShowList(false);
                    }}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                >
                    Add Equipment
                </button>

                <button
                    onClick={() => {
                        setShowList(true);
                        setShowAddForm(false);
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    List Equipment
                </button>
            </div>

            {showAddForm && (
                <div className="modal border p-4 rounded shadow bg-white">
                    <AddEquipment onSuccess={handleAddSuccess} />
                    <button
                        onClick={() => setShowAddForm(false)}
                        className="text-red-600 text-sm mt-2 underline"
                    >
                        Close
                    </button>
                </div>
            )}

            {showList && <ListEquipment equipmentList={equipmentList} />}
        </div>
    );
};

export default EquipmentPage;




