import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add authorization token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Get user settings
 */
export const getSettings = async () => {
  try {
    const response = await api.get('/settings');
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Update user settings
 */
export const updateSettings = async (settingsData) => {
  try {
    const response = await api.put('/settings', settingsData);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Reset settings to defaults
 */
export const resetSettings = async () => {
  try {
    const response = await api.post('/settings/reset');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
