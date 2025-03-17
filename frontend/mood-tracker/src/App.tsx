import { useState } from 'react';
import { HomePage } from './components/HomePage.tsx';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { JournalPage } from './components/JournalPage.tsx';

type Page = 'home' | 'login' | 'signup' | 'journal';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentPage('journal');
  };

  const renderCurrentPage = () => {
    if (isAuthenticated && currentPage === 'journal') {
      return <JournalPage onLogout={() => {
        setIsAuthenticated(false);
        setCurrentPage('home');
      }} />;
    }

    switch (currentPage) {
      case 'login':
        return <LoginPage onBack={() => setCurrentPage('home')} onSignup={() => setCurrentPage('signup')} onLogin={handleLogin} />;
      case 'signup':
        return <SignupPage onBack={() => setCurrentPage('home')} onLogin={() => setCurrentPage('login')} />;
      default:
        return <HomePage onLogin={() => setCurrentPage('login')} onSignup={() => setCurrentPage('signup')} />;
    }
  };

  return renderCurrentPage();
}

export default App;