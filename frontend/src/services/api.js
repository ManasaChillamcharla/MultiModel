import axios from 'axios';

const rawBaseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Normalize URL to prevent double slashes in the path (e.g. domain.com//api -> domain.com/api)
let normalizedBaseURL = rawBaseURL;
if (normalizedBaseURL.includes('://')) {
  const parts = normalizedBaseURL.split('://');
  const protocol = parts[0];
  const rest = parts[1].replace(/\/+/g, '/'); // replace multiple slashes with a single slash
  normalizedBaseURL = `${protocol}://${rest}`;
} else {
  normalizedBaseURL = normalizedBaseURL.replace(/\/+/g, '/');
}

// Remove any trailing slash to ensure consistency
normalizedBaseURL = normalizedBaseURL.replace(/\/+$/, '');

const api = axios.create({
  baseURL: normalizedBaseURL,
});

// Automatically attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If we get a 401 response, clear the token and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Only redirect if not already on auth pages
      if (
        !window.location.pathname.includes('/login') &&
        !window.location.pathname.includes('/register')
      ) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
