import { useState } from 'react';
import Login from './components/Login';
import DashboardLayout from './components/Dashboard/DashboardLayout';
import { HealthProvider } from './context/HealthContext';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <HealthProvider>
      {user ? (
        <DashboardLayout user={user} onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </HealthProvider>
  );
}

export default App;
