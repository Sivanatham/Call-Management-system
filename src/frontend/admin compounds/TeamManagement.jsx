import React, { useEffect, useState } from "react";
import { Users, Plus, UserPlus } from "lucide-react";

const TeamManagement = () => {
  const token = localStorage.getItem("token");

  const [teams, setTeams] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [teamName, setTeamName] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================
  // Fetch Teams
  // =========================
  const fetchTeams = async () => {
    try {
      const res = await fetch("http://localhost:8000/teams/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setTeams(data);
      } else {
        console.log("Team fetch error:", data);
      }
    } catch (err) {
      console.log("Team fetch failed:", err);
    }
  };

  // =========================
  // Fetch Employees
  // =========================
  const fetchEmployees = async () => {
    try {
      const res = await fetch("http://localhost:8000/calls/employees", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setEmployees(data.employees);
      } else {
        console.log("Employee fetch error:", data);
      }
    } catch (err) {
      console.log("Employee fetch failed:", err);
    }
  };

  useEffect(() => {
    fetchTeams();
    fetchEmployees();
  }, [token]);

  // =========================
  // Create Team
  // =========================
  const handleCreateTeam = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/teams/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: teamName }),
      });

      const data = await res.json();

      if (res.ok) {
        setTeamName("");
        fetchTeams();
      } else {
        alert(data.detail);
      }
    } catch (err) {
      console.log("Create team error:", err);
    }

    setLoading(false);
  };

  // =========================
  // Assign Employee
  // =========================
  const handleAssignEmployee = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/teams/assign", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          team_id: selectedTeam,
          employee_id: selectedEmployee,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Employee Assigned Successfully ✅");
        setSelectedTeam("");
        setSelectedEmployee("");
      } else {
        alert(data.detail);
      }
    } catch (err) {
      console.log("Assign error:", err);
    }

    setLoading(false);
  };

  return (
    <div className="glass-effect rounded-xl p-6 border border-gray-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-500 text-white rounded-lg">
          <Users size={24} />
        </div>
        <h3 className="text-xl font-bold text-gray-900">
          Team Management
        </h3>
      </div>

      {/* ================= Create Team ================= */}
      <div className="mb-8">
        <h4 className="font-semibold mb-3">Create Team</h4>
        <form onSubmit={handleCreateTeam} className="flex gap-3">
          <input
            type="text"
            placeholder="Enter Team Name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            required
            className="form-input flex-1"
          />
          <button type="submit" className="btn-primary" disabled={loading}>
            <Plus size={18} className="inline mr-2" />
            Create
          </button>
        </form>
      </div>

      {/* ================= Assign Employee ================= */}
      <div className="mb-8">
        <h4 className="font-semibold mb-3">
          Assign Employee to Team
        </h4>
        <form
          onSubmit={handleAssignEmployee}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            required
            className="form-input"
          >
            <option value="">-- Select Team --</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>

          <select
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            required
            className="form-input"
          >
            <option value="">-- Select Employee --</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="btn-success md:col-span-2"
            disabled={loading}
          >
            <UserPlus size={18} className="inline mr-2" />
            Assign
          </button>
        </form>
      </div>

      {/* ================= Team List ================= */}
      <div>
        <h4 className="font-semibold mb-3">Teams Overview</h4>
        {teams.length === 0 ? (
          <p>No teams created yet.</p>
        ) : (
          teams.map((team) => (
            <div
              key={team.id}
              className="bg-gray-100 p-3 rounded mb-2"
            >
              <strong>{team.name}</strong>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TeamManagement;