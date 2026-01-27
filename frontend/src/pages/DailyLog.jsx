import React from 'react';
import Layout from '../components/common/Layout';
import DailyLogForm from '../components/forms/DailyLogForm';

const DailyLog = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Daily Log</h1>
          <p className="text-neutral-600 text-sm mt-1">Log your daily weight, nutrition, and gym attendance</p>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Today's Entry</h2>
          <DailyLogForm />
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Recent Entries</h2>
          <p className="text-neutral-600 text-sm">Recent logs will appear here</p>
        </div>
      </div>
    </Layout>
  );
};

export default DailyLog;
