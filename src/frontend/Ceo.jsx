import React, { useEffect, useRef, useState } from "react";
import Chart, { Colors } from "chart.js/auto";

import api from "./api";
import { useNavigate } from "react-router-dom";
import "./ceo.css";

function Ceo() {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const performersRef = useRef(null);
  const performersInstance = useRef(null);
  const employeesRef = useRef(null);
  const employeesInstance = useRef(null);
  const trendsRef = useRef(null);
  const trendsInstance = useRef(null);

  const [dashboard, setDashboard] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [calls, setCalls] = useState([]);

  useEffect(() => {
    loadDashboard();
    loadEmployees();
    loadCalls();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await api.get("/dashboard/");
      setDashboard(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");   // make sure your login route is /login
  };

  const loadEmployees = async () => {
    try {
      const res = await api.get("/calls/employees");
      setEmployees(res.data.employees);
    } catch (err) {
      console.log(err);
    }
  };

  const loadCalls = async () => {
    try {
      const res = await api.get("/calls/?limit=20");
      setCalls(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // Existing doughnut chart useEffect
  useEffect(() => {
    if (dashboard && chartRef.current) {
      if (chartInstance.current) chartInstance.current.destroy();

      const status = dashboard.status_distribution || {};

      chartInstance.current = new Chart(chartRef.current, {
        type: "doughnut",
        data: {
          labels: Object.keys(status),
          datasets: [
            {
              data: Object.values(status),
              backgroundColor: [
                "#22c55e",
                "#f59e0b",
                "#3b82f6"

              ]
            }
          ]
        },
        options: {
          plugins: {
            legend: {
              position: "bottom"
            }
          }
        }
      });
    }
  }, [dashboard]);

  // New: Bar chart for top performers
  useEffect(() => {
    if (dashboard?.top_performers && performersRef.current) {
      if (performersInstance.current) performersInstance.current.destroy();

      const data = dashboard.top_performers.slice(0, 5); // Top 5
      performersInstance.current = new Chart(performersRef.current, {
        type: "bar",
        data: {
          labels: data.map(p => p.name),
          datasets: [{
            label: "Completed Calls",
            data: data.map(p => p.completed_calls),
            backgroundColor: "#3b82f6",
            borderRadius: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: { beginAtZero: true }
          }
        }
      });
    }
  }, [dashboard]);

  // New: Horizontal bar for employee assignments (assume employees have 'assigned_calls')
  useEffect(() => {
    if (employees.length && employeesRef.current) {
      if (employeesInstance.current) employeesInstance.current.destroy();

      const data = employees.slice(0, 10); // Top 10
      employeesInstance.current = new Chart(employeesRef.current, {
        type: "bar",
        data: {
          labels: data.map(e => e.name),
          datasets: [{
            label: "Assigned Calls",
            data: data.map(e => e.assigned_calls || 0), // Fallback if field missing
            backgroundColor: "#f59e0b",
            borderRadius: 8
          }]
        },
        options: {
          indexAxis: 'y', // Horizontal bars
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            x: { beginAtZero: true }
          }
        }
      });
    }
  }, [employees]);

  // New: Line chart for calls trend (group calls by date; simplistic example)
  useEffect(() => {
    if (calls.length && trendsRef.current) {
      if (trendsInstance.current) trendsInstance.current.destroy();

      // Mock grouping by date (adapt to call.created_at or similar)
      const dates = [...new Set(calls.map(c => c.created_date || 'Recent').slice(0, 10))];
      const counts = dates.map(date => calls.filter(c => (c.created_date || 'Recent') === date).length);

      trendsInstance.current = new Chart(trendsRef.current, {
        type: "line",
        data: {
          labels: dates,
          datasets: [{
            label: "Calls",
            data: counts,
            borderColor: "#22c55e",
            backgroundColor: "rgba(34, 197, 94, 0.2)",
            tension: 0.4,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: { beginAtZero: true }
          }
        }
      });
    }
  }, [calls]);

  return (
    <div className="crm-container">
      <div className="main-content">
        <div className="top-header">
          <div className="header-text">
            <h1>CEO Dashboard</h1>
            <p>Business performance overview</p>
          </div>

          <button
            onClick={handleLogout}
            className="logout-btn"
          >
            Logout
          </button>
        </div>
        {dashboard && (
          <div className="summary-grid">
            <div className="summary-card blue">
              <h3>Total Calls</h3>
              <p>{dashboard.total_calls}</p>
            </div>
            <div className="summary-card purple" style={{ borderTop: '4px solid #fd2ed3', borderLeft: '4px solid #fd2ed3' }}>
              <h3>Connected</h3>
              <p>{dashboard.completed_calls}</p>
            </div>

            <div className="summary-card orange" style={{ borderTop: '4px solid #f5661f', borderLeft: '4px solid #f5661f' }}>
              <h3 >Pending</h3>
              <p>{dashboard.pending_calls}</p>
            </div>
            <div className="summary-card green">
              <h3>Assigned</h3>
              <p>{dashboard.assigned_calls}</p>
            </div>
            <div className="summary-card red">
              <h3>Unassigned</h3>
              <p>{dashboard.unassigned_calls}</p>
            </div>
            <div className="summary-card yellow">
              <h3>Employees</h3>
              <p>{dashboard.total_employees}</p>
            </div>
          </div>
        )}

        <div className="box">
          <h2>📌 Call Status Distribution</h2>
          <div className="chart-box">
            <canvas ref={chartRef}></canvas>
          </div>
        </div>


        {/* New: Employee Assignments Chart */}


        {/* New: Calls Trend Chart */}

        {/* Existing sections (table versions remain for detail) */}
        {dashboard && (
          <div className="box">
            <h2>🏆 Top Performers</h2>
            <table className="clean-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Completed Calls</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.top_performers.map((p, i) => (
                  <tr key={i}>
                    <td>{p.name}</td>
                    <td>{p.completed_calls}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="box">
          <h2>👥 Employees</h2>
          <table className="clean-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp.id}>
                  <td>{emp.name}</td>
                  <td>{emp.email}</td>
                  <td>{emp.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="box">
          <h2>📞 Recent Calls</h2>
          <table className="clean-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Campaign</th>
              </tr>
            </thead>
            <tbody>
              {calls.map(call => (
                <tr key={call.id}>
                  <td>{call.customer_name}</td>
                  <td>
                    <span className={`status-badge status-${call.status?.toLowerCase()}`}>
                      {call.status}
                    </span>
                  </td>
                  <td>{call.priority}</td>
                  <td>{call.campaign}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Ceo;
