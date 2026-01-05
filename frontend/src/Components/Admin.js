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
      <h2 className="mb-4">Admin Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        <div className="card hover:shadow-lg transition-shadow duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Total Patients</p>
              <h3 className="text-3xl font-bold text-gray-800">{stats.totalPatients}</h3>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <i className="fas fa-user-injured text-blue-500 text-xl"></i>
            </div>
          </div>
          <div className="mt-4 text-sm text-green-600 font-medium">
            <i className="fas fa-arrow-up mr-1"></i> Updated just now
          </div>
        </div>

        <div className="card hover:shadow-lg transition-shadow duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Active Volunteers</p>
              <h3 className="text-3xl font-bold text-gray-800">{stats.activeVolunteers}</h3>
            </div>
            <div className="p-3 bg-purple-50 rounded-full">
              <i className="fas fa-hands-helping text-purple-500 text-xl"></i>
            </div>
          </div>
          <div className="mt-4 text-sm text-green-600 font-medium">
            <i className="fas fa-arrow-up mr-1"></i> Active now
          </div>
        </div>

        <div className="card hover:shadow-lg transition-shadow duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Equipment Items</p>
              <h3 className="text-3xl font-bold text-gray-800">{stats.equipmentsTotal}</h3>
            </div>
            <div className="p-3 bg-indigo-50 rounded-full">
              <i className="fas fa-dolly-flatbed text-indigo-500 text-xl"></i>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            Total inventory count
          </div>
        </div>

        <div className="card hover:shadow-lg transition-shadow duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Visits Completed</p>
              <h3 className="text-3xl font-bold text-gray-800">{stats.totalVisitDone}</h3>
            </div>
            <div className="p-3 bg-green-50 rounded-full">
              <i className="fas fa-check-circle text-green-500 text-xl"></i>
            </div>
          </div>
          <div className="mt-4 text-sm text-green-600 font-medium">
            <i className="fas fa-chart-line mr-1"></i> All time
          </div>
        </div>

        <div className="card hover:shadow-lg transition-shadow duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Pending Visits</p>
              <h3 className="text-3xl font-bold text-gray-800">{stats.pendingVisits}</h3>
            </div>
            <div className="p-3 bg-yellow-50 rounded-full">
              <i className="fas fa-clock text-yellow-500 text-xl"></i>
            </div>
          </div>
          <div className="mt-4 text-sm text-yellow-600 font-medium">
            <i className="fas fa-exclamation-circle mr-1"></i> Requires attention
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;