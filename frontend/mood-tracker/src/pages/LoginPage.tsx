import React, { useState, useContext } from 'react';
import { Brain, Mail, KeyRound } from 'lucide-react';
import { InputField } from '../components/InputField';
import { AuthContext } from '../hooks/useAuth';

interface LoginPageProps {
  onBack: () => void;
  onSignup: () => void;
  onLogin: () => void;
  onForgotPassword: () => void; 
}

export function LoginPage({ onBack, onSignup, onLogin, onForgotPassword }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    try{
      await login(email, password);
      onLogin();
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid email or password.");
    }
  
    console.log('Login:', { email, password });
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80")'
        }}
      />
      <div className="absolute inset-0 bg-purple-900/30 backdrop-blur-[2px]" />
      
      <div className="max-w-md w-full space-y-8 bg-white/95 p-8 rounded-xl shadow-2xl relative z-10">
        <div className="text-center">
          <button onClick={onBack} className="absolute top-8 left-8 text-gray-600 hover:text-gray-800">
            ← Back
          </button>
          <div className="flex justify-center mb-4">
            <Brain className="w-10 h-10 text-purple-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
          <p className="mt-2 text-gray-600">Log in to continue your journey</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <InputField
              icon={<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />}
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <InputField
              icon={<KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex justify-left">
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-sm text-purple-600 hover:text-purple-300"
            >
              Forgot password?
            </button>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Sign in
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button onClick={onSignup} className="font-medium text-purple-600 hover:text-purple-500">
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}