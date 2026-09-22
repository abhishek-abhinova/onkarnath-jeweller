export const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');

// When running on a static host (Vercel demo, `next start`) there is no Express
// backend, so every request to API_URL fails. To keep the site fully rendered
// (products, categories, rates, gallery, settings, about) we fall back to the
// bundled demo dataset. Local dev still talks to the live API on port 5000.
import { demoResponse } from './demo';

async function handle(res) {
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      if (data?.message) message = data.message;
    } catch {
      /* ignore */
    }
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

export const apiGet = async (path) => {
  try {
    const res = await fetch(`${API_URL}${path}`, { cache: 'no-store' });
    return await handle(res);
  } catch {
    // Backend unreachable (Vercel / static deploy, API down, CORS) → serve the
    // bundled catalogue so the marketing site always looks complete and live.
    const demo = demoResponse(path);
    if (demo) return demo;
    throw new Error('Service temporarily unavailable');
  }
};

export const apiPost = async (path, body, token) => {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
    credentials: 'include',
  });
  return handle(res);
};

export const apiPut = async (path, body, token) => {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  return handle(res);
};

export const apiDelete = async (path, token) => {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'DELETE',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return handle(res);
};

// Resolve an image path returned by the backend to a full URL.
export const resolveImage = (src) => {
  if (!src) return null;
  if (/^https?:/i.test(src)) return src;
  if (src.startsWith('/uploads/')) return `${API_URL}${src}`;
  return src;
};