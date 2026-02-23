import React, { useEffect, useState } from "react";
import { Users, Plus, UserPlus } from "lucide-react";

const TeamManagement = ({ teams, employees }) => {
  const token = localStorage.getItem("token");



  const [teamName, setTeamName] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState([]); // 🔥 array now
  const [loading, setLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // =========================
  // Fetch Teams
  // =========================
  const fetchTeams = async () => {
    const res = await fetch("http://localhost:8000/teams/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok) setTeams(data);
  };


  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  // =========================
  // Fetch Employees
  // =========================


  // =========================
  // Create Team
  // =========================
  const handleCreateTeam = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("http://localhost:8000/teams/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: teamName }),
    });

    if (res.ok) {
      setTeamName("");
      fetchTeams();
    }

    setLoading(false);
  };

  // =========================
  // Checkbox Toggle
  // =========================
  const toggleEmployee = (id) => {
    setSelectedEmployees((prev) =>
      prev.includes(id)
        ? prev.filter((empId) => empId !== id)
        : [...prev, id]
    );
  };

  // =========================
  // Assign Multiple Employees
  // =========================
  const handleAssignEmployee = async (e) => {
    e.preventDefault();

    if (!selectedTeam || selectedEmployees.length === 0) {
      alert("Select team and employees");
      return;
    }

    setLoading(true);

    try {
      for (const empId of selectedEmployees) {
        await fetch("http://localhost:8000/teams/assign", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            team_id: selectedTeam,
            employee_id: empId,
          }),
        });
      }

      alert("Employees Assigned Successfully ✅");
      setSelectedEmployees([]);
      setSelectedTeam("");
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  return (
    <div className="glass-effect rounded-xl p-4 sm:p-6 border border-gray-200 w-full max-w-5xl mx-auto">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-600 text-white rounded-lg">
          <Users size={22} />
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-gray-900">
          Team Management
        </h3>
      </div>

      {/* Responsive Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* ================= Create Team ================= */}
        <div>
          <h4 className="font-semibold mb-3 text-gray-800">Create Team</h4>

          <form
            onSubmit={handleCreateTeam}
            className="flex flex-col sm:flex-row gap-3"
          >
            <input
              type="text"
              placeholder="Enter Team Name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              required
              className="form-input w-full"
            />

            <button
              type="submit"
              className="btn-primary w-full sm:w-auto"
              disabled={loading}
            >
              <Plus size={18} className="inline mr-2" />
              Create
            </button>
          </form>
        </div>

        {/* ================= Assign Employees ================= */}
        <div>
          <h4 className="font-semibold mb-3 text-gray-800">
            Assign Employees
          </h4>

          <form onSubmit={handleAssignEmployee}>

            {/* Team Select */}
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              required
              className="form-input mb-4 w-full"
            >
              <option value="">-- Select Team --</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>

            {/* Employee Multi Dropdown */}
            <div className="relative mb-4 w-full">

  {/* Dropdown Trigger - SAME STYLE AS SELECT TEAM */}
  <div
    className="form-input w-full flex justify-between items-center cursor-pointer"
    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
  >
    <span className="text-gray-700">
      {selectedEmployees.length === 0
        ? "Select Employees"
        : `${selectedEmployees.length} Selected`}
    </span>

    <span className="text-gray-500">▾</span>
  </div>

  {isDropdownOpen && (
    <div className="absolute z-50 bg-white border border-gray-300 rounded-md mt-2 w-full shadow-lg">

      <input
        type="text"
        placeholder="Search employee..."
        className="w-full px-3 py-2 border-b outline-none"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="max-h-60 overflow-y-auto">
        {filteredEmployees.length === 0 ? (
          <p className="p-3  text-gray-500">No employees found</p>
        ) : (
          filteredEmployees.map((emp) => (
            <label
              key={emp.id}
              className="flex items-center gap-3 px-3 py-2 hover:bg-blue-50 cursor-pointer text-gray-800"
            >
              <input
                type="checkbox"
                className="accent-blue-600 w-4 h-4"
                checked={selectedEmployees.includes(emp.id)}
                onChange={() => toggleEmployee(emp.id)}
              />
              {emp.name}
            </label>
          ))
        )}
      </div>
    </div>
  )}
</div>

            <button
              type="submit"
              className="btn-success w-full"
              disabled={loading}
            >
              <UserPlus size={18} className="inline mr-2" />
              Assign Selected
            </button>
          </form>
        </div>
      </div>

      {/* ================= Teams Overview ================= */}
      <div className="mt-10">
        <h4 className="font-semibold mb-4 text-gray-800">
          Teams Overview
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {teams.map((team) => (
            <div
              key={team.id}
              className="bg-white shadow-md hover:shadow-lg transition p-4 rounded-xl border"
            >
              <strong className="text-gray-800 text-sm sm:text-base">
                {team.name}
              </strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamManagement;