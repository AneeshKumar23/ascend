import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  CheckCircle, 
  Target, 
  Calendar, 
  Trophy, 
  User
} from 'lucide-react';

function Navbar() {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <NavLink 
            icon={<CheckCircle size={24} />} 
            text="Today" 
            to="/dashboard" 
            active={isActive('/dashboard')}
          />
          <NavLink 
            icon={<Target size={24} />} 
            text="Habits" 
            to="/habits" 
            active={isActive('/habits')}
          />
          <NavLink 
            icon={<Calendar size={24} />} 
            text="Goals" 
            to="/goals" 
            active={isActive('/goals')}
          />
          <NavLink 
            icon={<Trophy size={24} />} 
            text="Achievements" 
            to="/achievements" 
            active={isActive('/achievements')}
          />
          <NavLink 
            icon={<User size={24} />} 
            text="Profile" 
            to="/profile" 
            active={isActive('/profile')}
          />
        </div>
      </div>
    </nav>
  );
}

function NavLink({ icon, text, to, active }) {
  return (
    <Link
      to={to}
      className={`flex flex-col items-center px-3 py-1 text-sm font-medium transition-colors duration-200 ${
        active 
          ? 'text-purple-500' 
          : 'text-gray-400 hover:text-white'
      }`}
    >
      {icon}
      <span className="mt-1 text-xs">{text}</span>
    </Link>
  );
}

export default Navbar;