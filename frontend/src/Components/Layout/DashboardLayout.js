import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { getDisplayName } from '../../utils/auth';
import Breadcrumbs from '../Common/Breadcrumbs';
import './DashboardLayout.css';

const DashboardLayout = ({ role }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem("jwtToken");
        navigate("/");
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const adminLinks = [
        { to: "/admin", icon: "fas fa-tachometer-alt", label: "Dashboard", end: true },
        { to: "/admin/patient", icon: "fas fa-user-injured", label: "Patients" },
        { to: "/admin/volunteers", icon: "fas fa-hands-helping", label: "Volunteers" },
        { to: "/admin/procedures", icon: "fas fa-stethoscope", label: "Procedures" },
        { to: "/admin/visits", icon: "fas fa-notes-medical", label: "Visit Reports" },
        { to: "/admin/createnewvisit", icon: "fas fa-stethoscope", label: "Create New Visit" },
        { to: "/admin/equipment", icon: "fas fa-dolly-flatbed", label: "Equipment" },
        { to: "/admin/consumables", icon: "fas fa-medkit", label: "Consumables" },
        { to: "/admin/settings", icon: "fas fa-cogs", label: "Settings" },
    ];

    const volunteerLinks = [
        { to: "/volunteer", icon: "fas fa-tachometer-alt", label: "Dashboard", end: true },
        { to: "/volunteer/todays-visits", icon: "fas fa-calendar-day", label: "Today's Visits" },
        { to: "/volunteer/completed-visits", icon: "fas fa-check", label: "Completed Visits" },
        { to: "/volunteer/profile", icon: "fas fa-user", label: "Profile" },
    ];

    const links = role === 'admin' ? adminLinks : volunteerLinks;

    return (
        <div className="dashboard-layout">
            {/* Sidebar */}
            <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <span className="sidebar-brand">PASS CARE</span>
                </div>
                <nav className="sidebar-nav">
                    {links.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            end={link.end}
                            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
                            onClick={() => setSidebarOpen(false)} // Close on mobile click
                        >
                            <i className={`${link.icon} nav-icon`}></i>
                            {link.label}
                        </NavLink>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <div className="main-content-wrapper">
                <header className="topbar">
                    <div className="topbar-left">
                        <button className="mobile-toggle" onClick={toggleSidebar}>
                            <i className="fas fa-bars"></i>
                        </button>
                        <div className="breadcrumbs-wrapper">
                            <Breadcrumbs />
                        </div>
                    </div>

                    <div className="topbar-actions">
                        <span className="greeting" style={{ marginRight: '1rem', color: 'var(--text-primary)' }}>
                            Hi, {getDisplayName()}
                        </span>
                        <button className="btn btn-outline" onClick={handleLogout}>
                            <i className="fas fa-sign-out-alt" style={{ marginRight: '0.5rem' }}></i> Logout
                        </button>
                    </div>
                </header>

                <main className="content-area">
                    <Outlet />
                </main>
            </div>

            {/* Overlay for mobile sidebar */}
            {sidebarOpen && (
                <div
                    className="modal-overlay"
                    style={{ zIndex: 45, justifyContent: 'flex-start', background: 'rgba(0,0,0,0.5)' }}
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}
        </div>
    );
};

export default DashboardLayout;
