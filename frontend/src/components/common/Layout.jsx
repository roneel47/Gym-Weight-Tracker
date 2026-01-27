import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from './Button';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/dashboard" className="text-xl font-semibold text-primary-700 hover:text-primary-800">
            Gym Weight Tracker
          </Link>
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6">
              <Link className="text-sm text-neutral-700 hover:text-primary-700" to="/dashboard">
                Dashboard
              </Link>
              <Link className="text-sm text-neutral-700 hover:text-primary-700" to="/daily-log">
                Daily Log
              </Link>
              <Link className="text-sm text-neutral-700 hover:text-primary-700" to="/workout-log">
                Workout Log
              </Link>
              <Link className="text-sm text-neutral-700 hover:text-primary-700" to="/settings">
                Settings
              </Link>
            </nav>
            <div className="flex items-center gap-3">
              <span className="text-sm text-neutral-600 hidden sm:inline">
                {user?.name || 'User'}
              </span>
              <Button onClick={handleLogout} size="sm" variant="secondary">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
