import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalPatients: 0,
    activeVolunteers: 0,
    equipmentsTotal: 0,
    totalVisitDone: 0,
    pendingVisits: 0,
  });

  // Fetch dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
          navigate("/"); // redirect if not logged in
          return;
        }

        const apiUrl = process.env.REACT_APP_API_URL;
        const response = await fetch(`${apiUrl}admin/dashboard-stats`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard stats");
        }

        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };

    fetchStats();
  }, [navigate]);

  return (
    <div className="admin-dashboard">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
        <p className="text-secondary mt-1 font-medium">Overview of system statistics and activity</p>
      </div>

      <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        <div className="card group hover:translate-y-[-4px]">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-muted text-sm font-semibold uppercase tracking-wider mb-1">Total Patients</p>
              <h3 className="text-3xl font-bold">{stats.totalPatients}</h3>
            </div>
            <div className="p-3 bg-teal-50 rounded-xl text-teal-600 transition-colors group-hover:bg-teal-100" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)' }}>
              <i className="fas fa-user-injured text-xl"></i>
            </div>
          </div>
          <div className="mt-6 flex items-center text-xs font-semibold text-teal-600" style={{ color: 'var(--primary-dark)' }}>
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-teal-100 mr-2" style={{ backgroundColor: 'var(--primary-light)' }}>
              <i className="fas fa-check"></i>
            </span>
            Updated just now
          </div>
        </div>

        <div className="card group hover:translate-y-[-4px]">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-muted text-sm font-semibold uppercase tracking-wider mb-1">Active Volunteers</p>
              <h3 className="text-3xl font-bold">{stats.activeVolunteers}</h3>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl text-blue-600 transition-colors group-hover:bg-blue-100" style={{ backgroundColor: '#f0f9ff', color: '#0ea5e9' }}>
              <i className="fas fa-hands-helping text-xl"></i>
            </div>
          </div>
          <div className="mt-6 flex items-center text-xs font-semibold text-blue-600" style={{ color: '#0369a1' }}>
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 mr-2" style={{ backgroundColor: '#e0f2fe' }}>
              <i className="fas fa-bolt"></i>
            </span>
            Active now
          </div>
        </div>

        <div className="card group hover:translate-y-[-4px]">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-muted text-sm font-semibold uppercase tracking-wider mb-1">Equipment Items</p>
              <h3 className="text-3xl font-bold">{stats.equipmentsTotal}</h3>
            </div>
            <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600 transition-colors group-hover:bg-indigo-100" style={{ backgroundColor: '#eef2ff', color: '#6366f1' }}>
              <i className="fas fa-dolly-flatbed text-xl"></i>
            </div>
          </div>
          <div className="mt-6 text-xs font-semibold text-muted uppercase tracking-tighter">
            Total inventory count
          </div>
        </div>

        <div className="card group hover:translate-y-[-4px]">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-muted text-sm font-semibold uppercase tracking-wider mb-1">Visits Completed</p>
              <h3 className="text-3xl font-bold">{stats.totalVisitDone}</h3>
            </div>
            <div className="p-3 bg-purple-50 rounded-xl text-purple-600 transition-colors group-hover:bg-purple-100" style={{ backgroundColor: '#faf5ff', color: '#a855f7' }}>
              <i className="fas fa-check-circle text-xl"></i>
            </div>
          </div>
          <div className="mt-6 flex items-center text-xs font-semibold text-purple-600" style={{ color: '#7e22ce' }}>
            <i className="fas fa-chart-line mr-2"></i> All time performance
          </div>
        </div>

        <div className="card group hover:translate-y-[-4px] border-l-4 border-l-amber-400" style={{ borderLeftColor: 'var(--warning-color)' }}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-muted text-sm font-semibold uppercase tracking-wider mb-1">Pending Visits</p>
              <h3 className="text-3xl font-bold text-slate-800">{stats.pendingVisits}</h3>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl text-amber-600 transition-colors group-hover:bg-amber-100" style={{ backgroundColor: '#fffbeb', color: '#f59e0b' }}>
              <i className="fas fa-clock text-xl"></i>
            </div>
          </div>
          <div className="mt-6 flex items-center text-xs font-semibold text-amber-600" style={{ color: '#b45309' }}>
            <i className="fas fa-exclamation-triangle mr-2"></i> Requires immediate attention
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;