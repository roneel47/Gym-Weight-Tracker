import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Layout from '../components/common/Layout';
import Loading from '../components/common/Loading';
import Input from '../components/common/Input';
import { Button } from '../components/common/Button';
import * as settingsService from '../services/settingsService';
import { useAuth } from '../hooks/useAuth';

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
    theme: 'light',
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
        theme: data.theme || 'light',
        weekStartsOn: data.weekStartsOn || 'Monday',
        notifications: data.notifications || {
          enabled: true,
          dailyReminder: true,
          workoutReminder: true,
        },
      });
      // Apply theme
      applyTheme(data.theme || 'light');
    } catch (error) {
      console.error('Failed to load settings:', error);
      // Load from localStorage as fallback
      const savedTheme = localStorage.getItem('theme') || 'light';
      setFormData(prev => ({ ...prev, theme: savedTheme }));
      applyTheme(savedTheme);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const applyTheme = (themeValue) => {
    if (themeValue === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Preview theme change immediately
    if (name === 'theme') {
      applyTheme(value);
    }
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
      // Apply theme immediately
      applyTheme(formData.theme);
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

  if (loading) {
    return <Loading />;
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
              <label className="block text-sm font-medium text-neutral-700 mb-2">Theme</label>
              <select
                name="theme"
                value={formData.theme}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
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
          <Button
            onClick={handleLogout}
            variant="danger"
            className="w-full"
          >
            Logout
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
