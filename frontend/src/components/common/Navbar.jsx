import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './Button';

const Navbar = () => {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-xl font-semibold text-primary-700 hover:text-primary-800">
          Gym Weight Tracker
        </Link>
        <div className="flex items-center gap-3">
          <Link className="text-sm text-neutral-700 hover:text-primary-700" to="/dashboard">
            Dashboard
          </Link>
          <Link className="text-sm text-neutral-700 hover:text-primary-700" to="/daily-log">
            Daily Log
          </Link>
          <Link className="text-sm text-neutral-700 hover:text-primary-700" to="/workout-log">
            Workout Log
          </Link>
          <Button as="a" href="/login" size="sm" variant="secondary">
            Login
          </Button>
          <Button as="a" href="/register" size="sm" variant="primary">
            Register
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
