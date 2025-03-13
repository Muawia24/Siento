import React, { useState } from 'react';
import { Brain, User, Mail, KeyRound } from 'lucide-react';
import { InputField } from './InputField';

interface SignupPageProps {
  onBack: () => void;
  onLogin: () => void;
}

export function SignupPage({ onBack, onLogin }: SignupPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    // Handle signup logic here
    console.log('Signup:', { name, email, password });
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1486946255434-2466348c2166?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80")'
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
          <h2 className="text-3xl font-bold text-gray-900">Create your account</h2>
          <p className="mt-2 text-gray-600">Start your journey to better self-understanding</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <InputField
              icon={<User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />}
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
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
              Create account
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <button onClick={onLogin} className="font-medium text-purple-600 hover:text-purple-500">
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}