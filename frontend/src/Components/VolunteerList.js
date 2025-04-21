import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Volunteers = () => {
    const [volunteers, setVolunteers] = useState([]);
    const [showAddVolunteerModal, setShowAddVolunteerModal] = useState(false);
    const [newVolunteer, setNewVolunteer] = useState({
        name: "",
        email: "",
        password: "",
        phoneNumber: "",
        address: "",
        specialization: "",
    });
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();

    // Fetch Volunteers List
    const fetchVolunteers = async () => {
        try {
            const token = localStorage.getItem("jwtToken");
            const apiUrl = process.env.REACT_APP_API_URL;
            const response = await axios.get(`${apiUrl}admin/list-volunteers`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setVolunteers(response.data);
        } catch (err) {
            setError("Failed to load volunteers");
        }
    };

    // Add Volunteer
    const handleAddVolunteer = async () => {
        try {
            const token = localStorage.getItem("jwtToken");
            const apiUrl = process.env.REACT_APP_API_URL;
            await axios.post(
                `${apiUrl}admin/add-volunteer`,
                newVolunteer,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setSuccessMessage("Volunteer added successfully!");
            setShowAddVolunteerModal(false);
            setNewVolunteer({
                name: "",
                email: "",
                password: "",
                phoneNumber: "",
                address: "",
                specialization: "",
            });
            fetchVolunteers(); // Refresh the volunteer list
        } catch (err) {
            setError("Failed to add volunteer");
        }
    };

    useEffect(() => {
        fetchVolunteers();
    }, []);

    return (
        <div className="volunteers">
            <h2>Volunteer List</h2>

            {/* Volunteer List */}
            <ul>
                {volunteers.map((volunteer) => (
                    <li key={volunteer.id}>
                        {volunteer.name} - {volunteer.specialization}
                    </li>
                ))}
            </ul>

            {/* Add Volunteer Button */}
            <button onClick={() => setShowAddVolunteerModal(true)}>Add Volunteer</button>

            {/* Add Volunteer Modal */}
            {showAddVolunteerModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Add New Volunteer</h3>
                        {error && <p className="error">{error}</p>}
                        {successMessage && <p className="success">{successMessage}</p>}
                        <input
                            type="text"
                            placeholder="Name"
                            value={newVolunteer.name}
                            onChange={(e) =>
                                setNewVolunteer({ ...newVolunteer, name: e.target.value })
                            }
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={newVolunteer.email}
                            onChange={(e) =>
                                setNewVolunteer({ ...newVolunteer, email: e.target.value })
                            }
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={newVolunteer.password}
                            onChange={(e) =>
                                setNewVolunteer({ ...newVolunteer, password: e.target.value })
                            }
                            required
                        />
                        <input
                            type="text"
                            placeholder="Phone Number"
                            value={newVolunteer.phoneNumber}
                            onChange={(e) =>
                                setNewVolunteer({ ...newVolunteer, phoneNumber: e.target.value })
                            }
                            required
                        />
                        <input
                            type="text"
                            placeholder="Address"
                            value={newVolunteer.address}
                            onChange={(e) =>
                                setNewVolunteer({ ...newVolunteer, address: e.target.value })
                            }
                            required
                        />
                        <input
                            type="text"
                            placeholder="Specialization"
                            value={newVolunteer.specialization}
                            onChange={(e) =>
                                setNewVolunteer({
                                    ...newVolunteer,
                                    specialization: e.target.value,
                                })
                            }
                            required
                        />
                        <button onClick={handleAddVolunteer}>Add Volunteer</button>
                        <button onClick={() => setShowAddVolunteerModal(false)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Volunteers;
