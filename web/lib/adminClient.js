import { API_URL } from './api';

const TOKEN_KEY = 'onas_admin_token';

export const getToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
};
export const setToken = (t) => localStorage.setItem(TOKEN_KEY, t);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

async function handle(res) {
  if (res.status === 401) {
    clearToken();
    window.location.href = '/admin/login';
    throw new Error('Session expired');
  }
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const d = await res.json();
      if (d?.message) message = d.message;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }
  return res.json();
}

export const adminGet = async (path) => {
  const res = await fetch(`${API_URL}/api/admin${path}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return handle(res);
};

export const adminPost = async (path, body) => {
  const res = await fetch(`${API_URL}/api/admin${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(body || {}),
  });
  return handle(res);
};

export const adminPut = async (path, body) => {
  const res = await fetch(`${API_URL}/api/admin${path}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(body || {}),
  });
  return handle(res);
};

export const adminDelete = async (path) => {
  const res = await fetch(`${API_URL}/api/admin${path}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return handle(res);
};

export const adminLogin = async (emailOrUsername, password) => {
  const res = await fetch(`${API_URL}/api/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ emailOrUsername, password }),
  });
  return handle(res);
};

export const uploadImages = async (files) => {
  const form = new FormData();
  files.forEach((f) => form.append('images', f));
  const res = await fetch(`${API_URL}/api/admin/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${getToken()}` },
    body: form,
  });
  return handle(res);
};