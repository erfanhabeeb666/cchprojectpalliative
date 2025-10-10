import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate,NavLink } from "react-router-dom";
import { getDisplayName } from "../utils/auth";
import "./Styles/Admin.css";
import "./Styles/Main.css";
import "./Styles/Sidebar.css";

const Visits = () => {
  const [visits, setVisits] = useState([]);
  const [activeTab, setActiveTab] = useState("completed"); // completed / pending / all
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(8);
  const [totalPages, setTotalPages] = useState(0);

  const navigate = useNavigate();

  const fetchVisits = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const apiUrl = process.env.REACT_APP_API_URL;

      let params = {
        page,
        size,
      };

      // Add status only if tab is not "all"
      if (activeTab !== "all") {
        params.status = activeTab.toUpperCase(); // backend expects COMPLETED / PENDING
      }

      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await axios.get(`${apiUrl}admin/visits`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      setVisits(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
    } catch (err) {
      console.error("Failed to fetch visits", err);
    }
  };

  const downloadVisitsCsv = async () => {
    try {
      if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
        alert("Invalid date range: 'From' is after 'To'.");
        return;
      }

      if (filteredVisits.length === 0) {
        alert("No visits found for the selected filters to export.");
        return;
      }

      const token = localStorage.getItem("jwtToken");
      const apiUrl = process.env.REACT_APP_API_URL;
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await axios.get(`${apiUrl}admin/export/visits`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "visits.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to export visits CSV", err);
    }
  };

  useEffect(() => {
    fetchVisits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, page, size, startDate, endDate]);

  // filter visits by patient name
  const filteredVisits = visits.filter((visit) =>
    visit.patientName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <center>
          <h2>P A S S</h2>
        </center>
        <nav>
                 <ul className="sidebar-menu">
                   <li>
                     <NavLink to="/admin" className="sidebar-link">
                       <i className="fas fa-tachometer-alt"></i> Dashboard
                     </NavLink>
                   </li>
                   <li>
                     <NavLink to="/admin/patient" className="sidebar-link">
                       <i className="fas fa-user-injured"></i> Patients
                     </NavLink>
                   </li>
                   <li>
                     <NavLink to="/admin/volunteers" className="sidebar-link">
                       <i className="fas fa-hands-helping"></i> Volunteers
                     </NavLink>
                   </li>
                   <li>
                     <NavLink to="/admin/procedures" className="sidebar-link">
                       <i className="fas fa-stethoscope"></i> Procedures
                     </NavLink>
                   </li>
                   <li>
                     <NavLink to="/admin/visits" className="sidebar-link">
                       <i className="fas fa-notes-medical"></i> Visit Reports
                     </NavLink>
                   </li>
                   <li>
                                 <NavLink to="/admin/createnewvisit" className="sidebar-link">
                                   <i className="fas fa-stethoscope"></i> Create New Visit
                                 </NavLink>
                               </li>
                   <li>
                     <NavLink to="/admin/equipment" className="sidebar-link">
                       <i className="fas fa-dolly-flatbed"></i> Equipment
                     </NavLink>
                   </li>
                   <li>
                     <NavLink to="/admin/consumables" className="sidebar-link">
                       <i className="fas fa-medkit"></i> Consumables
                     </NavLink>
                   </li>
                   <li>
                     <NavLink to="/admin/settings" className="sidebar-link">
                       <i className="fas fa-cogs"></i> Settings
                     </NavLink>
                   </li>
                 </ul>
               </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="topbar">
          <h1>Visit Reports</h1>
          <div className="topbar-actions">
            <span className="greeting">Hello, {getDisplayName()}</span>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </header>

        {/* Tabs */}
        <div className="mb-4 flex space-x-4" style={{ marginBottom: "20px" }}>
          <button
            className={activeTab === "completed" ? "active-tab" : ""}
            onClick={() => {
              setActiveTab("completed");
              setPage(0);
            }}
          >
            Completed Visits
          </button>
          <button
            className={activeTab === "pending" ? "active-tab" : ""}
            onClick={() => {
              setActiveTab("pending");
              setPage(0);
            }}
          >
            Pending Visits
          </button>
          <button
            className={activeTab === "all" ? "active-tab" : ""}
            onClick={() => {
              setActiveTab("all");
              setPage(0);
            }}
          >
            All Visits
          </button>
        </div>

        {/* Filters */}
        <div className="filters" style={{ marginBottom: "20px" }}>
          {/* Search */}
          <label htmlFor="search">Search Patient: </label>
          <input
            id="search"
            type="text"
            placeholder="Enter patient name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: "5px", marginLeft: "10px", marginRight: "20px" }}
          />

          {/* Date Range */}
          <label htmlFor="startDate">From: </label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setPage(0);
            }}
            style={{ marginLeft: "10px", marginRight: "20px" }}
          />

          <label htmlFor="endDate">To: </label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              setPage(0);
            }}
            style={{ marginLeft: "10px" }}
          />
          <button onClick={downloadVisitsCsv} style={{ marginLeft: "20px" }}>Export CSV</button>
        </div>

        {/* Table */}
        <div>
          <table className="main-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Volunteer</th>
                <th>Visit Date</th>
                <th>Completed Date</th>
                <th>Procedures Done</th>
                <th>Consumables Used</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredVisits.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
                    No {activeTab} visits found
                  </td>
                </tr>
              ) : (
                filteredVisits.map((visit) => (
                  <tr key={visit.id}>
                    <td>{visit.patientName}</td>
                    <td>{visit.volunteerName}</td>
                    <td>
                      {visit.visitDate
                        ? new Date(visit.visitDate).toLocaleDateString()
                        : "-"}
                    </td>
                    <td>
                      {visit.completedDate
                        ? new Date(visit.completedDate).toLocaleDateString()
                        : "-"}
                    </td>
                    <td>
                      {visit.proceduresDone && visit.proceduresDone.length > 0
                        ? visit.proceduresDone.join(", ")
                        : "None"}
                    </td>
                    <td>
  {visit.consumablesUsed && visit.consumablesUsed.length > 0
    ? visit.consumablesUsed
        .map((usage) => `${usage.consumable.name} (${usage.quantityUsed})`)
        .join(", ")
    : "None"}
</td>

                    <td>{visit.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination" style={{ marginTop: "20px", textAlign: "center" }}>
          <button
            disabled={page === 0}
            onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
            style={{ marginRight: "10px" }}
          >
            Previous
          </button>
          <span>
            Page {page + 1} of {totalPages}
          </span>
          <button
            disabled={page + 1 >= totalPages}
            onClick={() => setPage((prev) => prev + 1)}
            style={{ marginLeft: "10px" }}
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
};

export default Visits;
