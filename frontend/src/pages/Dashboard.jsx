import React from 'react';
import Layout from '../components/common/Layout';

const Dashboard = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
          <p className="text-neutral-600 text-sm mt-1">Track your progress and view analytics</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="card">
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">Weight Progression</h3>
            <p className="text-neutral-600 text-sm mb-4">Chart showing weight over time</p>
            <span className="inline-flex items-center rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700">
              Coming soon
            </span>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">Gym Consistency</h3>
            <p className="text-neutral-600 text-sm mb-4">Track your gym attendance</p>
            <span className="inline-flex items-center rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700">
              Coming soon
            </span>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">Recent Activity</h3>
            <p className="text-neutral-600 text-sm mb-4">Latest logs and workouts</p>
            <span className="inline-flex items-center rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700">
              Coming soon
            </span>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
