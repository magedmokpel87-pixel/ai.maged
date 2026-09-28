import axios from 'axios';

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';
// Server-side (SSR) fetches can use the internal docker-network address when set
export const SERVER_API_BASE = process.env.INTERNAL_API_BASE || API_BASE;

export function absUrl(url) {
  if (!url) return '';
  return url.startsWith('http') ? url : `${API_BASE}${url}`;
}

const TOKEN_KEY = 'aimaged_token';

export function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function decodeRole(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role || null;
  } catch {
    return null;
  }
}

export const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
