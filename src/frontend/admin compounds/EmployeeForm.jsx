import React, { useEffect, useState } from "react";

const EmployeeForm = () => {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const token = localStorage.getItem("token");

  // =========================
  // Fetch Employees
  // =========================
  const fetchEmployees = async () => {
    const res = await fetch("http://localhost:8000/calls/employees", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setEmployees(data.employees || []);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // =========================
  // Handle Form Change
  // =========================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // Create Employee
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(
      "http://localhost:8000/auth/create-employee",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.detail);
      return;
    }

    alert("Employee Created ✅");

    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
    });

    fetchEmployees();
  };

  // =========================
  // Delete Employee
  // =========================
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    const res = await fetch(
      `http://localhost:8000/auth/delete-employee/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.ok) {
      alert("Employee Deleted ❌");
      fetchEmployees();
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>👨‍💼 Employee Management Panel</h2>

      {/* ================= Add Employee Form ================= */}
      <div style={cardStyle}>
        <h3>Add Employee</h3>
        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <input
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <input
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <button type="submit" style={buttonStyle}>
            Add Employee
          </button>
        </form>
      </div>

      {/* ================= Employee List ================= */}
      <div style={cardStyle}>
        <h3>Employee List</h3>

        <table width="100%" border="1" cellPadding="10">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id}>
                <td>{emp.id}</td>
                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>{emp.phone}</td>
                <td>
                  <button
                    onClick={() => handleDelete(emp.id)}
                    style={{ background: "red", color: "white" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const cardStyle = {
  background: "#f9fafb",
  padding: "20px",
  marginTop: "20px",
  borderRadius: "10px",
};

const inputStyle = {
  display: "block",
  width: "100%",
  marginBottom: "10px",
  padding: "8px",
};

const buttonStyle = {
  padding: "10px 15px",
  background: "#2563eb",
  color: "white",
  border: "none",
};

export default EmployeeForm;