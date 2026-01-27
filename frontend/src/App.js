import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

// Context
import { AuthProvider } from './context/AuthContext';

// Components
import PrivateRoute from './components/common/PrivateRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DailyLog from './pages/DailyLog';
import WorkoutLog from './pages/WorkoutLog';
import WeeklySummary from './pages/WeeklySummary';
import MonthlySummary from './pages/MonthlySummary';
import CreatineAnalysis from './pages/CreatineAnalysis';
import Settings from './pages/Settings';

function App() {
  useEffect(() => {
    // Load theme from localStorage on app initialization
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-neutral-50">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/daily-log"
              element={
                <PrivateRoute>
                  <DailyLog />
                </PrivateRoute>
              }
            />
            <Route
              path="/workout-log"
              element={
                <PrivateRoute>
                  <WorkoutLog />
                </PrivateRoute>
              }
            />
            <Route
              path="/weekly-summary"
              element={
                <PrivateRoute>
                  <WeeklySummary />
                </PrivateRoute>
              }
            />
            <Route
              path="/monthly-summary"
              element={
                <PrivateRoute>
                  <MonthlySummary />
                </PrivateRoute>
              }
            />
            <Route
              path="/creatine-analysis"
              element={
                <PrivateRoute>
                  <CreatineAnalysis />
                </PrivateRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <Settings />
                </PrivateRoute>
              }
            />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>

          <ToastContainer position="top-right" theme="light" autoClose={3000} />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
