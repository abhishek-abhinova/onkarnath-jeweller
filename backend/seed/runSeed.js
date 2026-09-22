const bcrypt = require('bcryptjs');
const store = require('../data/store');
const seed = require('./seedData');

const time = (d) => (d ? new Date(d).toISOString() : new Date().toISOString());

async function ensureSeed({ force = false } = {}) {
  const wrote = [];

  // Order matters: categories must exist before products (they aren't FK-joined,
  // but keeping slugs consistent avoids admin confusion).

  // --- admin user
  const existingUser = await store.findUser({ username: seed.ADMIN_USER.username });
  if (force || !existingUser) {
    const passwordHash = await bcrypt.hash(seed.ADMIN_USER.password, 10);
    await store.createUser({
      name: seed.ADMIN_USER.name,
      username: seed.ADMIN_USER.username,
      email: seed.ADMIN_USER.email,
      passwordHash,
      role: 'admin',
    });
    wrote.push(`admin user "${seed.ADMIN_USER.username}"`);
  }

  // --- categories
  const categories = await store.listCategories();
  for (const c of seed.CATEGORIES) {
    if (!categories.some((x) => x.slug === c.slug)) {
      await store.createCategory({ ...c, createdAt: time() });
      wrote.push(`category "${c.name}"`);
    }
  }

  // --- products
  const { items } = await store.listProducts({ limit: 1000 });
  for (const p of seed.PRODUCTS) {
    if (!items.some((x) => x.slug === slug(p.name))) {
      await store.createProduct({ ...p, slug: slug(p.name), createdAt: time() });
      wrote.push(`product "${p.name}"`);
    } else if (force) {
      const existing = items.find((x) => x.slug === slug(p.name));
      if (existing) await store.updateProduct(existing._id, { ...p, slug: slug(p.name) });
    }
  }

  // --- fallback rates (only when nothing cached yet, or forced)
  const latest = await store.getRates();
  if (force || latest.length === 0) {
    await store.setRates(seed.FALLBACK_RATES.map((r) => ({ ...r, timestamp: time() })));
    await store.addRateHistory(
      seed.FALLBACK_RATES.map((r) => ({ metal: r.metal, purity: r.purity, am: r.am, pm: r.pm, unit: r.unit, source: 'fallback' }))
    );
    wrote.push('fallback rates');
  }

  // --- settings
  const settings = await store.getSettings();
  for (const [k, v] of Object.entries(seed.SETTINGS)) {
    if (force || settings[k] === undefined) {
      await store.setSetting(k, v);
      wrote.push(`setting "${k}"`);
    }
  }

  // --- gallery
  const gallery = await store.listGallery();
  for (const g of seed.GALLERY) {
    if (!gallery.some((x) => x.image === g.image)) {
      await store.createGalleryItem({ ...g, createdAt: time() });
      wrote.push(`gallery "${g.title}"`);
    }
  }

  return { wrote, isFresh: !existingUser };
}

function slug(name = '') {
  return String(name).toLowerCase().trim().replace(/[^\w\u0900-\u097F]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
}

module.exports = { ensureSeed };

if (require.main === module) {
  (async () => {
    const { wrote } = await ensureSeed({ force: process.argv.includes('--force') });
    console.log('[seed] done. Items written:', wrote.length ? wrote.join(', ') : 'none (already seeded)');
    process.exit(0);
  })().catch((e) => {
    console.error('[seed] failed:', e);
    process.exit(1);
  });
}