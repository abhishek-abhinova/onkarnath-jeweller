const { Router } = require('express');
const bcrypt = require('bcryptjs');
const env = require('../config/env');
const store = require('../data/store');
const rateService = require('../services/ibjaRateService');
const { signToken, requireAdmin } = require('../middleware/auth');
const { authLimiter, uploadLimiter } = require('../middleware/rateLimit');
const upload = require('../middleware/upload');
const { slugify, str, num, bool, idOf, required } = require('../middleware/validation');

const router = Router();

// ---------------------------------------------------------------- auth
router.post('/auth/login', authLimiter, async (req, res, next) => {
  try {
    const login = str(req.body.emailOrUsername, 200) || str(req.body.username, 200) || str(req.body.email, 200);
    const password = req.body.password || '';
    required(login, 'Email or username');
    required(password, 'Password');

    const user = await store.findUser({ email: login.toLowerCase() }) || await store.findUser({ username: login.toLowerCase() });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const token = signToken(user);
    const maxAge = 8 * 60 * 60 * 1000;
    res.cookie('onas_token', token, {
      httpOnly: true,
      secure: env.isProd,
      sameSite: env.isProd ? 'none' : 'lax',
      maxAge,
      path: '/',
    });
    res.json({
      success: true,
      token,
      user: { _id: user._id, name: user.name, email: user.email, username: user.username, role: user.role },
    });
  } catch (e) {
    next(e);
  }
});

router.get('/auth/me', requireAdmin, (req, res) => {
  res.json({ success: true, user: req.user });
});

router.post('/auth/logout', (_req, res) => {
  res.clearCookie('onas_token', { path: '/' });
  res.json({ success: true });
});

// ---------------------------------------------------------------- stats (dashboard)
router.get('/stats', requireAdmin, async (_req, res) => {
  const counts = await store.getStats();
  const latest = await rateService.getLatestRates();
  const status = rateService.getStatus();
  res.json({ success: true, counts, rates: latest, rateStatus: status });
});

// ---------------------------------------------------------------- products
router.get('/products', requireAdmin, async (req, res) => {
  const { total, items } = await store.listProducts({});
  res.json({ success: true, total, products: items });
});

router.post('/products', requireAdmin, async (req, res, next) => {
  try {
    const name = required(str(req.body.name, 200), 'Product name');
    const category = required(str(req.body.category, 100), 'Category');
    const purity = str(req.body.purity, 30);
    const weight = str(req.body.weight, 30);
    const description = str(req.body.description, 4000);
    const images = Array.isArray(req.body.images)
      ? req.body.images.map((i) => String(i).trim()).filter(Boolean).slice(0, 8)
      : [];
    const featured = bool(req.body.featured);
    const slug = slugify(name);

    let product = await store.getProductBySlug(slug);
    if (product) {
      const err = new Error('A product with this name already exists');
      err.status = 409;
      throw err;
    }
    product = await store.createProduct({ name, slug, category, purity, weight, description, images, featured });
    res.status(201).json({ success: true, product });
  } catch (e) {
    next(e);
  }
});

router.put('/products/:id', requireAdmin, async (req, res, next) => {
  try {
    const id = idOf(req.params.id);
    required(id, 'Product id');
    const existing = await store.getProductById(id);
    if (!existing) return res.status(404).json({ success: false, message: 'Product not found' });

    const patch = {};
    const name = str(req.body.name, 200);
    if (name) patch.name = name;
    patch.slug = slugify(patch.name || existing.name);
    if (typeof req.body.category === 'string' && req.body.category.trim()) patch.category = str(req.body.category, 100);
    if (typeof req.body.purity === 'string') patch.purity = str(req.body.purity, 30);
    if (typeof req.body.weight === 'string') patch.weight = str(req.body.weight, 30);
    if (typeof req.body.description === 'string') patch.description = str(req.body.description, 4000);
    if (Array.isArray(req.body.images)) patch.images = req.body.images.map((i) => String(i).trim()).filter(Boolean).slice(0, 8);
    if (typeof req.body.featured === 'boolean' || req.body.featured === 'true' || req.body.featured === 'false')
      patch.featured = bool(req.body.featured);

    const product = await store.updateProduct(id, patch);
    res.json({ success: true, product });
  } catch (e) {
    next(e);
  }
});

router.delete('/products/:id', requireAdmin, async (req, res, next) => {
  try {
    const id = idOf(req.params.id);
    required(id, 'Product id');
    const ok = await store.deleteProduct(id);
    res.json({ success: ok, message: ok ? 'Product deleted' : 'Product not found' });
  } catch (e) {
    next(e);
  }
});

// ---------------------------------------------------------------- categories
router.get('/categories', requireAdmin, async (_req, res) => {
  const categories = await store.listCategories();
  res.json({ success: true, categories });
});

router.post('/categories', requireAdmin, async (req, res, next) => {
  try {
    const name = required(str(req.body.name, 100), 'Category name');
    const description = str(req.body.description, 1000);
    const image = str(req.body.image, 500);
    const slug = slugify(name);
    const existing = await store.listCategories().then((c) => c.find((x) => x.slug === slug));
    if (existing) {
      const err = new Error('Category already exists');
      err.status = 409;
      throw err;
    }
    const category = await store.createCategory({ name, slug, description, image });
    res.status(201).json({ success: true, category });
  } catch (e) {
    next(e);
  }
});

router.put('/categories/:id', requireAdmin, async (req, res, next) => {
  try {
    const id = idOf(req.params.id);
    required(id, 'Category id');
    const patch = {};
    const name = str(req.body.name, 100);
    if (name) patch.name = name;
    patch.slug = slugify(patch.name || name);
    if (typeof req.body.description === 'string') patch.description = str(req.body.description, 1000);
    if (typeof req.body.image === 'string') patch.image = str(req.body.image, 500);
    const category = await store.updateCategory(id, patch);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, category });
  } catch (e) {
    next(e);
  }
});

router.delete('/categories/:id', requireAdmin, async (req, res, next) => {
  try {
    const id = idOf(req.params.id);
    required(id, 'Category id');
    const ok = await store.deleteCategory(id);
    res.json({ success: ok, message: ok ? 'Category deleted' : 'Category not found' });
  } catch (e) {
    next(e);
  }
});

// ---------------------------------------------------------------- upload
router.post('/upload', requireAdmin, uploadLimiter, upload.array('images', 8), (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      const err = new Error('No images uploaded');
      err.status = 400;
      throw err;
    }
    const urls = req.files.map((f) => `/uploads/${f.filename}`);
    res.status(201).json({ success: true, urls });
  } catch (e) {
    next(e);
  }
});

// ---------------------------------------------------------------- gallery
router.get('/gallery', requireAdmin, async (_req, res) => {
  const items = await store.listGallery();
  res.json({ success: true, gallery: items });
});

router.post('/gallery', requireAdmin, async (req, res, next) => {
  try {
    const image = required(str(req.body.image, 500), 'Image');
    const title = str(req.body.title, 200);
    const category = str(req.body.category, 100);
    const item = await store.createGalleryItem({ image, title, category });
    res.status(201).json({ success: true, item });
  } catch (e) {
    next(e);
  }
});

router.delete('/gallery/:id', requireAdmin, async (req, res, next) => {
  try {
    const id = idOf(req.params.id);
    required(id, 'Gallery id');
    const ok = await store.deleteGalleryItem(id);
    res.json({ success: ok, message: ok ? 'Deleted' : 'Not found' });
  } catch (e) {
    next(e);
  }
});

// ---------------------------------------------------------------- rates (admin)
router.get('/rates', requireAdmin, async (_req, res) => {
  const data = await rateService.getLatestRates();
  res.json({ success: true, ...data, rateStatus: rateService.getStatus() });
});

router.post('/rates/sync', requireAdmin, async (_req, res, next) => {
  try {
    const before = rateService.getStatus();
    await rateService.syncRates();
    if (env.RATES_MODE === 'ibja') {
      const after = rateService.getStatus();
      res.json({ success: true, before, after });
    } else {
      res.json({
        success: true,
        message: `Rates are in "${env.RATES_MODE}" mode. Provide IBJA credentials to enable live sync.`,
        status: rateService.getStatus(),
      });
    }
  } catch (e) {
    next(e);
  }
});

router.get('/rates/status', requireAdmin, (_req, res) => {
  res.json({ success: true, status: rateService.getStatus() });
});

router.get('/rates/history', requireAdmin, async (req, res) => {
  const limit = Math.min(500, num(req.query.limit) || 100);
  const history = await store.getRateHistory(limit);
  res.json({ success: true, history });
});

router.put('/rates/manual', requireAdmin, async (req, res, next) => {
  try {
    const metal = ['gold', 'silver'].includes(req.body.metal) ? req.body.metal : null;
    const purity = str(req.body.purity, 10);
    const am = num(req.body.am);
    const pm = num(req.body.pm);
    required(metal, 'Metal');
    required(purity, 'Purity');
    if (am === null && pm === null) {
      const err = new Error('Provide at least one rate value');
      err.status = 400;
      throw err;
    }
    const label = `${metal.toUpperCase()} ${purity}`;
    await rateService.saveRates([{ metal, purity, label, am, pm, unit: metal === 'gold' ? '10g' : '1kg' }], 'manual');
    const data = await rateService.getLatestRates();
    res.json({ success: true, ...data });
  } catch (e) {
    next(e);
  }
});

// ---------------------------------------------------------------- settings
const SETTING_KEYS = [
  'businessName',
  'tagline',
  'address',
  'phone',
  'whatsapp',
  'about',
  'bannerTitle',
  'bannerSubtitle',
];

router.get('/settings', requireAdmin, async (_req, res) => {
  const settings = await store.getSettings();
  res.json({ success: true, settings });
});

router.put('/settings', requireAdmin, async (req, res, next) => {
  try {
    const patch = {};
    for (const key of SETTING_KEYS) {
      if (req.body[key] !== undefined && req.body[key] !== null) patch[key] = String(req.body[key]).slice(0, 4000);
    }
    await store.setManySettings(patch);
    const settings = await store.getSettings();
    res.json({ success: true, settings });
  } catch (e) {
    next(e);
  }
});

module.exports = router;