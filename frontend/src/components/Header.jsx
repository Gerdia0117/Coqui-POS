import lightLogo from "../assets/coqui-logo-light.png";
import darkLogo from "../assets/coqui-logo-dark.png";

export default function Header({ userRole, darkMode, setDarkMode, onLogout, onOpenSalesDashboard, onLogoClick }) {
  return (
    <div className="header">
      <img
        src={darkMode ? darkLogo : lightLogo}
        alt="Coquí Logo"
        className="logo-small clickable"
        onClick={onLogoClick}
        title="Back to Home"
      />

      <div className="header-right">
        <span>Role: {userRole}</span>
        
        {/* Sales Dashboard Button (Manager Only) */}
        {userRole === "Manager" && (
          <button 
            className="sales-dashboard-btn"
            onClick={onOpenSalesDashboard}
          >
            📊 Sales
          </button>
        )}
        
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
        <button onClick={onLogout}>Logout</button>
      </div>
    </div>
  );
}
