import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Attach token on each request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Token helpers
export const saveToken = (token: string) => {
  localStorage.setItem('authToken', token);
};

export const removeToken = () => {
  localStorage.removeItem('authToken');
};

export const isAuthenticated = () => !!localStorage.getItem('authToken');

// Auth APIs
export const registerUser = async (data: { name: string; email: string; password: string }) => {
  const response = await api.post('/register', data);
  const token = response.data.access_token;
  saveToken(token);
  return response;
};

export const loginUser = async (data: { email: string; password: string }) => {
  const response = await api.post('/login', data);
  const token = response.data.access_token;
  saveToken(token);
  return response;
};

export const logoutUser = async () => {
  await api.post('/logout');
  removeToken();
};

// Optional: check current user (debugging token use)
export const getCurrentUser = () => api.get('/user');

// Tasks API
export const getTasks = () => api.get('/tasks');

export const createTask = (data: { title: string; completed?: boolean }) =>
  api.post('/tasks', data);

export const updateTask = (id: number, data: { title?: string; completed?: boolean }) =>
  api.put(`/tasks/${id}`, data);

export const deleteTask = (id: number) => api.delete(`/tasks/${id}`);

export default api;
