// client/src/services/api.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach JWT token to requests if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sentinel_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const authAPI = {
  register: (email, password) => api.post('/auth/register', { email, password }),
  login: (email, password) => api.post('/auth/login', { email, password }),
  me: () => api.get('/auth/me')
};

export const firewallAPI = {
  scan: (input, policy = 'BALANCED', requestGemini = false) =>
    api.post('/firewall/scan', { input, policy, requestGemini }),
  process: (input, policy = 'BALANCED') =>
    api.post('/firewall/process', { input, policy })
};

export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getDistribution: () => api.get('/dashboard/distribution'),
  getActivity: () => api.get('/dashboard/activity')
};

export const scansAPI = {
  getScans: () => api.get('/scans'),
  getScanById: (id) => api.get(`/scans/${id}`),
  deleteScan: (id) => api.delete(`/scans/${id}`),
  clearScans: () => api.delete('/scans/clear')
};

export const healthAPI = {
  check: () => api.get('/health')
};

export default api;

