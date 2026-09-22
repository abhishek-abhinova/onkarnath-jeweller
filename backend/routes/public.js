const { Router } = require('express');
const rateService = require('../services/ibjaRateService');
const store = require('../data/store');
const { apiLimiter } = require('../middleware/rateLimit');
const { str, num } = require('../middleware/validation');

const router = Router();
router.use(apiLimiter);

router.get('/health', (_req, res) =>
  res.json({ success: true, service: 'onas-backend', time: new Date().toISOString() })
);

router.get('/rates', async (_req, res) => {
  const data = await rateService.getLatestRates();
  res.json({ success: true, ...data });
});

router.get('/rates/history', async (req, res) => {
  const limit = Math.min(200, num(req.query.limit) || 30);
  const rows = await store.getRateHistory(limit);
  res.json({ success: true, history: rows });
});

router.get('/products', async (req, res) => {
  const { category, search } = req.query;
  const featured = req.query.featured === 'true' ? true : req.query.featured === 'false' ? false : undefined;
  const skip = Math.max(0, num(req.query.skip) || 0);
  const limit = Math.min(100, num(req.query.limit) || 100);
  const { total, items } = await store.listProducts({ category, featured, search, skip, limit });
  res.json({ success: true, total, products: items });
});

router.get('/products/:slugOrId', async (req, res, next) => {
  try {
    const { slugOrId } = req.params;
    const product =
      (await store.getProductBySlug(slugOrId)) || (await store.getProductById(slugOrId));
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
  } catch (e) {
    next(e);
  }
});

router.get('/categories', async (_req, res) => {
  const categories = await store.listCategories();
  res.json({ success: true, categories });
});

router.get('/gallery', async (_req, res) => {
  const items = await store.listGallery();
  res.json({ success: true, gallery: items });
});

const PUBLIC_SETTINGS = ['businessName', 'tagline', 'address', 'phone', 'whatsapp', 'about'];

router.get('/settings', async (_req, res) => {
  const all = await store.getSettings();
  const out = {};
  for (const key of PUBLIC_SETTINGS) if (key in all) out[key] = all[key];
  res.json({ success: true, settings: out });
});

router.post('/contact', async (req, res, next) => {
  try {
    const name = str(req.body.name, 100);
    const phone = str(req.body.phone, 20);
    const message = str(req.body.message, 2000);
    const product = str(req.body.product, 200);
    if (!phone && !name) {
      const err = new Error('Please share at least your name or phone number');
      err.status = 400;
      throw err;
    }
    await store.addEnquiry({ name, phone, message, product, createdAt: new Date() });
    res.json({ success: true, message: 'Thank you, your enquiry has been received.' });
  } catch (e) {
    next(e);
  }
});

module.exports = router;