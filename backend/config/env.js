const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const readBool = (v, d) => (v === undefined ? d : String(v).toLowerCase() === 'true');
const int = (v, d) => {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : d;
};

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: int(process.env.PORT, 5000),
  CORS_ORIGIN: (process.env.CORS_ORIGIN || 'http://localhost:3000')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
  MONGO_URI: (process.env.MONGO_URI || '').trim(),
  JWT_SECRET: process.env.JWT_SECRET || 'dev-insecure-secret',
  JWT_EXPIRES: process.env.JWT_EXPIRES || '8h',
  RATES_MODE: ['ibja', 'fallback', 'off'].includes(process.env.RATES_MODE)
    ? process.env.RATES_MODE
    : 'fallback',
  IBJA_API_URL: (process.env.IBJA_API_URL || '').trim(),
  IBJA_API_KEY: (process.env.IBJA_API_KEY || '').trim(),
  RATES_SYNC_MINUTES: int(process.env.RATES_SYNC_MINUTES, 60),
  IBJA_TIMEOUT_MS: int(process.env.IBJA_TIMEOUT_MS, 15000),
  MAX_UPLOAD_MB: int(process.env.MAX_UPLOAD_MB, 5),
  isProd: (process.env.NODE_ENV || 'development') === 'production',
  rootDir: path.join(__dirname, '..'),
  uploadsDir: path.join(__dirname, '..', 'public', 'uploads'),
};

env.hasIBJACreds = Boolean(env.IBJA_API_URL && env.IBJA_API_KEY);

if (env.isProd && env.JWT_SECRET === 'dev-insecure-secret') {
  console.warn('[env] WARNING: JWT_SECRET is still the insecure default. Set a real value.');
}

fs.mkdirSync(env.uploadsDir, { recursive: true });

module.exports = env;