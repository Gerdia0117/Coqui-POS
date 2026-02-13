import Header from "./Header";

export default function POSScreen({
  userRole,
  darkMode,
  setDarkMode,
  onLogout
}) {
  return (
    <div className={`pos-page ${darkMode ? "dark" : ""}`}>
      <Header
        userRole={userRole}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onLogout={onLogout}
      />

      <div className="pos-content">
        <h2>Main POS Area</h2>
        <p>Orders will appear here.</p>
      </div>
    </div>
  );
}