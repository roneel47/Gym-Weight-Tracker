import api from './api';

export const createWorkoutLog = async (logData) => {
  const response = await api.post('/workout-logs', logData);
  return response.data;
};

export const getWorkoutLogs = async (limit = 30, page = 1, startDate, endDate) => {
  const params = { limit, page };
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;
  const response = await api.get('/workout-logs', { params });
  return response.data;
};

export const getWorkoutLog = async (id) => {
  const response = await api.get(`/workout-logs/${id}`);
  return response.data;
};

export const updateWorkoutLog = async (id, logData) => {
  const response = await api.put(`/workout-logs/${id}`, logData);
  return response.data;
};

export const deleteWorkoutLog = async (id) => {
  await api.delete(`/workout-logs/${id}`);
};

export const addExercise = async (id, exerciseData) => {
  const response = await api.post(`/workout-logs/${id}/add-exercise`, exerciseData);
  return response.data;
};

export const removeExercise = async (id, exerciseIndex) => {
  const response = await api.delete(`/workout-logs/${id}/exercises/${exerciseIndex}`);
  return response.data;
};

export const getPersonalRecords = async (startDate, endDate) => {
  const params = {};
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;
  const response = await api.get('/workout-logs/stats/prs', { params });
  return response.data;
};

export const getVolumeStats = async (startDate, endDate) => {
  const params = {};
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;
  const response = await api.get('/workout-logs/stats/volume', { params });
  return response.data;
};
