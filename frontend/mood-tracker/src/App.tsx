import { useContext } from 'react';
import { HomePage } from './components/HomePage.tsx';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { JournalPage } from './components/JournalPage.tsx';
import AuthProvider, { AuthContext } from "./hooks/useAuth";
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
          <Route path="/signup" element={<SignupPage onBack={() => navigate('/')} onLogin={() => navigate('/login')} /> } />
        </>
      ) : (
        <>
          {/* Private Routes */}
          <Route path="/journal" element={<JournalPage onLogout={logout}/>} />
          <Route path="*" element={<Navigate to="/journal" />} />
        </>
      )}

      {/* Default fallback to home if route is not found */}
      <Route path="*" element={<Navigate to="/" />} />
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