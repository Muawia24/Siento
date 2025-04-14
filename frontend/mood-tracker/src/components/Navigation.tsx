// components/Navigation.tsx
import React from 'react';
import { Brain, User, LogOut } from 'lucide-react';

interface NavigationProps {
  onProfile: () => void;
  onLogout: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onProfile, onLogout }) => (
  <nav className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-30 border-b border-gray-200/50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <div className="flex items-center space-x-3">
          <Brain className="w-7 h-7 text-purple-600" />
          <span className="text-2xl font-bold text-gray-900 tracking-tight bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            MoodMind
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <NavButton icon={User} label="Profile" onClick={onProfile} color="purple" />
          <NavButton icon={LogOut} label="Sign out" onClick={onLogout} color="red" />
        </div>
      </div>
    </div>
  </nav>
);

const NavButton: React.FC<{
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  color: 'purple' | 'red';
}> = ({ icon: Icon, label, onClick, color }) => (
  <button 
    onClick={onClick}
    className="relative group px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-100/50"
  >
    <div className={`flex items-center gap-2 text-gray-700 group-hover:text-${color}-600`}>
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </div>
    <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-${color}-600 transition-all duration-300 group-hover:w-full`}></span>
  </button>
);