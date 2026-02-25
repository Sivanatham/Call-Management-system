const EmployeeHeader = () => {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <div className="employee-header mb-6">
      <h2>📞 Calling Panel</h2>
      <button className="logout-btn" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default EmployeeHeader;
