import lightLogo from "../assets/coqui-logo-light.png";
import darkLogo from "../assets/coqui-logo-dark.png";

export default function Header({ userRole, darkMode, setDarkMode, onLogout }) {
  return (
    <div className="header">
      <img
        src={darkMode ? darkLogo : lightLogo}
        alt="Coquí Logo"
        className="logo-small"
      />

      <div className="header-right">
        <span>Role: {userRole}</span>
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
        <button onClick={onLogout}>Logout</button>
      </div>
    </div>
  );
}