import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./frontend/login";
import Employee from "./frontend/EmployeeCallingPanel";
import Manager from "./frontend/Admin";
import Chief from "./frontend/Ceo";
import ProtectedRoute from "../src/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route
          path="/employee"
          element={
            <ProtectedRoute role="employee">
              <Employee />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manager"
          element={
            <ProtectedRoute role="manager">
              <Manager />
            </ProtectedRoute>
          }
        />

        <Route
          path="/chief"
          element={
            <ProtectedRoute role="chief">
              <Chief />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;