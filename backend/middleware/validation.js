const slugify = (str = '') =>
  String(str)
    .toLowerCase()
    .trim()
    .replace(/[^\w\u0900-\u097F]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || `item-${Date.now()}`;

const str = (v, max = 500) =>
  typeof v === 'string' && v.trim() ? String(v).trim().slice(0, max) : '';

const num = (v) => {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (typeof v === 'string') {
    const n = Number(String(v).replace(/[,\s₹]/g, ''));
    if (Number.isFinite(n)) return n;
  }
  return null;
};

const bool = (v) => v === true || v === 'true' || v === 1 || v === '1';

const idOf = (v) => (typeof v === 'string' && v.length >= 8 ? v : null);

const required = (v, field) => {
  if (!v) {
    const err = new Error(`${field} is required`);
    err.status = 400;
    throw err;
  }
  return v;
};

module.exports = { slugify, str, num, bool, idOf, required };