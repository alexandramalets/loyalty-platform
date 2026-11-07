import axios from 'axios';

const apiRoot = import.meta.env.VITE_API_URL;
const baseURL = apiRoot ? `${apiRoot.replace(/\/$/, '')}/api` : '/api';

export const http = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

http.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('loyalty-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message
      || (error.message === 'Network Error'
        ? 'Сервер недоступен. Запустите backend (порт 8090) и обновите страницу.'
        : error.message)
      || 'Не удалось выполнить запрос';
    if (status === 401 && !String(error.config?.url || '').includes('/auth/login')) {
      sessionStorage.removeItem('loyalty-token');
      sessionStorage.removeItem('loyalty-auth');
      if (window.location.pathname !== '/login') {
        window.location.assign('/login');
      }
    }
    const next = new Error(message);
    next.status = status;
    next.details = error.response?.data;
    return Promise.reject(next);
  },
);
