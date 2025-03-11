import { useState } from 'react';
import { HomePage } from './components/HomePage.tsx';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';

type Page = 'home' | 'login' | 'signup';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage onBack={() => setCurrentPage('home')} onSignup={() => setCurrentPage('signup')} />;
      case 'signup':
        return <SignupPage onBack={() => setCurrentPage('home')} onLogin={() => setCurrentPage('login')} />;
      default:
        return <HomePage onLogin={() => setCurrentPage('login')} onSignup={() => setCurrentPage('signup')} />;
    }
  };

  return renderCurrentPage();
}

export default App;