import React from 'react';
import Layout from '../components/common/Layout';
import { useAuth } from '../hooks/useAuth';

const Settings = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Settings</h1>
          <p className="text-neutral-600 text-sm mt-1">Manage your account and preferences</p>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Profile Information</h2>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-neutral-700">Name</label>
              <p className="text-neutral-900">{user?.name || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-700">Email</label>
              <p className="text-neutral-900">{user?.email || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Preferences</h2>
          <p className="text-neutral-600 text-sm">User preferences coming soon</p>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
