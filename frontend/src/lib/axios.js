import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('hostel_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response Interceptor: Handle Expiry generically
api.interceptors.response.use((response) => response, (error) => {
  if (error.response && error.response.status === 401) {
    console.error("Token invalid or expired. Redirecting to login...");
    localStorage.removeItem('hostel_token');
    localStorage.removeItem('user_info');
    window.location.href = '/login';
  }
  return Promise.reject(error);
});

export default api;
