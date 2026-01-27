import React from 'react';
import Layout from '../components/common/Layout';
import WorkoutLogForm from '../components/forms/WorkoutLogForm';

const WorkoutLog = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Workout Log</h1>
          <p className="text-neutral-600 text-sm mt-1">Track your exercises, sets, reps, and personal records</p>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Log Exercise</h2>
          <WorkoutLogForm />
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Today's Workout</h2>
          <p className="text-neutral-600 text-sm">Workout history will appear here</p>
        </div>
      </div>
    </Layout>
  );
};

export default WorkoutLog;
