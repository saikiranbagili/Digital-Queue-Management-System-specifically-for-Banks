import axios from 'axios';

const getBaseUrl = () => {
  let url = (import.meta.env.VITE_API_BASE_URL || '/api').trim();
  while (url.endsWith('/')) {
    url = url.slice(0, -1).trim();
  }
  // Strip any trailing /api to avoid accidental /api/api
  while (url.endsWith('/api')) {
    url = url.slice(0, -4).trim();
  }
  if (!url || url === '') {
    return '/api';
  }
  return `${url}/api`;
};

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60s to accommodate cloud cold starts (Render free tier spin-up)
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('bankq_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for consistent error messaging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('bankq_token');
      localStorage.removeItem('bankq_user');
      // If unauthorized and not on login page, can redirect
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    let message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected error occurred';
    if (error.code === 'ECONNABORTED' || (message && message.toLowerCase().includes('timeout'))) {
      message = 'Cloud server is warming up from sleep. Please wait 10 seconds and click again!';
    }
    return Promise.reject(new Error(message));
  }
);

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  me: () => api.get('/auth/me'),
};

export const customerApi = {
  getDashboard: () => api.get('/customer/dashboard'),
  requestToken: (serviceName, branch = '') => api.post('/customer/tokens', { serviceName, branch: branch || undefined }),
  getMyTokens: () => api.get('/customer/tokens'),
  getTokenById: (id) => api.get(`/customer/tokens/${id}`),
  getTokenStatus: (id) => api.get(`/customer/tokens/${id}/status`),
};

export const staffApi = {
  getDashboard: (branch = '') => api.get('/staff/dashboard', { params: { branch: branch || undefined } }),
  getQueue: (serviceName, branch = '') => api.get('/staff/queue', { params: { serviceName: serviceName || undefined, branch: branch || undefined } }),
  callNext: (serviceName, counterName, branch = '') =>
    api.post('/staff/queue/call-next', { serviceName, counterName, branch: branch || undefined }),
  completeToken: (id) => api.post(`/staff/tokens/${id}/complete`),
};

export const adminApi = {
  getDashboard: () => api.get('/admin/dashboard'),
  getTokens: (params) => api.get('/admin/tokens', { params }),
  getUsers: () => api.get('/admin/users'),
  getServices: () => api.get('/admin/services'),
  getCounters: () => api.get('/admin/counters'),
};

export const healthApi = {
  check: () => api.get('/health'),
};

export default api;
