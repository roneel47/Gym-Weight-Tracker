import React from 'react';
import Layout from '../components/common/Layout';

const WeeklySummary = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Weekly Summary</h1>
          <p className="text-neutral-600 text-sm mt-1">View your weekly progress and stats</p>
        </div>

        <div className="card">
          <p className="text-neutral-600 text-sm">Weekly stats and charts coming soon</p>
        </div>
      </div>
    </Layout>
  );
};

export default WeeklySummary;
