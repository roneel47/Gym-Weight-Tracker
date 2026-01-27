import React from 'react';
import Layout from '../components/common/Layout';

const MonthlySummary = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Monthly Summary</h1>
          <p className="text-neutral-600 text-sm mt-1">View your monthly trends and comparisons</p>
        </div>

        <div className="card">
          <p className="text-neutral-600 text-sm">Monthly trends and comparisons coming soon</p>
        </div>
      </div>
    </Layout>
  );
};

export default MonthlySummary;
