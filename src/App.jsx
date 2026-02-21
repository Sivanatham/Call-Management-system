import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import EmployeeCallingPanel from "./frontend/EmployeeCallingPanel";
import Ceo from "./frontend/Ceo";
import AdminPanel from "./frontend/Admin";
import Login from "./frontend/login";

function App() {
  const [userRole, setUserRole] = useState(null);

  // 🔥 Restore role after refresh
  useEffect(() => {
    const savedRole = localStorage.getItem("role");
    if (savedRole) {
      setUserRole(savedRole);
    }
  }, []);

  return (
    <Router>
      <Routes>

        <Route
          path="/"
          element={<Login setUserRole={setUserRole} />}
        />

        <Route
          path="/employee"
          element={
            userRole === "employee"
              ? <EmployeeCallingPanel />
              : <Navigate to="/" />
          }
        />

        <Route
          path="/manager"
          element={
            userRole === "manager"
              ? <AdminPanel />
              : <Navigate to="/" />
          }
        />

        <Route
          path="/chief"
          element={
            userRole === "chief"
              ? <Ceo />
              : <Navigate to="/" />
          }
        />

      </Routes>
    </Router>
  );
}

export default App;