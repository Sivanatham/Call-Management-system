import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const response = await fetch("http://localhost:8000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        username: email,   // MUST be username (even if it's email)
        password: password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.detail || "Invalid credentials");
      return;
    }

    // Save token
    localStorage.setItem("token", data.access_token);
    localStorage.setItem("role", data.user.role);

    // Navigate by role
    if (data.user.role === "employee") {
      navigate("/employee", { replace: true });
    } else if (data.user.role === "manager") {
      navigate("/manager", { replace: true });
    } else if (data.user.role === "chief") {
      navigate("/chief", { replace: true });
    }

  } catch (err) {
    setError("Server error. Make sure backend is running.");
  }
};

  return (
    <div className="main-container">
      <div className="login-wrapper">
        
        <div className="left-panel">
          <h1>Welcome back!</h1>
          <p>You can sign in to access your existing account.</p>
        </div>

        <div className="right-panel">
          <h2>Sign In</h2>

          {error && <p className="error">{error}</p>}

          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit">Sign In</button>
          </form>
        </div>

      </div>
    </div>
  );
}

export default Login;