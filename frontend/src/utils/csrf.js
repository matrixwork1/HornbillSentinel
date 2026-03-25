import axios from 'axios';

const resolveApiBase = () => {
  const envUrl = process.env.REACT_APP_API_URL;
  if (envUrl) {
    try {
      const u = new URL(envUrl);
      if (typeof window !== 'undefined' && u.hostname === 'localhost' && window.location.hostname !== 'localhost') {
        const port = u.port || '5000';
        return `${window.location.protocol}//${window.location.hostname}:${port}`;
      }
      return envUrl;
    } catch {
      return (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5000');
    }
  }
  if (typeof window !== 'undefined') {
    try {
      const origin = new URL(window.location.origin);
      if (origin.hostname === 'localhost' && origin.port && origin.port !== '5000') {
        return `${origin.protocol}//${origin.hostname}:5000`;
      }
      if (origin.hostname === 'localhost' && !origin.port) {
        return `${origin.protocol}//${origin.hostname}:5000`;
      }
      return window.location.origin;
    } catch {
      return 'http://localhost:5000';
    }
  }
  return 'http://localhost:5000';
};
const API_BASE_URL = resolveApiBase();
let CSRF_CACHE_TOKEN = null;
let CSRF_CACHE_TS = 0;
const CSRF_TTL_MS = 10 * 60 * 1000;

// Helper function to get cookie value
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

// Helper function to clear expired tokens
const clearExpiredTokens = () => {
  // Clear cookies by setting them to expire
  document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
};

// Function to get CSRF token from server
export const getCSRFToken = async () => {
  const now = Date.now();
  if (CSRF_CACHE_TOKEN && now - CSRF_CACHE_TS < CSRF_TTL_MS) {
    return CSRF_CACHE_TOKEN;
  }
  const response = await axios.get(`${API_BASE_URL}/api/csrf-token`, { withCredentials: true });
  CSRF_CACHE_TOKEN = response.data.csrfToken;
  CSRF_CACHE_TS = now;
  return CSRF_CACHE_TOKEN;
};

// Function to get the best available token from httpOnly cookies
const getBestToken = () => {
  // Rely exclusively on httpOnly cookies for security
  return getCookie('token') || 
         getCookie('accessToken');
};

// Function to make unauthenticated requests with CSRF token only
export const makeUnauthenticatedRequest = async (method, url, data = {}) => {
  const csrfToken = await getCSRFToken();
  const config = {
    method,
    url: `${API_BASE_URL}${url}`,
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken,
    },
    withCredentials: true
  };
  if (method.toLowerCase() !== 'get') {
    config.data = data;
  }
  try {
    return await axios(config);
  } catch (error) {
    if (error.response?.status === 403) {
      CSRF_CACHE_TOKEN = null;
      CSRF_CACHE_TS = 0;
      const newToken = await getCSRFToken();
      config.headers['X-CSRF-Token'] = newToken;
      return await axios(config);
    }
    throw error;
  }
};

// Function to make authenticated requests with CSRF token and auth headers
export const makeAuthenticatedRequest = async (method, url, data = {}) => {
  const csrfToken = await getCSRFToken();
  const token = getBestToken();
  const config = {
    method,
    url: `${API_BASE_URL}${url}`,
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken,
    },
    withCredentials: true
  };
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  if (method.toLowerCase() !== 'get') {
    config.data = data;
  }
  try {
    return await axios(config);
  } catch (error) {
    if (error.response?.status === 403) {
      CSRF_CACHE_TOKEN = null;
      CSRF_CACHE_TS = 0;
      const newToken = await getCSRFToken();
      config.headers['X-CSRF-Token'] = newToken;
      return await axios(config);
    }
    if (error.response?.status === 401) {
      const errorCode = error.response?.data?.code;
      if (errorCode === 'TOKEN_EXPIRED') {
        await axios.post(`${API_BASE_URL}/api/auth/refresh`, {}, { withCredentials: true, headers: { 'Content-Type': 'application/json' } });
        const newCsrfToken = await getCSRFToken();
        const newToken = getBestToken();
        const retryConfig = { method, url: `${API_BASE_URL}${url}`, headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': newCsrfToken }, withCredentials: true };
        if (newToken) {
          retryConfig.headers['x-auth-token'] = newToken;
        }
        if (method.toLowerCase() !== 'get') {
          retryConfig.data = data;
        }
        return await axios(retryConfig);
      } else if (errorCode === 'INVALID_TOKEN' || errorCode === 'NO_TOKEN') {
        clearExpiredTokens();
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    throw error;
  }
};
