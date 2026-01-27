import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

// Context
import { AuthProvider } from './context/AuthContext';

// Components
import PrivateRoute from './components/common/PrivateRoute';
import Loading from './components/common/Loading';

// Eager-loaded pages (auth)
import Login from './pages/Login';
import Register from './pages/Register';

// Lazy-loaded pages (protected routes)
const Dashboard = lazy(() => import('./pages/Dashboard'));
const DailyLog = lazy(() => import('./pages/DailyLog'));
const WorkoutLog = lazy(() => import('./pages/WorkoutLog'));
const WeeklySummary = lazy(() => import('./pages/WeeklySummary'));
const MonthlySummary = lazy(() => import('./pages/MonthlySummary'));
const CreatineAnalysis = lazy(() => import('./pages/CreatineAnalysis'));
const Settings = lazy(() => import('./pages/Settings'));

function App() {
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
                  <Suspense fallback={<Loading fullScreen label="Loading dashboard..." />}>
                    <Dashboard />
                  </Suspense>
                </PrivateRoute>
              }
            />
            <Route
              path="/daily-log"
              element={
                <PrivateRoute>
                  <Suspense fallback={<Loading fullScreen label="Loading daily log..." />}>
                    <DailyLog />
                  </Suspense>
                </PrivateRoute>
              }
            />
            <Route
              path="/workout-log"
              element={
                <PrivateRoute>
                  <Suspense fallback={<Loading fullScreen label="Loading workout log..." />}>
                    <WorkoutLog />
                  </Suspense>
                </PrivateRoute>
              }
            />
            <Route
              path="/weekly-summary"
              element={
                <PrivateRoute>
                  <Suspense fallback={<Loading fullScreen label="Loading summary..." />}>
                    <WeeklySummary />
                  </Suspense>
                </PrivateRoute>
              }
            />
            <Route
              path="/monthly-summary"
              element={
                <PrivateRoute>
                  <Suspense fallback={<Loading fullScreen label="Loading summary..." />}>
                    <MonthlySummary />
                  </Suspense>
                </PrivateRoute>
              }
            />
            <Route
              path="/creatine-analysis"
              element={
                <PrivateRoute>
                  <Suspense fallback={<Loading fullScreen label="Loading analysis..." />}>
                    <CreatineAnalysis />
                  </Suspense>
                </PrivateRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <Suspense fallback={<Loading fullScreen label="Loading settings..." />}>
                    <Settings />
                  </Suspense>
                </PrivateRoute>
              }
            />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>

          <ToastContainer 
            position="top-right" 
            theme="light" 
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
