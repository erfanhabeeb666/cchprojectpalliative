import React, { useState, useEffect } from "react";
import AddPatient from "./AddPatient";
import ListPatient from "./ListPatient";
import axios from "axios";

const PatientPage = () => {
    const [patientList, setPatientList] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showList, setShowList] = useState(false);

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
            console.error("Failed to fetch patients", err);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    const handleAddSuccess = () => {
        fetchPatients();        // Refresh the list
        setShowAddForm(false);  // Hide the form
        setShowList(true);      // Show the updated list
    };

    return (
        <div className="patient-dashboard">
            <p>manage patients.</p>

            <div className="button-group space-x-4 mb-4">
                <button
                    onClick={() => {
                        setShowAddForm(true);
                        setShowList(false);
                    }}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                >
                    Add Patient
                </button>

                <button
                    onClick={() => {
                        setShowList(true);
                        setShowAddForm(false);
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    List Patients
                </button>
            </div>

            {showAddForm && (
                <div className="modal border p-4 rounded shadow bg-white">
                    <AddPatient onSuccess={handleAddSuccess} />
                    <button
                        onClick={() => setShowAddForm(false)}
                        className="text-red-600 text-sm mt-2 underline"
                    >
                        Close
                    </button>
                </div>
            )}

            {showList && <ListPatient patientList={patientList} />}
        </div>
    );
};

export default PatientPage;
