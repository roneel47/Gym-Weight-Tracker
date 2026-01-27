// Application constants
export const MUSCLE_GROUPS = [
  'Back',
  'Biceps',
  'Legs',
  'Shoulders',
  'Chest',
  'Triceps',
  'Forearms',
  'Calves',
  'Abs',
  'Other',
];

export const ENERGY_LEVELS = [
  { value: 1, label: 'Very Low', color: 'bg-danger-500' },
  { value: 2, label: 'Low', color: 'bg-warning-500' },
  { value: 3, label: 'Medium', color: 'bg-neutral-500' },
  { value: 4, label: 'High', color: 'bg-success-500' },
  { value: 5, label: 'Very High', color: 'bg-primary-500' },
];

export const WEIGHT_STATUS = {
  GOING_UP: 'Going Up',
  TOO_SLOW: 'Too Slow',
  DROPPING: 'Dropping',
  TOO_FAST: 'Too Fast',
  STABLE: 'Stable',
};

export const WEIGHT_STATUS_COLORS = {
  GOING_UP: 'text-success-600 bg-success-50',
  TOO_SLOW: 'text-warning-600 bg-warning-50',
  DROPPING: 'text-danger-600 bg-danger-50',
  TOO_FAST: 'text-danger-600 bg-danger-50',
  STABLE: 'text-primary-600 bg-primary-50',
};

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    ME: '/auth/me',
  },
  DAILY_LOGS: {
    CREATE: '/daily-logs',
    GET_ALL: '/daily-logs',
    GET_ONE: (id) => `/daily-logs/${id}`,
    UPDATE: (id) => `/daily-logs/${id}`,
    DELETE: (id) => `/daily-logs/${id}`,
    WEEKLY_STATS: '/daily-logs/stats/weekly',
  },
  WORKOUT_LOGS: {
    CREATE: '/workout-logs',
    GET_ALL: '/workout-logs',
    GET_ONE: (id) => `/workout-logs/${id}`,
    UPDATE: (id) => `/workout-logs/${id}`,
    DELETE: (id) => `/workout-logs/${id}`,
    ADD_EXERCISE: (id) => `/workout-logs/${id}/add-exercise`,
    REMOVE_EXERCISE: (id, index) => `/workout-logs/${id}/exercises/${index}`,
    PRS: '/workout-logs/stats/prs',
    VOLUME: '/workout-logs/stats/volume',
  },
};
