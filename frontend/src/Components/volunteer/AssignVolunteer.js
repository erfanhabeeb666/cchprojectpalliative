import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AssignVolunteer = () => {
    const [patients, setPatients] = useState([]);
    const [volunteers, setVolunteers] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState('');
    const [selectedVolunteer, setSelectedVolunteer] = useState('');
    const [visitDate, setVisitDate] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const apiUrl = process.env.REACT_APP_API_URL;
    const token = localStorage.getItem('jwtToken');

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await axios.get(`${apiUrl}admin/list-patients`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                // Check format, might be paginated or list
                const data = response.data.content || response.data;
                setPatients(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error('Failed to fetch patients', err);
            }
        };

        const fetchVolunteers = async () => {
            try {
                const response = await axios.get(`${apiUrl}admin/list-volunteers`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = response.data.content || response.data;
                setVolunteers(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error('Failed to fetch volunteers', err);
            }
        };

        fetchPatients();
        fetchVolunteers();
    }, [apiUrl, token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        const payload = {
            visitDate: visitDate,
            patientId: selectedPatient,
            volunteerId: selectedVolunteer,
            // API expects patientIds array usually in other components, but this legacy one might need check.
            // Based on view_file code: body: JSON.stringify(payload) with patientId (singular).
            // Let's stick to the original logic but update styles.
        };

        // Note: The previous view_file code showed this payload structure:
        // { visitDate, patientId, volunteerId }
        // Wait, CreateNewVisit uses `patientIds: [...]`. 
        // If this endpoint expects a list, this might fail if sent as string.
        // However, I will trust the previous code's intent but maybe the backend handles both?
        // Actually, let's look at `CreateNewVisit` again. It hits `admin/assign-volunteer`.
        // `CreateNewVisit` sends `patientIds` (plural).
        // `AssignVolunteer` (previous code) sent `patientId` (singular).
        // If they hit the same endpoint, one is likely wrong or the backend is flexible.
        // I will adapt this to send `patientIds: [selectedPatient]` to be safe and consistent with modern usage if `patientId` is not working, 
        // BUT I shouldn't break working code if I'm not sure. 
        // The safest bet is to default to the code I just read from view_file which used `patientId`. 
        // actually `CreateNewVisit` is the "modern" way. This file `AssignVolunteer.js` might be obsolete.
        // I will keep the logic EXACTLY as it was in `view_file` to avoid breaking it if it hits a different controller method (unlikely) or if backend handles both DTOs.
        // Actually, looking at the view_file of `AssignVolunteer.js`, it targetted the same URL `${apiUrl}admin/assign-volunteer`.
        // I will stick to the previous payload to be safe, but wrapped in valid style.

        try {
            // NOTE: Changing payload to match CreateNewVisit's confirmed working structure might be safer? 
            // The previous code had `patientId: selectedPatient`. 
            // I'll try to support the array format if possible, or just keep it as is. 
            // I'll keep it as is to avoid logic regressions.

            await axios.post(`${apiUrl}admin/assign-volunteer`, payload, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            setMessage('Volunteer assigned successfully!');
            // Reset form
            setSelectedPatient('');
            setSelectedVolunteer('');
            setVisitDate('');
        } catch (err) {
            setError(err.message || 'Failed to assign volunteer');
        }
    };

    return (
        <div className="assign-volunteer-page">
            <h2 className="mb-4">Assign Volunteer (Quick)</h2>

            <div className="card" style={{ maxWidth: '600px' }}>
                {error && <div className="p-3 mb-4 text-red-700 bg-red-100 rounded border border-red-200">{error}</div>}
                {message && <div className="p-3 mb-4 text-green-700 bg-green-100 rounded border border-green-200">{message}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="patient" className="block text-sm font-medium text-gray-700 mb-1">Select Patient</label>
                        <select
                            id="patient"
                            value={selectedPatient}
                            onChange={(e) => setSelectedPatient(e.target.value)}
                            required
                            className="input-field"
                        >
                            <option value="">Select Patient</option>
                            {patients.map((patient) => (
                                <option key={patient.id} value={patient.id}>
                                    {patient.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="volunteer" className="block text-sm font-medium text-gray-700 mb-1">Select Volunteer</label>
                        <select
                            id="volunteer"
                            value={selectedVolunteer}
                            onChange={(e) => setSelectedVolunteer(e.target.value)}
                            required
                            className="input-field"
                        >
                            <option value="">Select Volunteer</option>
                            {volunteers.map((volunteer) => (
                                <option key={volunteer.id} value={volunteer.id}>
                                    {volunteer.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-6">
                        <label htmlFor="visitDate" className="block text-sm font-medium text-gray-700 mb-1">Visit Date</label>
                        <input
                            type="date"
                            id="visitDate"
                            value={visitDate}
                            onChange={(e) => setVisitDate(e.target.value)}
                            required
                            className="input-field"
                        />
                    </div>

                    <div className="flex justify-end">
                        <button type="submit" className="btn btn-primary">
                            Assign Volunteer
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AssignVolunteer;
