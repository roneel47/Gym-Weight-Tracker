import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Layout from '../components/common/Layout';
import Loading from '../components/common/Loading';
import Input from '../components/common/Input';
import { Button } from '../components/common/Button';
import * as settingsService from '../services/settingsService';
import * as dailyLogService from '../services/dailyLogService';
import * as workoutLogService from '../services/workoutLogService';
import { useAuth } from '../hooks/useAuth';
import { exportToCSV, formatDailyLogsForExport, formatWorkoutLogsForExport } from '../utils/exportUtils';

const Settings = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState(null);
  const [formData, setFormData] = useState({
    creatineStartDate: '',
    targetWeight: '',
    weightUnit: 'kg',
    weekStartsOn: 'Monday',
    notifications: {
      enabled: true,
      dailyReminder: true,
      workoutReminder: true,
    },
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await settingsService.getSettings();
      setSettings(data);
      setFormData({
        creatineStartDate: data.creatineStartDate ? data.creatineStartDate.split('T')[0] : '',
        targetWeight: data.targetWeight || '',
        weightUnit: data.weightUnit || 'kg',
        weekStartsOn: data.weekStartsOn || 'Monday',
        notifications: data.notifications || {
          enabled: true,
          dailyReminder: true,
          workoutReminder: true,
        },
      });
    } catch (error) {
      console.error('Failed to load settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      notifications: {
        ...formData.notifications,
        [name]: checked,
      },
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await settingsService.updateSettings(formData);
      toast.success('Settings saved successfully');
      loadSettings(); // Reload to confirm
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (window.confirm('Reset all settings to defaults?')) {
      try {
        setSaving(true);
        await settingsService.resetSettings();
        toast.success('Settings reset to defaults');
        loadSettings();
      } catch (error) {
        console.error('Failed to reset settings:', error);
        toast.error('Failed to reset settings');
      } finally {
        setSaving(false);
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleExportDailyLogs = async () => {
    try {
      const response = await dailyLogService.getDailyLogs(10000, 1);
      const formattedData = formatDailyLogsForExport(response.logs || []);
      const filename = `daily-logs-${new Date().toISOString().split('T')[0]}.csv`;
      exportToCSV(formattedData, filename);
      toast.success('Daily logs exported successfully!');
    } catch (err) {
      toast.error('Failed to export daily logs');
    }
  };

  const handleExportWorkoutLogs = async () => {
    try {
      const response = await workoutLogService.getAllWorkoutLogs({ limit: 10000 });
      const workoutData = Array.isArray(response?.workoutLogs) 
        ? response.workoutLogs 
        : Array.isArray(response?.logs)
        ? response.logs
        : Array.isArray(response)
        ? response
        : [];
      const formattedData = formatWorkoutLogsForExport(workoutData);
      const filename = `workout-logs-${new Date().toISOString().split('T')[0]}.csv`;
      exportToCSV(formattedData, filename);
      toast.success('Workout logs exported successfully!');
    } catch (err) {
      toast.error('Failed to export workout logs');
    }
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <Layout>
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Settings</h1>
          <p className="text-neutral-600 text-sm mt-1">Manage your preferences and account</p>
        </div>

        {/* Creatine Settings */}
        <div className="card">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Creatine Tracking</h2>
          <div className="space-y-4">
            <Input
              label="Creatine Start Date"
              type="date"
              name="creatineStartDate"
              value={formData.creatineStartDate}
              onChange={handleInputChange}
              description="Date you started taking creatine (optional)"
            />
          </div>
        </div>

        {/* Goal Settings */}
        <div className="card">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Goals & Targets</h2>
          <div className="space-y-4">
            <Input
              label="Target Weight (kg)"
              type="number"
              name="targetWeight"
              value={formData.targetWeight}
              onChange={handleInputChange}
              step="0.5"
              min="0"
              max="200"
              description="Your desired weight target (optional)"
            />
          </div>
        </div>

        {/* Display Settings */}
        <div className="card">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Display</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Weight Unit</label>
              <select
                name="weightUnit"
                value={formData.weightUnit}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="kg">Kilograms (kg)</option>
                <option value="lbs">Pounds (lbs)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Week Starts On</label>
              <select
                name="weekStartsOn"
                value={formData.weekStartsOn}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="Monday">Monday</option>
                <option value="Sunday">Sunday</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="card">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Notifications</h2>
          <div className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                name="enabled"
                checked={formData.notifications.enabled}
                onChange={handleNotificationChange}
                className="w-4 h-4 rounded border-neutral-300 text-primary-600"
              />
              <span className="text-sm text-neutral-700">Enable notifications</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                name="dailyReminder"
                checked={formData.notifications.dailyReminder}
                onChange={handleNotificationChange}
                disabled={!formData.notifications.enabled}
                className="w-4 h-4 rounded border-neutral-300 text-primary-600 disabled:opacity-50"
              />
              <span className="text-sm text-neutral-700">Daily weight logging reminder</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                name="workoutReminder"
                checked={formData.notifications.workoutReminder}
                onChange={handleNotificationChange}
                disabled={!formData.notifications.enabled}
                className="w-4 h-4 rounded border-neutral-300 text-primary-600 disabled:opacity-50"
              />
              <span className="text-sm text-neutral-700">Workout logging reminder</span>
            </label>
          </div>
        </div>

        {/* Account Settings */}
        <div className="card">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Account</h2>
          <div className="space-y-3">
            <div className="p-3 bg-neutral-50 rounded-lg">
              <p className="text-sm text-neutral-600">Email</p>
              <p className="text-neutral-900 font-medium">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Data Export */}
        <div className="card">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Data Export</h2>
          <p className="text-sm text-neutral-600 mb-4">Download your data in CSV format</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleExportDailyLogs}
              variant="secondary"
              className="flex-1"
            >
              <span className="material-icons text-sm mr-2">download</span>
              Export Daily Logs
            </Button>
            <Button
              onClick={handleExportWorkoutLogs}
              variant="secondary"
              className="flex-1"
            >
              <span className="material-icons text-sm mr-2">download</span>
              Export Workout Logs
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleSave}
            variant="primary"
            className="w-full"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
          <Button
            onClick={handleReset}
            variant="secondary"
            className="w-full"
            disabled={saving}
          >
            Reset to Defaults
          </Button>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-danger-600 text-white rounded-lg hover:bg-danger-700 transition-colors font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
