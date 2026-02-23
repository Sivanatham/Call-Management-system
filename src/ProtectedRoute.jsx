import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const savedRole = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (role && savedRole !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;