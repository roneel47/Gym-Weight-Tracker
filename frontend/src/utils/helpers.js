import { format, parseISO, isValid } from 'date-fns';

// Date formatting helpers
export const formatDate = (date) => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return isValid(dateObj) ? format(dateObj, 'MMM d, yyyy') : 'Invalid date';
  } catch {
    return 'Invalid date';
  }
};

export const formatDateTime = (date) => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return isValid(dateObj) ? format(dateObj, 'MMM d, yyyy HH:mm') : 'Invalid date';
  } catch {
    return 'Invalid date';
  }
};

export const formatShortDate = (date) => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return isValid(dateObj) ? format(dateObj, 'MMM d') : 'Invalid date';
  } catch {
    return 'Invalid date';
  }
};

// Number formatting helpers
export const formatWeight = (weight) => {
  return `${Number(weight).toFixed(2)} kg`;
};

export const formatVolume = (volume) => {
  return `${Number(volume).toFixed(0)} kg`;
};

export const formatPercentage = (value) => {
  return `${Number(value).toFixed(1)}%`;
};

// Validation helpers
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password) => {
  return password && password.length >= 6;
};

// Weight calculation helpers
export const calculateWeightChange = (current, previous) => {
  if (!current || !previous) return null;
  return Number(current) - Number(previous);
};

export const calculateSevenDayAverage = (weights) => {
  if (!weights || weights.length === 0) return null;
  const sum = weights.reduce((acc, w) => acc + Number(w), 0);
  return sum / weights.length;
};

export const getWeightTrend = (change) => {
  if (!change) return 'stable';
  if (change > 0) return 'up';
  if (change < 0) return 'down';
  return 'stable';
};

// Array/Object helpers
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {});
};

export const sumBy = (array, key) => {
  return array.reduce((sum, item) => sum + (Number(item[key]) || 0), 0);
};

export const averageBy = (array, key) => {
  if (array.length === 0) return 0;
  return sumBy(array, key) / array.length;
};

// Error handling helpers
export const getErrorMessage = (error) => {
  if (typeof error === 'string') return error;
  if (error.response?.data?.message) return error.response.data.message;
  if (error.message) return error.message;
  return 'An unexpected error occurred';
};

// Storage helpers
export const setToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('Error saving to localStorage:', err);
  }
};

export const getFromStorage = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (err) {
    console.error('Error reading from localStorage:', err);
    return null;
  }
};

export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.error('Error removing from localStorage:', err);
  }
};
