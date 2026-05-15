import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

export const getSensors = () => api.get('/sensors');
export const getSensorData = (id) => api.get(`/sensors/${id}`);
export const getEvacuationPaths = () => api.get('/evacuation-paths');
export const getAlerts = () => api.get('/alerts');
export const createAlert = (data) => api.post('/alerts', data);
