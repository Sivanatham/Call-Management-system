import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import api from "./api";
import "./ceo.css";

function Ceo() {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

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
                "#ef4444",
                "#3b82f6",
                "#f59e0b"
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

  return (
    <div className="crm-container">

      {/* SIDEBAR */}
      <div className="sidebar">
        <h2>📊 CMS</h2>
        <a className="active">Dashboard</a>
        <a>Employees</a>
        <a>Calls</a>
        <a>Reports</a>
      </div>

      {/* MAIN */}
      <div className="main-content">

        <div className="top-header">
          <h1>CEO Dashboard</h1>
          <p>Business performance overview</p>
        </div>

        {/* SUMMARY CARDS */}
        {dashboard && (
          <div className="summary-grid">
            <div className="summary-card blue">
              <h3>Total Calls</h3>
              <p>{dashboard.total_calls}</p>
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

        {/* CHART */}
        <div className="box">
          <h2>📌 Call Status Distribution</h2>
          <div className="chart-box">
            <canvas ref={chartRef}></canvas>
          </div>
        </div>

        {/* TOP PERFORMERS */}
        {dashboard && (
          <div className="box">
            <h2>🏆 Top Performers</h2>
            <table>
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

        {/* EMPLOYEES */}
        <div className="box">
          <h2>👥 Employees</h2>
          <table>
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

        {/* CALL HISTORY */}
        <div className="box">
          <h2>📞 Recent Calls</h2>
          <table>
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