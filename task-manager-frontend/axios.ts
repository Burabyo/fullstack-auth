import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api', // make sure this matches your Laravel API
 withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
