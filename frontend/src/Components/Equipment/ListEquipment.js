import React, { useEffect, useState } from "react";
import axios from "axios";

const ListEquipment = () => {
    const [equipmentList, setEquipmentList] = useState([]);
    const [error, setError] = useState("");

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
            console.error(err);
            setError("Failed to fetch equipment");
        }
    };

    const handleDelete = async (id) => {
        const confirm = window.confirm("Are you sure you want to delete this equipment?");
        if (!confirm) return;

        try {
            const token = localStorage.getItem("jwtToken");
            const apiUrl = process.env.REACT_APP_API_URL;

            await axios.delete(`${apiUrl}admin/delete-equipment`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    id: id,
                },
            });


            // Refresh list after deletion
            fetchEquipment();
        } catch (err) {
            console.error(err);
            setError("Failed to delete equipment");
        }
    };

    useEffect(() => {
        fetchEquipment();
    }, []);

    return (
        <div className="equipment-list">
            <h3 className="text-xl font-bold mb-4">Equipment List</h3>
            {error && <p className="text-red-600">{error}</p>}
            {equipmentList.length === 0 ? (
                <p>No equipment available.</p>
            ) : (
                <ul className="space-y-2">
                    {equipmentList.map((item) => (
                        <li key={item.id} className="p-3 border rounded flex justify-between items-center">
                            <div>
                                <strong>{item.name}</strong> —{" "}
                                {item.allocated ? "Allocated" : "Available"}
                                {item.allocatedTo && (
                                    <span> (To: {item.allocatedTo.name})</span>
                                    )}
                            </div>
                            <button
                                onClick={() => handleDelete(item.id)}
                                className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ListEquipment;

