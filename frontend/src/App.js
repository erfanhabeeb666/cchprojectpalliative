import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Components/Login";
import Admin from "./Components/Admin";
import Volunteer from "./Components/Volunteer";
import Procedures from "./Components/Procedures";
import VolunteerList from "./Components/VolunteerList";
import Patient from "./Components/Patient/PatientPage";
import Equipment from "./Components/Equipment/EquipmentPage";
import AssignVolunteer from "./Components/AssignVolunteer";
import TodaysVisit from "./Components/TodaysVisit";
import CompletedVisits from "./Components/CompletedVisits";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/volunteer" element={<Volunteer />} />
                <Route path="/admin/procedures" element={<Procedures />} />
                <Route path="/admin/volunteers" element={<VolunteerList />} />
                <Route path="/admin/patient" element={<Patient />} />
                <Route path="/admin/equipment" element={<Equipment />} />
                <Route path="/admin/assignVolunteer" element={<AssignVolunteer />}/>
                <Route path="/volunteer/todaysVisits" element={<TodaysVisit/>}/>
                <Route path="/volunteer/completedVisits" element={<CompletedVisits/>}/>

            </Routes>
        </Router>
    );
};

export default App;
