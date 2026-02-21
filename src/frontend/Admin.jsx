import React, { useState, useEffect } from "react";
import "./admincss.css";
import Sidebar from "./admin compounds/Sidebar.jsx";
import DashboardCards from "./admin compounds/DashboardCards.jsx";
import DashboardCharts from "./admin compounds/DashboardCharts.jsx";
import EmployeeForm from "./admin compounds/EmployeeForm.jsx";
import TasksTable from "./admin compounds/TasksTable.jsx";
import TeamManagement from "./admin compounds/TeamManagement.jsx";
import AssignCustomers from "./admin compounds/AssignCustomers.jsx";
import ReassignCustomer from "./admin compounds/ReassignCustomer.jsx";
import ExcelUpload from "./admin compounds/ExcelUpload.jsx";
import ClearHistory from "./admin compounds/ClearHistory.jsx";
import api from "./api";
import CustomerForm from "./admin compounds/CustomerForm.jsx";

const AdminPanel = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [customers, setCustomers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [teams, setTeams] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    total_calls: 0,
    assigned_calls: 0,
    unassigned_calls: 0,
    completed_calls: 0,
    pending_calls: 0,
    total_employees: 0
  });

  // ===============================
  // LOAD FUNCTIONS
  // ===============================

  const loadDashboard = async () => {
    try {
      const res = await api.get("/dashboard/");
      setDashboardStats(res.data);
    } catch (err) {
      console.error("Dashboard load error:", err);
    }
  };

  const handleAddCustomer = async (data) => {
  try {
    await api.post("/calls/", data);
    await loadCustomers();
    await loadDashboard();
    alert("Customer added successfully");
  } catch (err) {
    alert("Failed to add customer");
  }
};
  const loadCustomers = async () => {
    try {
      const res = await api.get("/calls/");
      setCustomers(
        res.data.map(call => ({
          id: call.id,
          name: call.customer_name,
          phone: call.phone,
          status: call.status
        }))
      );
    } catch (err) {
      console.error("Customer load error:", err);
    }
  };

  const loadTeams = async () => {
    try {
      const res = await api.get("/teams/");
      setTeams(res.data);
    } catch (err) {
      console.error("Teams load error:", err);
    }
  };

  const loadEmployees = async () => {
    try {
      const res = await api.get("/calls/employees");
      setEmployees(res.data.employees);
    } catch (err) {
      console.error("Employees load error:", err);
    }
  };

  // ===============================
  // INITIAL LOAD
  // ===============================

  useEffect(() => {
    loadTeams();
    loadEmployees();
  }, []);

  // Load customers when section changes
  useEffect(() => {
    if (activeSection !== "dashboard") {
      loadCustomers();
    }
  }, [activeSection]);

  // Load dashboard when dashboard section active
  useEffect(() => {
    if (activeSection === "dashboard") {
      loadDashboard();
    }
  }, [activeSection]);

  // Auto refresh dashboard every 5 seconds
  useEffect(() => {
    if (activeSection !== "dashboard") return;

    const interval = setInterval(() => {
      loadDashboard();
    }, 5000);

    return () => clearInterval(interval);
  }, [activeSection]);

  // ===============================
  // STATS
  // ===============================

  const stats = {
    customers: dashboardStats.total_calls,
    employees: dashboardStats.total_employees,
    teams: teams.length,
    completionRate:
      dashboardStats.total_calls > 0
        ? Math.round(
            (dashboardStats.completed_calls /
              dashboardStats.total_calls) *
              100
          )
        : 0,
    assigned: dashboardStats.assigned_calls,
    unassigned: dashboardStats.unassigned_calls,
    completed: dashboardStats.completed_calls,
    pending: dashboardStats.pending_calls
  };

  // ===============================
  // ACTION HANDLERS
  // ===============================

  const handleAddEmployee = async (data) => {
    try {
      await api.post("/auth/register", data);
      await loadEmployees();
      await loadDashboard();
      alert("Employee created successfully");
    } catch (err) {
      alert("Failed to create employee");
    }
  };
  
  const handleAssignCustomers = async (teamId, customerIds) => {
    try {
      for (const callId of customerIds) {
        await api.post("/teams/assign-task", {
          team_id: parseInt(teamId),
          call_id: callId
        });
      }

      await loadCustomers();
      await loadDashboard();

      alert("Tasks assigned successfully");
    } catch {
      alert("Assignment failed");
    }
  };

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

      const callsRes = await api.get("/calls/");
      const calls = callsRes.data;

      for (const call of calls) {
        if (!call.assigned_to_id) {
          await api.post("/teams/assign-task", {
            team_id: parseInt(data.teamId),
            call_id: call.id
          });
        }
      }

      await loadCustomers();
      await loadDashboard();

      alert("Excel uploaded and tasks assigned!");
    } catch {
      alert("Upload failed");
    }
  };

  // ===============================
  // RENDER
  // ===============================

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        isMobileMenuOpen={isMobileMenuOpen}
        onMobileMenuToggle={() =>
          setIsMobileMenuOpen(!isMobileMenuOpen)
        }
      />

      <main className="flex-1 p-6 lg:ml-64">
        {activeSection === "dashboard" && (
          <>
            <DashboardCards stats={stats} />
            <DashboardCharts stats={stats} />
          </>
        )}

        {activeSection === "employees" && (
          <div className="space-y-6">
            <EmployeeForm onSubmit={handleAddEmployee} />
            <TeamManagement
              teams={teams}
              employees={employees}
              onAddMember={() => loadEmployees()}
            />
            <ExcelUpload
              teams={teams}
              onSubmit={handleExcelUpload}
            />
          </div>
        )}
              {activeSection === "addCustomer" && (
        <div className="space-y-6">
          <CustomerForm onSubmit={handleAddCustomer} />
        </div>
      )}
        {activeSection === "completed" && (
          <TasksTable status="CONNECTED" title="Completed Tasks" />
        )}

        {activeSection === "pending" && (
          <TasksTable status="PENDING" title="Pending Tasks" />
        )}

        {activeSection === "reassign" && (
          <div className="space-y-6">
            <AssignCustomers
              customers={customers}
              teams={teams}
              onSubmit={handleAssignCustomers}
            />
            <ExcelUpload
              teams={teams}
              onSubmit={handleExcelUpload}
            />
            <ClearHistory />
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;