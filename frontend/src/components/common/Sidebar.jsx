import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/daily-log', label: 'Daily Log' },
  { to: '/workout-log', label: 'Workout Log' },
  { to: '/weekly-summary', label: 'Weekly Summary' },
  { to: '/monthly-summary', label: 'Monthly Summary' },
  { to: '/creatine-analysis', label: 'Creatine Analysis' },
  { to: '/settings', label: 'Profile' },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-full max-w-xs rounded-lg border bg-white p-4 shadow-sm">
      <nav className="space-y-1">
        {navItems.map((item) => {
          const active = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                active ? 'bg-primary-50 text-primary-700' : 'text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <span>{item.label}</span>
              {active && <span className="h-2 w-2 rounded-full bg-primary-600" />}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
