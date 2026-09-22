import { API_URL } from './config';

export function resolveImage(src) {
  if (!src) return null;
  if (/^https?:/i.test(src)) return src;
  if (src.startsWith('/uploads/')) return `${API_URL}${src}`;
  return null;
}

async function handle(res) {
  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try {
      const d = await res.json();
      if (d?.message) msg = d.message;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

export const apiGet = (path) => fetch(`${API_URL}${path}`).then(handle);

export const apiPost = (path, body) =>
  fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body || {}),
  }).then(handle);

export const fallbackArt = (name = '') => {
  const n = (name || '').toLowerCase();
  if (n.includes('bridal')) return require('../assets/art/bridal-necklace.png');
  if (n.includes('jhumka')) return require('../assets/art/gold-jhumka.png');
  if (n.includes('bangle')) return require('../assets/art/gold-bangles.png');
  if (n.includes('diamond')) return require('../assets/art/diamond-ring.png');
  if (n.includes('ring')) return require('../assets/art/gold-ring.png');
  if (n.includes('payal')) return require('../assets/art/silver-payal.png');
  if (n.includes('chain')) return require('../assets/art/gold-chain.png');
  if (n.includes('necklace')) return require('../assets/art/gold-necklace.png');
  return require('../assets/icon.png');
};