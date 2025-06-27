import React from "react";
import { useNavigate } from "react-router-dom";

const Admin = () => {
    const navigate = useNavigate();

    const handleGoToProcedures = () => {
        navigate("/admin/procedures");
    };

    const handleGoToVolunteers = () => {
        navigate("/admin/volunteers");
    };

    const handleGoToAddPatient = () => {
        navigate("/admin/patient");
    };
    const handleGoToAddEquipment = ()=>{
        navigate("/admin/equipment");
    }
    const handleGotoAssignVolunteer = () =>{
        navigate("/admin/assignVolunteer");
    }
      const handleGoToConsumables     = () => {
        navigate("/admin/consumables");
      }
    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>
            <p>Welcome to the Admin Dashboard.</p>
            <button onClick={handleGoToProcedures}>Procedures</button>
            <button onClick={handleGoToVolunteers}>Volunteers</button>
            <button onClick={handleGoToAddPatient}>Patient</button>
            <button onClick={handleGoToAddEquipment}>Equipment</button>
            <button onClick={handleGotoAssignVolunteer}>Visits</button>
             <button onClick={handleGoToConsumables}>Consumables</button>
          
        </div>
    );
};

export default Admin;

