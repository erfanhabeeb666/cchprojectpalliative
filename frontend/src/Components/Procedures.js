import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Styles/Procedures.css"
const Procedures = () => {
    const [procedures, setProcedures] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newProcedureName, setNewProcedureName] = useState("");
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    useEffect(() => {
        const fetchProcedures = async () => {
            try {
                const token = localStorage.getItem("jwtToken");
                const apiUrl = process.env.REACT_APP_API_URL; // Correctly access the environment variable
                const response = await axios.get(`${apiUrl}admin/procedures`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setProcedures(response.data);
            } catch (err) {
                setError("Failed to load procedures");
            }
        };
        fetchProcedures();
    }, []);

    const handleAddProcedure = async () => {
        try {
            const apiUrl = process.env.REACT_APP_API_URL;
            const token = localStorage.getItem("jwtToken");
            console.log("API URL:", process.env.REACT_APP_API_URL);

            await axios.post(`${apiUrl}admin/procedure?name=${newProcedureName}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // Refresh the list of procedures after adding the new one
            setProcedures((prevProcedures) => [
                ...prevProcedures,
                { name: newProcedureName, visits: [] },
            ]);
            setShowModal(false);
            setNewProcedureName("");
        } catch (err) {
            setError("Failed to add procedure");
        }
    };

    return (
        <div className="procedures-container">
            <h2>Procedures List</h2>
            {error && <p className="error">{error}</p>}
            <ul>
                {procedures.map((procedure) => (
                    <li key={procedure.procedureId}>
                        {procedure.procedureName}
                    </li>
                ))}
            </ul>
            <button onClick={() => setShowModal(true)}>Add Procedure</button>

            {/* Modal for adding new procedure */}
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Add New Procedure</h3>
                        <input
                            type="text"
                            placeholder="Procedure Name"
                            value={newProcedureName}
                            onChange={(e) => setNewProcedureName(e.target.value)}
                            required
                        />
                        <button onClick={handleAddProcedure}>Add</button>
                        <button onClick={() => setShowModal(false)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Procedures;
