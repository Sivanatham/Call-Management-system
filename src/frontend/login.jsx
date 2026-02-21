import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login({ setUserRole }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || "Login failed");
        return;
      }

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("role", data.user.role);

      setUserRole(data.user.role);

      if (data.user.role === "employee") navigate("/employee");
      else if (data.user.role === "manager") navigate("/manager");
      else if (data.user.role === "chief") navigate("/chief");

    } catch {
      setError("Server error. Make sure backend is running.");
    }
  };

  return (
    <div className="main-container">
      <div className="login-wrapper">

        {/* LEFT SIDE */}
        <div className="left-panel">
          <h1>Welcome back!</h1>
          <p>You can sign in to access your existing account.</p>
        </div>

        {/* RIGHT SIDE */}
        <div className="right-panel">
          <h2>Sign In</h2>

          {error && <p className="error">{error}</p>}

          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Username or email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit">Sign In</button>
          </form>

        </div>
      </div>
    </div>
  );
}

export default Login;