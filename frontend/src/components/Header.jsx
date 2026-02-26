import lightLogo from "../assets/coqui-logo-light.png";
import darkLogo from "../assets/coqui-logo-dark.png";

export default function Header({ userRole, darkMode, setDarkMode, onOpenSalesDashboard, onLogoClick, onOpenAIAssistant, onProceedToPayment, onOpenTickets, onOpenVoidLog }) {
  return (
    <div className="header">
      <img
        src={darkLogo}
        alt="Coquí Logo"
        className="logo-small clickable"
        onClick={onLogoClick}
        title="Back to Home"
      />

      <div className="header-right">
        <span className="role-badge">
          {userRole === "Manager" ? "👔" : "🧑‍💼"} {userRole}
        </span>
        
        {/* AI Assistant Button */}
        <button 
          onClick={onOpenAIAssistant}
        >
          🐸 AI Assistant
        </button>
        
        {/* Sales Dashboard Button (Manager Only) */}
        {userRole === "Manager" && (
          <button 
            className="sales-dashboard-btn"
            onClick={onOpenSalesDashboard}
          >
            📊 Sales
          </button>
        )}
        
        {/* Void Log Button (Manager Only) */}
        {userRole === "Manager" && (
          <button onClick={onOpenVoidLog}>
            🚫 Void Log
          </button>
        )}
        
        {/* Kitchen Tickets Button */}
        <button onClick={onOpenTickets}>
          🎫 Tickets
        </button>
        
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
        <button className="payment-header-btn" onClick={onProceedToPayment}>
          💳 Payment
        </button>
      </div>
    </div>
  );
}
