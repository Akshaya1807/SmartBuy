import { useState } from "react";
import "./App.css";

import Auth from "./components/auth";
import Dashboard from "./components/Dashboard";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  // Logout function must be inside App()
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <div className="app">
      <nav className="navbar">
        <h1>SmartBuy</h1>

        {isLoggedIn && (
          <button onClick={handleLogout}>Logout</button>
        )}
      </nav>

      {isLoggedIn ? (
        <Dashboard />
      ) : (
        <Auth onLogin={() => setIsLoggedIn(true)} />
      )}
    </div>
  );
}

export default App;