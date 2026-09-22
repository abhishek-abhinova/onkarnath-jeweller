const { mongoReady } = require('../config/db');
const M = require('../models');
const JsonStore = require('./JsonStore');

const json = new JsonStore();

const asDoc = (d) =>
  d && typeof d.toObject === 'function' ? d.toObject({ transform: true }) : d;

const cleanId = (d) => {
  const doc = asDoc(d);
  if (!doc) return doc;
  if (doc._id && doc._id.toString) doc._id = doc._id.toString();
  return doc;
};

const mapIds = (arr) => (Array.isArray(arr) ? arr.map(cleanId) : []);

function pick() {
  return mongoReady() ? M : null;
}

async function withStore(fn) {
  const models = pick();
  if (models) {
    try {
      return await fn(models);
    } catch (err) {
      if (err.name !== 'ValidationError') {
        console.warn('[store] Mongo call failed, using JSON fallback:', err.message);
      }
    }
  }
  return fn(null);
}

const clone = (obj) => JSON.parse(JSON.stringify(obj));

// ---------------------------------------------------------- users
const findUser = (query) =>
  withStore(async (m) => {
    if (m) {
      const mq = { ...query };
      if (mq.id) {
        mq._id = mq.id;
        delete mq.id;
      }
      return cleanId(await m.User.findOne(mq).lean());
    }
    return (
      json.data.users.find(
        (u) =>
          (query.email !== undefined && u.email === query.email) ||
          (query.username !== undefined && u.username === query.username) ||
          (query.id !== undefined && String(u._id) === String(query.id))
      ) || null
    );
  });

const createUser = (doc) =>
  withStore(async (m) => {
    if (m) return cleanId(await m.User.create(doc));
    doc._id = JsonStore.id();
    doc.createdAt = new Date().toISOString();
    doc.updatedAt = new Date().toISOString();
    json.data.users.push(clone(doc));
    json.persist();
    return doc;
  });

// ---------------------------------------------------------- products
const listProducts = async ({ category, featured, search, skip = 0, limit = 100 } = {}) => {
  const rows = await withStore(async (m) => {
    if (m) {
      const q = {};
      if (category && category !== 'all') q.category = category;
      if (featured !== undefined && featured !== null) q.featured = Boolean(featured);
      if (search) q.name = { $regex: search, $options: 'i' };
      const total = await m.Product.countDocuments(q);
      const items = await m.Product.find(q).sort({ createdAt: -1 }).skip(skip).limit(limit).lean();
      return { total, items: mapIds(items) };
    }
    let items = json.data.products.slice();
    if (category && category !== 'all') items = items.filter((p) => p.category === category);
    if (featured !== undefined && featured !== null)
      items = items.filter((p) => Boolean(p.featured) === Boolean(featured));
    if (search) items = items.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
    items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return { total: items.length, items: items.slice(skip, skip + limit) };
  });
  return rows || { total: 0, items: [] };
};

const getProductById = (id) =>
  withStore(async (m) => {
    if (m) return cleanId(await m.Product.findById(id).lean());
    return json.data.products.find((p) => p._id === id) || null;
  });

const getProductBySlug = (slug) =>
  withStore(async (m) => {
    if (m) return cleanId(await m.Product.findOne({ slug }).lean());
    return json.data.products.find((p) => p.slug === slug) || null;
  });

const createProduct = (doc) =>
  withStore(async (m) => {
    if (m) return cleanId(await m.Product.create(doc));
    doc._id = JsonStore.id();
    doc.createdAt = new Date().toISOString();
    doc.updatedAt = new Date().toISOString();
    json.data.products.push(clone(doc));
    json.persist();
    return doc;
  });

const updateProduct = (id, patch) =>
  withStore(async (m) => {
    if (m) {
      const doc = await m.Product.findByIdAndUpdate(id, patch, { new: true, runValidators: true }).lean();
      return cleanId(doc);
    }
    const idx = json.data.products.findIndex((p) => p._id === id);
    if (idx === -1) return null;
    const updated = { ...json.data.products[idx], ...patch, updatedAt: new Date().toISOString() };
    json.data.products[idx] = updated;
    json.persist();
    return updated;
  });

const deleteProduct = (id) =>
  withStore(async (m) => {
    if (m) return Boolean(await m.Product.findByIdAndDelete(id));
    const before = json.data.products.length;
    json.data.products = json.data.products.filter((p) => p._id !== id);
    if (json.data.products.length !== before) json.persist();
    return before !== json.data.products.length;
  });

// ---------------------------------------------------------- categories
const listCategories = () =>
  withStore(async (m) => {
    if (m) {
      const items = await m.Category.find().sort({ createdAt: 1 }).lean();
      return mapIds(items);
    }
    return clone(json.data.categories).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  });

const getCategoryById = (id) =>
  withStore(async (m) => {
    if (m) return cleanId(await m.Category.findById(id).lean());
    return json.data.categories.find((c) => c._id === id) || null;
  });

const createCategory = (doc) =>
  withStore(async (m) => {
    if (m) return cleanId(await m.Category.create(doc));
    doc._id = JsonStore.id();
    doc.createdAt = new Date().toISOString();
    doc.updatedAt = new Date().toISOString();
    json.data.categories.push(clone(doc));
    json.persist();
    return doc;
  });

const updateCategory = (id, patch) =>
  withStore(async (m) => {
    if (m) {
      const doc = await m.Category.findByIdAndUpdate(id, patch, { new: true, runValidators: true }).lean();
      return cleanId(doc);
    }
    const idx = json.data.categories.findIndex((c) => c._id === id);
    if (idx === -1) return null;
    const updated = { ...json.data.categories[idx], ...patch, updatedAt: new Date().toISOString() };
    json.data.categories[idx] = updated;
    json.persist();
    return updated;
  });

const deleteCategory = (id) =>
  withStore(async (m) => {
    if (m) return Boolean(await m.Category.findByIdAndDelete(id));
    const before = json.data.categories.length;
    json.data.categories = json.data.categories.filter((c) => c._id !== id);
    if (json.data.categories.length !== before) json.persist();
    return before !== json.data.categories.length;
  });

// ---------------------------------------------------------- rates
const getRates = () =>
  withStore(async (m) => {
    if (m) {
      const items = await m.Rate.find().lean();
      return mapIds(items);
    }
    return clone(json.data.rates);
  });

const setRates = (entries) =>
  withStore(async (m) => {
    if (m) {
      for (const e of entries) {
        await m.Rate.findOneAndUpdate(
          { metal: e.metal, purity: e.purity },
          { $set: { ...e, timestamp: new Date() } },
          { upsert: true, new: true }
        );
      }
      return;
    }
    for (const e of entries) {
      const idx = json.data.rates.findIndex((r) => r.metal === e.metal && r.purity === e.purity);
      const row = { ...e, _id: idx >= 0 ? json.data.rates[idx]._id : JsonStore.id(), timestamp: new Date().toISOString() };
      if (idx >= 0) json.data.rates[idx] = row;
      else json.data.rates.push(row);
    }
    json.persist();
  });

const addRateHistory = (entries) =>
  withStore(async (m) => {
    if (m) {
      await m.RateHistory.insertMany(entries);
      return;
    }
    const rows = entries.map((e) => ({ ...e, _id: JsonStore.id(), createdAt: new Date().toISOString() }));
    json.data.rate_history = json.data.rate_history.concat(rows);
    json.persist();
  });

const getRateHistory = (limit = 30) =>
  withStore(async (m) => {
    if (m) {
      const items = await m.RateHistory.find().sort({ createdAt: -1 }).limit(limit).lean();
      return mapIds(items);
    }
    return clone(json.data.rate_history)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
  });

// ---------------------------------------------------------- gallery
const listGallery = () =>
  withStore(async (m) => {
    if (m) {
      const items = await m.GalleryItem.find().sort({ createdAt: -1 }).lean();
      return mapIds(items);
    }
    return clone(json.data.gallery).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  });

const createGalleryItem = (doc) =>
  withStore(async (m) => {
    if (m) return cleanId(await m.GalleryItem.create(doc));
    doc._id = JsonStore.id();
    doc.createdAt = new Date().toISOString();
    doc.updatedAt = new Date().toISOString();
    json.data.gallery.push(clone(doc));
    json.persist();
    return doc;
  });

const deleteGalleryItem = (id) =>
  withStore(async (m) => {
    if (m) return Boolean(await m.GalleryItem.findByIdAndDelete(id));
    const before = json.data.gallery.length;
    json.data.gallery = json.data.gallery.filter((g) => g._id !== id);
    if (json.data.gallery.length !== before) json.persist();
    return before !== json.data.gallery.length;
  });

// ---------------------------------------------------------- settings
const toSettingsObject = (rows) => {
  const obj = {};
  for (const r of rows) obj[r.key] = r.value;
  return obj;
};

const getSettings = async () => {
  const rows = await withStore(async (m) => {
    if (m) {
      const items = await m.Setting.find().lean();
      return { rows: mapIds(items) };
    }
    return { rows: clone(json.data.site_settings) };
  });
  return toSettingsObject(rows.rows || []);
};

const setSetting = (key, value) =>
  withStore(async (m) => {
    if (m) {
      await m.Setting.findOneAndUpdate({ key }, { $set: { value } }, { upsert: true, new: true });
      return;
    }
    const idx = json.data.site_settings.findIndex((s) => s.key === key);
    if (idx >= 0) json.data.site_settings[idx].value = value;
    else {
      json.data.site_settings.push({
        _id: JsonStore.id(),
        key,
        value,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    json.persist();
  });

const setManySettings = async (obj) => {
  for (const [k, v] of Object.entries(obj)) await setSetting(k, v);
};

// ---------------------------------------------------------- enquiries
const addEnquiry = (doc) =>
  withStore(async (m) => {
    if (m) return cleanId(await m.Enquiry.create(doc));
    doc._id = JsonStore.id();
    doc.createdAt = new Date().toISOString();
    doc.updatedAt = new Date().toISOString();
    json.data.enquiries.push(clone(doc));
    json.persist();
    return doc;
  });

// ---------------------------------------------------------- stats
const getStats = async () => {
  const stats = await withStore(async (m) => {
    if (m) {
      return {
        products: await m.Product.countDocuments(),
        categories: await m.Category.countDocuments(),
        gallery: await m.GalleryItem.countDocuments(),
        enquiries: await m.Enquiry.countDocuments(),
        users: await m.User.countDocuments(),
      };
    }
    return {
      products: json.data.products.length,
      categories: json.data.categories.length,
      gallery: json.data.gallery.length,
      enquiries: json.data.enquiries.length,
      users: json.data.users.length,
    };
  });
  return stats || {};
};

module.exports = {
  findUser,
  createUser,
  listProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  listCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getRates,
  setRates,
  addRateHistory,
  getRateHistory,
  listGallery,
  createGalleryItem,
  deleteGalleryItem,
  getSettings,
  setSetting,
  setManySettings,
  addEnquiry,
  getStats,
};