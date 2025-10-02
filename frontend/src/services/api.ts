import axios from 'axios';
import JwtService from '@/services/JwtService';

// Use absolute '/API/*' endpoints with Vite proxy; no baseURL required here.
const api = axios.create();

api.interceptors.request.use((config) => {
  const token = JwtService.getToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem('token');
      // Optionally trigger a global logout/event
    }
    return Promise.reject(error);
  }
);

export default api;
