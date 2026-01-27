import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from './Button';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            {/* Desktop Navigation */}
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
              <Button onClick={handleLogout} size="sm" variant="secondary" className="hidden md:block">
                Logout
              </Button>
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-md text-neutral-700 hover:bg-neutral-100"
                aria-label="Toggle menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {mobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-neutral-200 bg-white">
            <nav className="flex flex-col px-6 py-4 space-y-3">
              <Link
                className="text-sm text-neutral-700 hover:text-primary-700 py-2"
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                className="text-sm text-neutral-700 hover:text-primary-700 py-2"
                to="/daily-log"
                onClick={() => setMobileMenuOpen(false)}
              >
                Daily Log
              </Link>
              <Link
                className="text-sm text-neutral-700 hover:text-primary-700 py-2"
                to="/workout-log"
                onClick={() => setMobileMenuOpen(false)}
              >
                Workout Log
              </Link>
              <Link
                className="text-sm text-neutral-700 hover:text-primary-700 py-2"
                to="/settings"
                onClick={() => setMobileMenuOpen(false)}
              >
                Settings
              </Link>
              <div className="pt-3 border-t border-neutral-200">
                <Button onClick={handleLogout} size="sm" variant="secondary" className="w-full">
                  Logout
                </Button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
