import api from './api';

export const createDailyLog = async (logData) => {
  const response = await api.post('/daily-logs', logData);
  return response.data;
};

export const getDailyLogs = async (limit = 30, page = 1, startDate, endDate) => {
  const params = { limit, page };
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;
  const response = await api.get('/daily-logs', { params });
  return response.data;
};

export const getDailyLog = async (id) => {
  const response = await api.get(`/daily-logs/${id}`);
  return response.data;
};

export const updateDailyLog = async (id, logData) => {
  const response = await api.put(`/daily-logs/${id}`, logData);
  return response.data;
};

export const deleteDailyLog = async (id) => {
  await api.delete(`/daily-logs/${id}`);
};

export const getWeeklyStats = async () => {
  const response = await api.get('/daily-logs/stats/weekly');
  return response.data;
};
