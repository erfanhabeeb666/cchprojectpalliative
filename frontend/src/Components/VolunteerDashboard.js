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
      <h1 className="mb-4">Volunteer Dashboard</h1>
      <section className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        {loading ? (
          <p>Loading dashboard stats...</p>
        ) : (
          <>
            <div className="card">
              <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Today's Visits</h3>
              <div className="flex items-center mt-4">
                <i className="fas fa-calendar-day fa-2x" style={{ color: 'var(--primary-color)', marginRight: '1rem' }}></i>
                <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.todayVisits}</span>
              </div>
            </div>
            <div className="card">
              <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Completed Visits</h3>
              <div className="flex items-center mt-4">
                <i className="fas fa-check fa-2x" style={{ color: 'var(--success-color)', marginRight: '1rem' }}></i>
                <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.completedVisits}</span>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default VolunteerDashboard;
