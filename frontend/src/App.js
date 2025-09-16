import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Components/Login";
import Admin from "./Components/Admin";
import VolunteerDashboard from "./Components/VolunteerDashboard"; 
import Patient from "./Components/Patient/PatientPage";
import Equipment from "./Components/Equipment/EquipmentPage";
import AssignVolunteer from "./Components/volunteer/AssignVolunteer";
import TodaysVisit from "./Components/TodaysVisit";
import CompletedVisits from "./Components/CompletedVisits";
import VolunteerPage from "./Components/volunteer/VolunteerPage";
import ProcedurePage from "./Components/procedures/ProcedurePage";
import Visits from "./Components/Visits";
import ConsumablePage from "./Components/Consumables/ConsumablePage";
import CreateNewVisit from "./Components/CreateNewVisit";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/volunteer" element={<VolunteerDashboard />} /> 
        <Route path="/admin/procedures" element={<ProcedurePage />} />
        <Route path="/admin/volunteers" element={<VolunteerPage />} />
        <Route path="/admin/patient" element={<Patient />} />
        <Route path="/admin/visits" element={<Visits/>} />
        <Route path="/admin/equipment" element={<Equipment />} />
        <Route path="/admin/assign-volunteer" element={<AssignVolunteer />} />
        <Route path="/volunteer/todays-visits" element={<TodaysVisit />} /> 
        <Route path="/volunteer/completed-visits" element={<CompletedVisits />} /> {/* match NavLink */}
        <Route path="/admin/consumables" element={<ConsumablePage/>} />
        <Route path="/admin/createnewvisit" element={<CreateNewVisit/>}/>
      </Routes>
    </Router>
  );
};

export default App;

