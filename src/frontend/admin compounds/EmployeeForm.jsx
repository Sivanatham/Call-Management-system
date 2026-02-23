import React, { useEffect, useState } from "react";

const EmployeeForm = () => {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const token = localStorage.getItem("token");

  // Resize handler for perfect responsiveness
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;

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
    <div style={containerStyle(isMobile)}>
      <div style={contentAreaStyle(isMobile)}>
        <h2 style={titleStyle(isMobile)}>👨‍💼 Employee Management Panel</h2>

        {/* ================= Add Employee Form ================= */}
        <div style={cardStyle(isMobile)}>
          <h3 style={sectionTitleStyle(isMobile)}>Add Employee</h3>
          <form onSubmit={handleSubmit} style={formStyle}>
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
  onChange={(e) => {
    const value = e.target.value.replace(/\D/g, ""); // remove non-digits
    if (value.length <= 10) {
      setFormData({ ...formData, phone: value });
    }
  }}
  maxLength={10}
  inputMode="numeric"
  pattern="\d{10}"
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
        <div style={cardStyle(isMobile)}>
          <h3 style={sectionTitleStyle(isMobile)}>Employee List</h3>
          
          {isMobile ? (
            // MOBILE: Perfect card layout - NO OVERFLOW
            <div style={mobileListStyle}>
              {employees.map((emp) => (
                <div key={emp.id} style={employeeCardStyle}>
                  <div style={employeeInfoStyle}>
                    <div style={idBadgeStyle}>ID: {emp.id}</div>
                    <div style={employeeNameStyle}>{emp.name}</div>
                    <div style={emailStyle}>{emp.email}</div>
                    <div style={phoneStyle}>{emp.phone}</div>
                  </div>
                  <button
                    onClick={() => handleDelete(emp.id)}
                    style={deleteButtonMobileStyle}
                  >
                    🗑️ Delete
                  </button>
                </div>
              ))}
            </div>
          ) : (
            // DESKTOP: Table layout
            <div style={tableContainerStyle}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={headerCellStyle}>ID</th>
                    <th style={headerCellStyle}>Name</th>
                    <th style={headerCellStyle}>Email</th>
                    <th style={headerCellStyle}>Phone</th>
                    <th style={headerCellStyle}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => (
                    <tr key={emp.id}>
                      <td style={cellStyle}>{emp.id}</td>
                      <td style={cellStyle}>{emp.name}</td>
                      <td style={cellStyle}>{emp.email}</td>
                      <td style={cellStyle}>{emp.phone}</td>
                      <td style={actionCellStyle}>
                        <button
                          onClick={() => handleDelete(emp.id)}
                          style={deleteButtonDesktopStyle}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// PERFECT RESPONSIVE STYLES
const containerStyle = (isMobile) => ({
  minHeight: "100vh",
  backgroundColor: "#f9fafb",
  padding: isMobile ? "10px" : "0",
  width: "100%",
  boxSizing: "border-box",
});

const contentAreaStyle = (isMobile) => ({
  maxWidth: "100%",
  margin: "0 auto",
  padding: isMobile ? "15px 10px" : "30px",
  width: "100%",
  boxSizing: "border-box",
});

const titleStyle = (isMobile) => ({
  fontSize: isMobile ? "1.5rem" : "2.2rem",
  marginBottom: "25px",
  textAlign: "center",
  color: "#1f2937",
  fontWeight: "bold",
});

const cardStyle = (isMobile) => ({
  backgroundColor: "white",
  padding: isMobile ? "20px 15px" : "30px 25px",
  marginBottom: "25px",
  borderRadius: "16px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  border: "1px solid #e5e7eb",
});

const sectionTitleStyle = (isMobile) => ({
  margin: "0 0 25px 0",
  color: "#1f2937",
  fontSize: isMobile ? "1.2rem" : "1.5rem",
  fontWeight: "700",
});

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "15px",
};

const inputStyle = {
  width: "100%",
  padding: "16px 18px",
  border: "2px solid #e5e7eb",
  borderRadius: "12px",
  fontSize: "16px",
  boxSizing: "border-box",
  backgroundColor: "white",
};

const buttonStyle = {
  padding: "16px 24px",
  background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
  color: "white",
  border: "none",
  borderRadius: "12px",
  fontSize: "16px",
  fontWeight: "600",
  cursor: "pointer",
};

// MOBILE ONLY - Cards (100% width, NO overflow)
const mobileListStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "15px",
};

const employeeCardStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  padding: "20px",
  backgroundColor: "#f8fafc",
  borderRadius: "12px",
  border: "1px solid #e5e7eb",
};

const employeeInfoStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  width: "100%",
};

const idBadgeStyle = {
  backgroundColor: "#dbeafe",
  color: "#1e40af",
  padding: "6px 12px",
  borderRadius: "20px",
  fontSize: "13px",
  fontWeight: "600",
  alignSelf: "flex-start",
  width: "fit-content",
};

const employeeNameStyle = {
  fontSize: "18px",
  fontWeight: "700",
  color: "#1f2937",
};

const emailStyle = {
  fontSize: "15px",
  color: "#6b7280",
  wordBreak: "break-all",
};

const phoneStyle = {
  fontSize: "15px",
  color: "#6b7280",
};

const deleteButtonMobileStyle = {
  alignSelf: "flex-end",
  padding: "12px 24px",
  backgroundColor: "#dc2626",
  color: "white",
  border: "none",
  borderRadius: "10px",
  fontSize: "15px",
  fontWeight: "600",
  cursor: "pointer",
  width: "fit-content",
};

// DESKTOP ONLY - Table
const tableContainerStyle = {
  overflowX: "auto",
  borderRadius: "12px",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  backgroundColor: "white",
  minWidth: "600px",
};

const headerCellStyle = {
  padding: "18px 16px",
  textAlign: "left",
  fontWeight: "700",
  fontSize: "15px",
  color: "#374151",
  backgroundColor: "#f8fafc",
  borderBottom: "2px solid #e2e8f0",
};

const cellStyle = {
  padding: "18px 16px",
  fontSize: "15px",
  borderBottom: "1px solid #f1f5f9",
};

const actionCellStyle = {
  padding: "18px 16px",
  whiteSpace: "nowrap",
};

const deleteButtonDesktopStyle = {
  padding: "10px 18px",
  backgroundColor: "#dc2626",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: "600",
  cursor: "pointer",
};

export default EmployeeForm;
