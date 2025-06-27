import React from "react";
import { useNavigate } from "react-router-dom";

const Volunteer = () => {
    const navigate = useNavigate();

    const handleGotoTodaysVisits = () => {
        navigate("/volunteer/todaysVisits");
    };

    const handleGotoCompletedVisits = () => {
        navigate("/volunteer/completedVisits");
    };

    return (
        <div className="volunteer-dashboard">
            <h1>Volunteer Dashboard</h1>
            <button onClick={handleGotoTodaysVisits}>Today's Visits</button>
            <button onClick={handleGotoCompletedVisits}>Completed Visits</button>
        </div>
    );
};

export default Volunteer;
