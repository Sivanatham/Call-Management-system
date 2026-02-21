const EmployeeProfile = ({ name, phone, team }) => {
  return (
    <div className="employee-profile">

      <div className="profile-left">
        <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="user" />
      </div>

      <div className="profile-info">
        <h3>Welcome, {name}</h3>
        <p>📞 Phone: {phone || 'Not provided'}</p>
        {team && <p>👥 Team: {team}</p>}
      </div>

      <div className="profile-badge">Active Caller</div>

    </div>
  );
};

export default EmployeeProfile;
