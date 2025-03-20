import { useContext } from 'react';
import { HomePage } from './components/HomePage';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { JournalPage } from './components/JournalPage';
import { ProfilePage } from './components/profilePage';
import AuthProvider, { AuthContext } from "./hooks/useAuth";
import LogoutHandler from './components/logoutHandler';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";


function AppRoutes() {
  const { user, loading, logout  } = useContext(AuthContext);
  const navigate = useNavigate();

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-xl">Loading...</div>;
  }

  return (
    <Routes>
      {/* Public Routes */}
      {!user ? (
        <>
          <Route path="/" element={<HomePage onSignup={() => navigate('/signup')} onLogin={() => navigate('/login')} />} />
          <Route path="/login" element={<LoginPage onBack={() => navigate('/')} onSignup={() => navigate('/signup')} onLogin={() => navigate('/journal')} />} />
          <Route path="/signup" element={<SignupPage onBack={() => navigate('/')} onLogin={() => navigate('/login')} />} />
        </>
      ) : (
        <>
          {/* Private Routes */}
          <Route path="/journal" element={<JournalPage onProfile={() => navigate('/profile')} onLogout={() => navigate('/logout')} />} />
          <Route path="/profile" element={<ProfilePage onBack={() => navigate('/journal')} onLogout={() => navigate('/logout')} />} />
          <Route path="/logout" element={<LogoutHandler />} />
        </>
      )}

      {/* Default fallback to home if route is not found */}
      
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;