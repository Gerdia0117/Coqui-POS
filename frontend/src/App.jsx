import { useState } from "react";
import Login from "./components/Login";
import POSScreen from "./components/POSScreen";

function App() {
  const [userRole, setUserRole] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  if (!userRole) {
    return (
      <Login
        onLogin={setUserRole}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
    );
  }

  return (
    <POSScreen
      userRole={userRole}
      darkMode={darkMode}
      setDarkMode={setDarkMode}
      onLogout={() => setUserRole(null)}
    />
  );
}

export default App;
