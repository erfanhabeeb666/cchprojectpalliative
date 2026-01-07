import React, { useEffect, useState } from "react";
import axios from "axios";

const VolunteerDashboard = () => {
  const [stats, setStats] = useState({ todayVisits: 0, completedVisits: 0 });
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const response = await axios.get(`${API_BASE_URL}volunteer/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [API_BASE_URL]);

  return (
    <div className="volunteer-dashboard">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Volunteer Dashboard</h2>
        <p className="text-secondary mt-1 font-medium">Manage your visits and track your progress</p>
      </div>

      <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {loading ? (
          <div className="card p-12 text-center col-span-full">
            <i className="fas fa-circle-notch fa-spin text-3xl text-primary mb-4"></i>
            <p className="text-secondary font-medium tracking-wide">Loading dashboard statistics...</p>
          </div>
        ) : (
          <>
            <div className="card group hover:translate-y-[-4px]">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-muted text-sm font-semibold uppercase tracking-wider mb-1">Today's Visits</p>
                  <h3 className="text-4xl font-bold">{stats.todayVisits}</h3>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl text-blue-600 transition-colors group-hover:bg-blue-100" style={{ backgroundColor: '#f0f9ff', color: '#0ea5e9' }}>
                  <i className="fas fa-calendar-day text-2xl"></i>
                </div>
              </div>
              <div className="mt-6 flex items-center text-sm font-semibold text-blue-600" style={{ color: '#0369a1' }}>
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 mr-2" style={{ backgroundColor: '#e0f2fe' }}>
                  <i className="fas fa-clock text-xs"></i>
                </span>
                Scheduled for today
              </div>
            </div>

            <div className="card group hover:translate-y-[-4px]">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-muted text-sm font-semibold uppercase tracking-wider mb-1">Completed Visits</p>
                  <h3 className="text-4xl font-bold">{stats.completedVisits}</h3>
                </div>
                <div className="p-4 bg-teal-50 rounded-xl text-teal-600 transition-colors group-hover:bg-teal-100" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)' }}>
                  <i className="fas fa-check-circle text-2xl"></i>
                </div>
              </div>
              <div className="mt-6 flex items-center text-sm font-semibold text-teal-600" style={{ color: 'var(--primary-dark)' }}>
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-teal-100 mr-2" style={{ backgroundColor: 'var(--primary-light)' }}>
                  <i className="fas fa-trophy text-xs"></i>
                </span>
                Total impact made
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VolunteerDashboard;
