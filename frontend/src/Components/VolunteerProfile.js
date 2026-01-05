import React from "react";


const VolunteerProfile = () => {
  return (
    <div className="volunteer-profile-page">
      <h2 className="mb-4">Profile</h2>

      <div className="card">
        <div className="flex items-center justify-center flex-col py-12 text-center">
          <div className="bg-gray-100 p-4 rounded-full mb-4">
            <i className="fas fa-user-circle fa-4x" style={{ color: 'var(--text-secondary)' }}></i>
          </div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">Volunteer Profile</h3>
          <p className="text-gray-500 max-w-sm">
            This section is under development. You will soon be able to view and edit your profile details assigned by the administration.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VolunteerProfile;
