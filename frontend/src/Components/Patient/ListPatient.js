import React, { useEffect, useState } from "react";
import axios from "axios";

const ListPatient = () => {
    const [patientList, setPatientList] = useState([]);
    const [error, setError] = useState("");

    const fetchPatients = async () => {
        try {
            const token = localStorage.getItem("jwtToken");
            const apiUrl = process.env.REACT_APP_API_URL;

            const response = await axios.get(`${apiUrl}admin/list-patients`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setPatientList(response.data);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch patients");
        }
    };

    const handleDelete = async (id) => {
        const confirm = window.confirm("Are you sure you want to delete this patient?");
        if (!confirm) return;

        try {
            const token = localStorage.getItem("jwtToken");
            const apiUrl = process.env.REACT_APP_API_URL;

            await axios.delete(`${apiUrl}admin/delete-patient`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    id: id,
                },
            });

            fetchPatients(); // Refresh after delete
        } catch (err) {
            console.error(err);
            setError("Failed to delete patient");
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    return (
        <div className="patient-list">
            <h3 className="text-xl font-bold mb-4">Patient List</h3>
            {error && <p className="text-red-600">{error}</p>}
            {patientList.length === 0 ? (
                <p>No patients available.</p>
            ) : (
                <ul className="space-y-2">
                    {patientList.map((patient) => (
                        <li
                            key={patient.id}
                            className="p-3 border rounded flex justify-between items-start flex-col md:flex-row md:items-center"
                        >
                            <div className="space-y-1">
                                <p><strong>{patient.name}</strong>, Age: {patient.age}, Gender: {patient.gender}</p>
                                <p>Mobile: {patient.mobileNumber}</p>
                                <p>Address: {patient.address}</p>
                                {patient.medicalCondition && <p>Condition: {patient.medicalCondition}</p>}
                                {patient.emergencyContact && <p>Emergency Contact: {patient.emergencyContact}</p>}
                            </div>
                            <button
                                onClick={() => handleDelete(patient.id)}
                                className="mt-2 md:mt-0 bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
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

export default ListPatient;
