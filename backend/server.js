const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const env = require('./config/env');
const { connectMongo } = require('./config/db');
const { ensureSeed } = require('./seed/runSeed');
const rateService = require('./services/ibjaRateService');

const publicRoutes = require('./routes/public');
const adminRoutes = require('./routes/admin');
const cors = require('./middleware/cors');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.disable('x-powered-by');
app.set('trust proxy', 1);

app.use(cors);
app.use(morgan(env.isProd ? 'combined' : 'dev'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());

// Admin-uploaded images (also referenced by the website + Android app)
app.use('/uploads', express.static(path.join(env.uploadsDir), { maxAge: '7d', index: false }));

app.use('/api', publicRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (_req, res) =>
  res.json({ success: true, message: 'ओंकार नाथ अग्रवाल सर्राफ API', docs: '/api/health' })
);

app.use(notFound);
app.use(errorHandler);

async function start() {
  await connectMongo();
  await ensureSeed();
  rateService.schedule();

  app.listen(env.PORT, () => {
    console.log(`\n  API running → http://localhost:${env.PORT}`);
    console.log(`  Rates mode  → ${env.RATES_MODE}${env.hasIBJACreds ? ' (IBJA configured)'.trim() : ' (manual fallback)'.trim()}`);
    console.log(`  Storage     → ${env.MONGO_URI ? 'MongoDB' : 'Local JSON (demo)'}\n`);
  });
}

start().catch((e) => {
  console.error('[server] failed to start:', e);
  process.exit(1);
});

module.exports = app;