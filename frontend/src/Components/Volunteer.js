import React from "react";
import {useNavigate} from "react-router-dom";


const Volunteer = () => {
    const navigate = useNavigate();

    const handleGotoTodaysVisits = () =>{
        navigate("/volunteer/todaysVisits")
    }
    const handleGotoCompletedVsits =() =>{
        navigate("/volunteer/completedVisits")
    }

    return (
        <div className="volunteer-dashboard">
            <h1>Volunteer Dashboard</h1>
            <button onClick={handleGotoTodaysVisits}>Today's Visits</button>
            <button onClick={handleGotoCompletedVsits}>Completed Visits</button>
        </div>
    );
};

export default Volunteer;
