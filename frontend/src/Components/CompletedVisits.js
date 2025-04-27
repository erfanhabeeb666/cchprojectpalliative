import React, { useState, useEffect } from 'react';
const apiUrl = process.env.REACT_APP_API_URL;
const decodeJwtToken = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Failed to decode JWT token', error);
        return null;
    }
};

const CompletedVisits = () => {
    const [completedVisits, setCompletedVisits] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCompletedVisits();
    }, []);

    const fetchCompletedVisits = async () => {
        setLoading(true); // Start loading
        setError(''); // Clear any previous errors

        const jwtToken = localStorage.getItem('jwtToken');
        if (!jwtToken) {
            setError('No JWT token found');
            setLoading(false);
            return;
        }

        // Decode the JWT token to get the volunteer ID (userId)
        const decodedToken = decodeJwtToken(jwtToken);
        if (!decodedToken || !decodedToken.userId) {
            setError('Invalid token or user ID not found');
            setLoading(false);
            return;
        }

        const volunteerId = decodedToken.userId;

        try {
            // Fetch completed visits for the volunteer
            const response = await fetch(`${apiUrl}volunteer/completed-visits?volunteerId=${volunteerId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                },
            });


            if (!response.ok) {
                throw new Error('Failed to fetch completed visits');
            }

            const data = await response.json();
            setCompletedVisits(data); // Set the completed visits data
        } catch (err) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <div>
            <h2>Completed Visits</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    {completedVisits.length === 0 && <p>No completed visits found.</p>}
                    {completedVisits.length > 0 && (
                        <ul>
                            {completedVisits.map((visit) => (
                                <li key={visit.id}>
                                    <strong>Visit ID:</strong> {visit.id} <br />
                                    <strong>Patient Name:</strong> {visit.patientName} <br />
                                    <strong>Volunteer Name:</strong> {visit.volunteerName} <br />
                                    <strong>Visit Date:</strong> {visit.visitDate} <br />
                                    <strong>Status:</strong> {visit.status} <br />
                                    {/* Add other fields as required */}
                                </li>
                            ))}
                        </ul>
                    )}
                </>
            )}
        </div>
    );
};

export default CompletedVisits;
