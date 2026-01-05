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
      <h2 className="mb-4">Volunteer Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        {loading ? (
          <div className="card p-8 text-center text-gray-500">Loading dashboard stats...</div>
        ) : (
          <>
            <div className="card hover:shadow-lg transition-shadow duration-300">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">Today's Visits</p>
                  <h3 className="text-3xl font-bold text-gray-800">{stats.todayVisits}</h3>
                </div>
                <div className="p-3 bg-blue-50 rounded-full">
                  <i className="fas fa-calendar-day text-blue-500 text-xl"></i>
                </div>
              </div>
              <div className="mt-4 text-sm text-green-600 font-medium">
                <i className="fas fa-arrow-up mr-1"></i> Due today
              </div>
            </div>

            <div className="card hover:shadow-lg transition-shadow duration-300">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">Completed Visits</p>
                  <h3 className="text-3xl font-bold text-gray-800">{stats.completedVisits}</h3>
                </div>
                <div className="p-3 bg-green-50 rounded-full">
                  <i className="fas fa-check-circle text-green-500 text-xl"></i>
                </div>
              </div>
              <div className="mt-4 text-sm text-green-600 font-medium">
                <i className="fas fa-chart-line mr-1"></i> Total completed
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VolunteerDashboard;
