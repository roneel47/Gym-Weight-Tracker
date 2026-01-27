import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

const ComingSoon = ({ title, description }) => (
  <div className="card h-full">
    <h3 className="text-lg font-semibold text-neutral-900 mb-2">{title}</h3>
    <p className="text-neutral-600 text-sm mb-4">{description}</p>
    <span className="inline-flex items-center rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700">
      Coming soon
    </span>
  </div>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-neutral-50 text-neutral-900">
        <header className="border-b bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link to="/" className="text-xl font-semibold text-primary-700 hover:text-primary-800">
              Gym Weight Tracker
            </Link>
            <div className="flex items-center gap-3">
              <Link className="btn-secondary px-4 py-2 text-sm" to="/login">Login</Link>
              <Link className="btn-primary px-4 py-2 text-sm" to="/register">Register</Link>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-6 py-10">
          <section className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="card h-full">
                <h1 className="text-2xl font-semibold text-neutral-900 mb-3">Frontend setup complete</h1>
                <p className="text-neutral-600 mb-4">
                  React, React Router, Axios, Recharts, date-fns, React Toastify, and TailwindCSS are installed.
                  Folder structure is ready for pages, components, context, hooks, services, and utilities.
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="rounded-full bg-success-50 px-3 py-1 text-xs font-medium text-success-700">CRA ready</span>
                  <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700">Tailwind wired</span>
                  <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700">Routing installed</span>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <ComingSoon title="Dashboard" description="Charts for weight, gym days, and creatine usage." />
              <ComingSoon title="Daily Logs" description="Log weight, energy, and gym attendance each day." />
              <ComingSoon title="Workout Logs" description="Track exercises, volume, and personal records." />
            </div>
          </section>

          <section className="mt-10 grid gap-4 md:grid-cols-3">
            <div className="card">
              <h4 className="text-sm font-semibold text-neutral-800 mb-2">Next steps</h4>
              <ul className="space-y-1 text-sm text-neutral-600">
                <li>• Build AuthContext, Login, and Register pages</li>
                <li>• Implement protected routes and layout</li>
                <li>• Connect forms to backend API</li>
              </ul>
            </div>
            <div className="card">
              <h4 className="text-sm font-semibold text-neutral-800 mb-2">Tech stack</h4>
              <ul className="space-y-1 text-sm text-neutral-600">
                <li>• React 18 with React Router 6</li>
                <li>• TailwindCSS with custom palette</li>
                <li>• Axios + interceptors for auth</li>
              </ul>
            </div>
            <div className="card">
              <h4 className="text-sm font-semibold text-neutral-800 mb-2">Status</h4>
              <p className="text-sm text-neutral-600">Phase 2.1 completed. Ready to implement authentication UI.</p>
            </div>
          </section>
        </main>

        <ToastContainer position="top-right" theme="light" />
      </div>

      {/* Placeholder routes for upcoming pages */}
      <Routes>
        <Route path="/login" element={<div />} />
        <Route path="/register" element={<div />} />
      </Routes>
    </Router>
  );
}

export default App;
