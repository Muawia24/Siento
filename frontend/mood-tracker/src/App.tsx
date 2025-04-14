import { useContext } from 'react';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { JournalPage } from './pages/JournalPage';
import { ProfilePage } from './pages/profilePage';
import AuthProvider, { AuthContext } from "./hooks/useAuth";
import LogoutHandler from './components/logoutHandler';
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";


function AppRoutes() {
  const { user, loading } = useContext(AuthContext);
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
          <Route path="/signup" element={<SignupPage onBack={() => navigate('/')} onLogin={() => navigate('/login')} onRegister={() => navigate('/journal')} />} />
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