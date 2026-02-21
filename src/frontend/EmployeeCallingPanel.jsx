import React, { useEffect, useState } from "react";
import EmployeeHeader from "./emp_comp/EmployeeHeader";
import EmployeeProfile from "./emp_comp/EmployeeProfile";
import SearchBar from "./emp_comp/SearchBar";
import CustomerCard from "./emp_comp/CustomerCard";
import TeamSection from "./emp_comp/TeamSection";
import api from "./api";
import "./emp.css";

function EmployeeCallingPanel() {

  /* ===============================
     STATE
  =============================== */
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [callHistory, setCallHistory] = useState([]);
  const [teamData, setTeamData] = useState(null);

  const [employeeProfile, setEmployeeProfile] = useState({
    id: null,
    name: "Employee",
    phone: "---",
    team: "Team"
  });

  const [progress, setProgress] = useState({
    total: 0,
    completed: 0,
    pending: 0
  });

  /* ===============================
     LOAD PROFILE
  =============================== */
  const loadProfile = async () => {
    try {
      const res = await api.get("/user/me");
      setEmployeeProfile({
        id: res.data.id,
        name: res.data.name,
        phone: res.data.phone,
        team: res.data.team_name || "No Team"
      });
    } catch (err) {
      console.log("Profile error", err);
    }
  };

  /* ===============================
     LOAD ASSIGNED TASKS
  =============================== */
  const loadCustomers = async () => {
    try {
      const res = await api.get("/calls/my");
      setCustomers(res.data);
    } catch (err) {
      console.log("Task load error", err);
    }
  };

  /* ===============================
     LOAD PROGRESS (COUNTS)
  =============================== */
  const loadProgress = async () => {
    try {
      const res = await api.get("/calls/my-progress");

      setCallHistory(res.data.calls);

      setProgress({
        total: res.data.total_calls,
        completed: res.data.completed_calls,
        pending: res.data.pending_calls
      });

    } catch (err) {
      console.log("Progress load error", err);
    }
  };

  /* ===============================
     LOAD TEAM INFO
  =============================== */
  const loadTeamInfo = async () => {
    try {
      const res = await api.get("/teams/my-team");
      setTeamData(res.data);
    } catch {
      setTeamData(null);
    }
  };

  /* ===============================
     INITIAL LOAD + AUTO REFRESH
  =============================== */
  useEffect(() => {
    loadProfile();
    loadCustomers();
    loadProgress();
    loadTeamInfo();

    const interval = setInterval(() => {
      loadCustomers();
      loadProgress();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  /* ===============================
     UPDATE TASK STATUS
  =============================== */
  const handleSaveCall = async (customerData, status, duration, feedback) => {
    try {
      await api.patch(`/calls/${customerData.id}/update`, {
        status: status.toUpperCase().replace(/ /g, "_"),
        duration: duration ? parseInt(duration) : null,
        remarks: feedback
      });

      // 🔥 Instant UI Update (No waiting 5 sec)
      loadCustomers();
      loadProgress();
      loadTeamInfo(); 

      alert("Task Updated Successfully");

    } catch (err) {
      console.log("Update error", err);
    }
  };

  /* ===============================
     SEARCH FILTER
  =============================== */
  const filtered = customers.filter((c) =>
    c.customer_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh", background: darkMode ? "#1a202c" : "#f7fafc" }}>

      <EmployeeHeader />

      <div className="employee-container">

        <div style={{ textAlign: "right", marginBottom: "20px" }}>
          <button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>

        <EmployeeProfile
          name={employeeProfile.name}
          phone={employeeProfile.phone}
          // team={employeeProfile.team}
        />

        <TeamSection teamData={teamData} darkMode={darkMode} />

        {/* ===============================
            LIVE PROGRESS CARDS
        =============================== */}
        <div style={{
          display: "flex",
          gap: "20px",
          marginBottom: "20px"
        }}>

          <div style={{
            background: "#2563eb",
            color: "white",
            padding: "15px",
            borderRadius: "10px",
            flex: 1,
            textAlign: "center"
          }}>
            <h3>Total</h3>
            <h2>{progress.total}</h2>
          </div>

          <div style={{
            background: "#16a34a",
            color: "white",
            padding: "15px",
            borderRadius: "10px",
            flex: 1,
            textAlign: "center"
          }}>
            <h3>Completed</h3>
            <h2>{progress.completed}</h2>
          </div>

          <div style={{
            background: "#f59e0b",
            color: "white",
            padding: "15px",
            borderRadius: "10px",
            flex: 1,
            textAlign: "center"
          }}>
            <h3>Pending</h3>
            <h2>{progress.pending}</h2>
          </div>

        </div>

        <SearchBar value={search} onChange={setSearch} darkMode={darkMode} />

        {/* ===============================
            TASK LIST
        =============================== */}
        {filtered.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            background: darkMode ? '#374151' : 'white',
            borderRadius: '12px',
            marginTop: '20px'
          }}>
            <p style={{ fontSize: '18px' }}>
              {customers.length === 0
                ? '📋 No tasks assigned yet'
                : '🔍 No tasks match your search'}
            </p>
          </div>
        ) : (
          <div className="customer-grid">
            {filtered.map((cust) => (
              <CustomerCard
                  key={cust.id}
                  data={{
                    id: cust.id,
                    name: cust.customer_name,
                    phone: cust.phone,
                    campaign: cust.campaign,   // ✅ ADD THIS
                    assignedDate: cust.start_time?.split("T")[0] || "-",
                    isTeamTask: cust.assigned_to_id !== employeeProfile.id
                  }}
                  onSave={handleSaveCall}
                  darkMode={darkMode}
/>
            ))}
          </div>
        )}

        {/* ===============================
            TASK HISTORY
        =============================== */}
        <div style={{ marginTop: "40px" }}>
          <h2>📋 Task History</h2>
          <table width="100%" border="1" cellPadding="8">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Status</th>
                <th>Duration</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {callHistory.map((call) => (
                <tr key={call.id}>
                  <td>{call.customer_name}</td>
                  <td>{call.status}</td>
                  <td>{call.duration}</td>
                  <td>{call.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

export default EmployeeCallingPanel;