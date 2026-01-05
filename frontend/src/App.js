import React, { useEffect } from "react";
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
import SettingsPage from "./Components/Settings/SettingsPage";
import VolunteerProfile from "./Components/VolunteerProfile";
import { MapsProvider } from "./Components/common/MapsProvider";
import { initAuthAutoLogout } from "./utils/auth";
import DashboardLayout from "./Components/Layout/DashboardLayout";

const App = () => {
  useEffect(() => {
    initAuthAutoLogout();
  }, []);
  return (
    <Router>
      <MapsProvider>
        <Routes>
          <Route path="/" element={<Login />} />

          {/* Admin Layout & Routes */}
          <Route path="/admin" element={<DashboardLayout role="admin" />}>
            <Route index element={<Admin />} />
            <Route path="patient" element={<Patient />} />
            <Route path="volunteers" element={<VolunteerPage />} />
            <Route path="procedures" element={<ProcedurePage />} />
            <Route path="visits" element={<Visits />} />
            <Route path="equipment" element={<Equipment />} />
            <Route path="assign-volunteer" element={<AssignVolunteer />} />
            <Route path="consumables" element={<ConsumablePage />} />
            <Route path="createnewvisit" element={<CreateNewVisit />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Volunteer Layout & Routes */}
          <Route path="/volunteer" element={<DashboardLayout role="volunteer" />}>
            <Route index element={<VolunteerDashboard />} />
            <Route path="todays-visits" element={<TodaysVisit />} />
            <Route path="completed-visits" element={<CompletedVisits />} />
            <Route path="profile" element={<VolunteerProfile />} />
          </Route>

        </Routes>
      </MapsProvider>
    </Router>
  );
};

export default App;
