import React, { useState, useEffect } from 'react';

const AssignVolunteer = () => {
    const [patients, setPatients] = useState([]);
    const [volunteers, setVolunteers] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState('');
    const [selectedVolunteer, setSelectedVolunteer] = useState('');
    const [visitDate, setVisitDate] = useState('');
    const [error, setError] = useState('');
    const apiUrl = process.env.REACT_APP_API_URL;
    // Fetch patients from /admin/list-patients
    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await fetch(`${apiUrl}admin/list-patients`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
                    },
                });
                const data = await response.json();
                setPatients(data.content || data); // Assuming data is an array of patients
            } catch (err) {
                setError('Failed to fetch patients');
            }
        };

        const fetchVolunteers = async () => {
            try {
                const response = await fetch(`${apiUrl}admin/list-volunteers`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
                    },
                });
                const data = await response.json();
                setVolunteers(data.content || data);
            } catch (err) {
                setError('Failed to fetch volunteers');
            }
        };

        fetchPatients();
        fetchVolunteers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            visitDate: visitDate,
            patientId: selectedPatient,
            volunteerId: selectedVolunteer, // This is the volunteer ID
        };

        try {
            const response = await fetch(`${apiUrl}admin/assign-volunteer`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Failed to assign volunteer');
            }

            alert('Volunteer assigned successfully!');
        } catch (err) {
            setError('Failed to assign volunteer');
        }
    };

    return (
        <div>
            <h2>Assign Volunteer to Patient</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="patient">Select Patient</label>
                    <select
                        id="patient"
                        value={selectedPatient}
                        onChange={(e) => setSelectedPatient(e.target.value)}
                        required
                    >
                        <option value="">Select Patient</option>
                        {patients.map((patient) => (
                            <option key={patient.id} value={patient.id}>
                                {patient.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="volunteer">Select Volunteer</label>
                    <select
                        id="volunteer"
                        value={selectedVolunteer}
                        onChange={(e) => {
                            setSelectedVolunteer(e.target.value); // This should be the volunteer ID
                            console.log("Selected volunteer ID:", e.target.value); // Debug log to see if it's the ID
                        }}
                        required
                    >
                        <option value="">Select Volunteer</option>
                        {volunteers.map((volunteer) => (
                            <option key={volunteer.id} value={volunteer.id}> {/* Correct value should be volunteer.id */}
                                {volunteer.name} {/* Display the volunteer name */}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="visitDate">Visit Date</label>
                    <input
                        type="date"
                        id="visitDate"
                        value={visitDate}
                        onChange={(e) => setVisitDate(e.target.value)}
                        required
                    />
                </div>

                <button type="submit">Assign Volunteer</button>
            </form>
        </div>
    );
};

export default AssignVolunteer;
