import React, { useState, useEffect } from 'react';
import './Styles/TodayVisit.css';
// Modal Component
const ProcedureModal = ({ visit, procedures, onClose, onSubmit }) => {
    const [selectedProcedure, setSelectedProcedure] = useState([]);
    const [status, setStatus] = useState('COMPLETED');

    const handleSubmit = async () => {
        if (!selectedProcedure.length) {
            alert('Please select at least one procedure');
            return;
        }

        try {
            await onSubmit(visit.id, selectedProcedure, status);
            onClose(); // Close modal after successful submit
        } catch (err) {
            alert('Failed to submit visit');
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h3>Assign Procedure to Visit</h3>
                <label>Status:</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED"> Cancelled</option>
                </select>
                <div>
                    <label>Procedures:</label>
                    <select
                        multiple
                        value={selectedProcedure}
                        onChange={(e) => setSelectedProcedure(Array.from(e.target.selectedOptions, option => option.value))}
                        className="custom-select"
                    >
                        {procedures.map((procedure) => (
                            <option key={procedure.procedureId} value={procedure.procedureId}>
                                {procedure.procedureName}
                            </option>
                        ))}
                    </select>
                </div>

                <button onClick={handleSubmit}>Submit</button>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

const TodaysVisit = () => {
    const [assignedVisits, setAssignedVisits] = useState([]);
    const [procedures, setProcedures] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedVisit, setSelectedVisit] = useState(null);

    // Fetch assigned visits
    useEffect(() => {
        fetchAssignedVisits();
        fetchProcedures();
    }, []);

    const apiUrl = process.env.REACT_APP_API_URL;

    const fetchAssignedVisits = async () => {
        setLoading(true);
        setError('');
        const jwtToken = localStorage.getItem('jwtToken');
        if (!jwtToken) {
            setError('No JWT token found');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${apiUrl}volunteer/assigned-visits`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch assigned visits');
            }

            const data = await response.json();
            setAssignedVisits(data); // Set the assigned visits data
        } catch (err) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const fetchProcedures = async () => {
        const jwtToken = localStorage.getItem('jwtToken');
        if (!jwtToken) {
            setError('No JWT token found');
            return;
        }

        try {
            const response = await fetch(`${apiUrl}volunteer/procedures`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch procedures');
            }

            const data = await response.json();
            setProcedures(data); // Set the procedures list
        } catch (err) {
            setError(err.message || 'An error occurred while fetching procedures');
        }
    };

    const handleModalOpen = (visit) => {
        setSelectedVisit(visit);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setSelectedVisit(null);
        setIsModalOpen(false);
    };

    const handleProcedureSubmit = async (visitId, procedureIds, status) => {
        const jwtToken = localStorage.getItem('jwtToken');
        if (!jwtToken) {
            setError('No JWT token found');
            return;
        }

        try {
            const response = await fetch(`${apiUrl}volunteer/submit-report`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    visitId,
                    procedureIds,
                    status,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit visit');
            }

            alert('Visit submitted successfully');
            fetchAssignedVisits(); // Refresh the list after successful submission
        } catch (err) {
            setError('Failed to submit visit');
        }
    };


    return (
        <div>
            <h2>Today's Visits</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    {assignedVisits.length === 0 && <p>No assigned visits today.</p>}
                    {assignedVisits.length > 0 && (
                        <ul>
                            {assignedVisits.map((visit) => (
                                <li key={visit.id}>
                                    <strong>Visit ID:</strong> {visit.id} <br />
                                    <strong>Patient Name:</strong> {visit.patientName} <br />
                                    <strong>Volunteer Name:</strong> {visit.volunteerName} <br />
                                    <strong>Visit Date:</strong> {visit.visitDate} <br />
                                    <strong>Status:</strong> {visit.status}<br />
                                    {visit.status !== 'COMPLETED' && (
                                        <button onClick={() => handleModalOpen(visit)}>
                                            Submit
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </>
            )}

            {isModalOpen && selectedVisit && (
                <ProcedureModal
                    visit={selectedVisit}
                    procedures={procedures}
                    onClose={handleModalClose}
                    onSubmit={handleProcedureSubmit}
                />
            )}
        </div>
    );
};

export default TodaysVisit;
