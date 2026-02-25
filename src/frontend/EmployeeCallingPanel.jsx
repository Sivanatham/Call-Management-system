import React, { useEffect, useState } from "react";
import EmployeeHeader from "./emp_comp/EmployeeHeader";
import EmployeeProfile from "./emp_comp/EmployeeProfile";
import SearchBar from "./emp_comp/SearchBar";
import CustomerCard from "./emp_comp/CustomerCard";
import TeamSection from "./emp_comp/TeamSection";
import CustomerForm from "./admin compounds/CustomerForm";
import ExcelUpload from "./admin compounds/ExcelUpload";
import EmployeeSidebar from "./emp_comp/EmployeeSidebar";
import api from "./api";
import "./emp.css";

function EmployeeCallingPanel() {
  /* ===============================
     STATE
  =============================== */
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [callHistory, setCallHistory] = useState([]);
  const [teamData, setTeamData] = useState(null);
  const [employeeProfile, setEmployeeProfile] = useState({
    id: null,
    name: "Employee",
    phone: "---",
  });

  const [progress, setProgress] = useState({
    total: 0,
    completed: 0,
    pending: 0
  });

  /* ===============================
     RESPONSIVE CHECK
  =============================== */
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
      });
    } catch (err) {
      console.log("Profile error", err);
    }
  };

  /* ===============================
     LOAD TEAMS
  =============================== */
  const loadTeams = async () => {
    try {
      const res = await api.get("/teams/");
      setTeams(res.data);
    } catch (err) {
      console.log("Teams load error", err);
    }
  };

  /* ===============================
     LOAD TASKS
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
     LOAD PROGRESS
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
     BULK UPLOAD
  =============================== */
  const handleExcelUpload = async (data) => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("file", data.file);

      const uploadRes = await fetch("http://localhost:8000/calls/bulk", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!uploadRes.ok) {
        alert("Excel upload failed");
        return;
      }

      alert("Excel uploaded successfully");
      await loadCustomers();
      await loadProgress();
    } catch {
      alert("Upload error");
    }
  };

  /* ===============================
     UPDATE TASK
  =============================== */
  const handleSaveCall = async (customerData, status, duration, feedback) => {
    try {
      await api.patch(`/calls/${customerData.id}/update`, {
        status: status.toUpperCase().replace(/ /g, "_"),
        duration: duration ? parseInt(duration) : null,
        remarks: feedback
      });

      await loadCustomers();
      await loadProgress();
      alert("Task Updated Successfully");
    } catch (err) {
      console.log("Update error", err);
    }
  };

  /* ===============================
     INITIAL LOAD
  =============================== */
  useEffect(() => {
    loadProfile();
    loadCustomers();
    loadProgress();
    loadTeamInfo();
    loadTeams();

    const interval = setInterval(() => {
      loadCustomers();
      loadProgress();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const filtered = customers.filter((c) =>
    c.customer_name.toLowerCase().includes(search.toLowerCase())
  );

  /* ===============================
     MOBILE OVERLAY
  =============================== */
  const closeSidebar = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  /* ===============================
     UI
  =============================== */
  return (
    <>
      {/* MOBILE MENU BUTTON */}
      {isMobile && (
        <button
          onClick={() => setSidebarOpen(true)}
          style={{
            position: 'fixed',
            top: '20px',
            left: '20px',
            zIndex: 1001,
            background: '#1e293b',
            color: 'white',
            border: 'none',
            padding: '12px',
            borderRadius: '8px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }}
          aria-label="Open menu"
        >
          ☰
        </button>
      )}

      {/* SIDEBAR */}
      <EmployeeSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        isMobile={isMobile}
      />

      {/* MOBILE OVERLAY */}
      {isMobile && sidebarOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.5)',
            zIndex: 998,
            cursor: 'pointer'
          }}
          onClick={closeSidebar}
        />
      )}

      {/* MAIN CONTENT */}
      <div
        style={{
          marginLeft: isMobile ? 0 : "250px",
          width: isMobile ? "100%" : "calc(100% - 240px)",
          minHeight: "100vh",
          background: darkMode ? "#1a202c" : "#f7fafc",
          padding: isMobile ? "80px 20px 20px" : "20px",
          transition: 'margin-left 0.3s ease',
          position: 'relative',
        }}
      >
        <EmployeeHeader closeSidebar={closeSidebar} />

        <div style={{ textAlign: "right", marginBottom: "20px" }}>
          <button 
            onClick={() => setDarkMode(!darkMode)}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid #e2e8f0',
              background: darkMode ? '#334155' : 'white',
              color: darkMode ? 'white' : '#1e293b',
              cursor: 'pointer'
            }}
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>

        {/* DASHBOARD */}
        {activeSection === "dashboard" && (
          <>
            <EmployeeProfile
              name={employeeProfile.name}
              phone={employeeProfile.phone}
            />

            <TeamSection teamData={teamData} darkMode={darkMode} />

            {/* PROGRESS CARDS */}
            <div style={{ 
              display: "flex", 
              gap: "20px", 
              marginBottom: "20px",
              flexWrap: 'wrap'
            }}>
              <Card title="Total" value={progress.total} color="#2563eb" />
              <Card title="Completed" value={progress.completed} color="#16a34a" />
              <Card title="Pending" value={progress.pending} color="#f59e0b" />
            </div>

            <SearchBar value={search} onChange={setSearch} darkMode={darkMode} />

            <div 
              className="customer-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                gap: '20px',
                '@media (max-width: 768px)': {
                  gridTemplateColumns: '1fr'
                }
              }}
            >
              {filtered.map((cust) => (
                <CustomerCard
                  key={cust.id}
                  data={{
                    id: cust.id,
                    name: cust.customer_name,
                    phone: cust.phone,
                    campaign: cust.campaign,
                    assignedDate: cust.start_time?.split("T")[0] || "-",
                    isTeamTask: cust.assigned_to_id !== employeeProfile.id
                  }}
                  onSave={handleSaveCall}
                  darkMode={darkMode}
                />
              ))}
            </div>
          </>
        )}

        {/* ADD CUSTOMER */}
        {activeSection === "addCustomer" && (
          <CustomerForm />
        )}

        {/* BULK UPLOAD */}
        {activeSection === "bulkUpload" && (
          <ExcelUpload
            teams={teams}
            onSubmit={handleExcelUpload}
          />
        )}

        {/* HISTORY */}
        {activeSection === "history" && (
          <div style={{ maxWidth: '1200px' }}>
            <h2 style={{ marginBottom: '20px' }}>📋 Task History</h2>
            <div style={{ 
              overflowX: 'auto',
              borderRadius: '8px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0)'
            }}>
              <table 
                style={{ 
                  width: '100%', 
                  borderCollapse: 'collapse',
                  minWidth: '600px',
                  background: darkMode ? '#334155' : 'white'
                }}
              >
                <thead>
                  <tr style={{ background: '#1e293b' }}>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#fff' }}>Customer</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#fff' }}>Status</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#fff' }}>Duration</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#fff' }}>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {callHistory.map((call) => (
                    <tr 
                      key={call.id}
                      style={{
                        borderBottom: '1px solid #e2e8f0'
                      }}
                    >
                      <td style={{ padding: '12px' }}>{call.customer_name}</td>
                      <td style={{ padding: '12px' }}>{call.status}</td>
                      <td style={{ padding: '12px' }}>{call.duration}</td>
                      <td style={{ padding: '12px' }}>{call.remarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

/* SIMPLE CARD COMPONENT */
const Card = ({ title, value, color }) => (
  <div style={{
    background: `linear-gradient(135deg, ${color}, ${color}cc)`,
    color: "white",
    padding: "20px",
    borderRadius: "12px",
    flex: "1",
    textAlign: "center",
    minWidth: '200px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
  }}>
    <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', opacity: 0.9 }}>{title}</h3>
    <h2 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>{value}</h2>
  </div>
);

export default EmployeeCallingPanel;
