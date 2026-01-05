import React from "react";


const SettingsPage = () => {
  return (
    <div className="settings-page">
      <h2 className="mb-4">Settings</h2>

      <div className="card">
        <div className="flex items-center justify-center flex-col py-12 text-center">
          <div className="bg-gray-100 p-4 rounded-full mb-4">
            <i className="fas fa-cogs fa-3x" style={{ color: 'var(--text-secondary)' }}></i>
          </div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">Configuration Coming Soon</h3>
          <p className="text-gray-500 max-w-sm">
            We are currently building this section. Soon you will be able to manage application preferences, user roles, and system notifications from here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
