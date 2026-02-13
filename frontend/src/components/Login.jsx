import { useState } from "react";
import lightLogo from "../assets/coqui-logo-light.png";
import darkLogo from "../assets/coqui-logo-dark.png";

export default function Login({ onLogin, darkMode, setDarkMode }) {
  const [role, setRole] = useState("employee");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (role === "manager" && password === "admin123") {
      onLogin("Manager");
    } else if (role === "employee" && password === "employee123") {
      onLogin("Employee");
    } else {
      alert("Incorrect password 🐸");
    }
  };

  return (
    <div className={`login-page ${darkMode ? "dark" : ""}`}>
      <div className="login-card">
        <img
          src={darkMode ? darkLogo : lightLogo}
          alt="Coquí Logo"
          className="logo"
        />

        <h2>Welcome to Coquí POS</h2>
        <p className="subtitle">
          Puerto Rico's Smart Restaurant System 🐸
        </p>

        <select onChange={(e) => setRole(e.target.value)}>
          <option value="employee">Employee</option>
          <option value="manager">Manager</option>
        </select>

        <input
          type="password"
          placeholder="Enter password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>Login</button>

        <div className="toggle">
          <label>
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
            Dark Mode
          </label>
        </div>
      </div>
    </div>
  );
}
