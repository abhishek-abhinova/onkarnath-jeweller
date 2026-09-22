'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  getToken,
  clearToken,
  adminGet,
  adminPost,
  adminPut,
  adminDelete,
  uploadImages,
} from '@/lib/adminClient';
import { API_URL } from '@/lib/api';
import { formatDateTime, formatINR, formatDate } from '@/lib/format';
import { fallbackArt } from '@/lib/artfallback';
import { CloseIcon, RefreshIcon, WhatsAppIcon, PhoneIcon } from '@/components/site/icons';

const NAV = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'products', label: 'Products' },
  { id: 'categories', label: 'Categories' },
  { id: 'rates', label: 'Rates' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'settings', label: 'Site Settings' },
];

export default function AdminPage() {
  const router = useRouter();
  const [view, setView] = useState('dashboard');
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!getToken()) {
      router.replace('/admin/login');
      return;
    }
    adminGet('/auth/me').then((res) => setUser(res.user)).catch(() => {});
  }, [router]);

  if (!getToken()) return null;

  return (
    <div className="flex min-h-screen">
      {/* sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col bg-maroon-950 lg:flex">
        <div className="flex items-center gap-3 border-b border-gold-500/15 px-5 py-5">
          <img src="/logo.svg" alt="" className="h-10 w-10 rounded-full" />
          <div className="leading-tight">
            <p className="font-hindi text-sm font-bold text-gold-200">सर्राफ Admin</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-gold-300/70">Onkar Nath Agrawal</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => setView(n.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm font-semibold transition ${
                view === n.id ? 'bg-gold-500/15 text-gold-200' : 'text-ivory-100/70 hover:bg-white/5 hover:text-ivory-100'
              }`}
            >
              {n.label}
            </button>
          ))}
        </nav>
        <div className="space-y-2 border-t border-gold-500/15 p-4">
          {user && <p className="px-1 text-xs text-ivory-100/60">Signed in as <b className="text-gold-200">{user.username}</b></p>}
          <a href="/" className="block rounded-xl px-4 py-2 text-sm font-semibold text-ivory-100/70 hover:bg-white/5">View Website →</a>
          <button
            onClick={() => {
              clearToken();
              router.replace('/admin/login');
            }}
            className="w-full rounded-xl bg-white/5 px-4 py-2 text-left text-sm font-semibold text-rose-300 hover:bg-white/10"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-40 flex items-center justify-between bg-maroon-950 px-4 py-3 lg:hidden">
        <p className="font-hindi text-sm font-bold text-gold-200">सर्राफ Admin</p>
        <button onClick={() => clearToken() || router.replace('/admin/login')} className="text-xs font-semibold text-rose-300">
          Logout
        </button>
      </div>

      <div className="flex-1 lg:pl-60">
        <div className="scrollbar-none sticky top-0 z-30 flex gap-2 overflow-x-auto bg-ivory-100/95 px-4 py-3 backdrop-blur lg:hidden">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => setView(n.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition ${
                view === n.id ? 'bg-maroon-800 text-gold-100' : 'bg-white text-charcoal-600'
              }`}
            >
              {n.label}
            </button>
          ))}
        </div>

        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {view === 'dashboard' && <Dashboard go={setView} />}
          {view === 'products' && <Products />}
          {view === 'categories' && <Categories />}
          {view === 'rates' && <Rates />}
          {view === 'gallery' && <Gallery />}
          {view === 'settings' && <Settings />}
        </main>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ shared */
function Card({ children, className = '' }) {
  return <div className={`card p-5 ${className}`}>{children}</div>;
}

function Stat({ label, value, sub, accent = false }) {
  return (
    <div className={`rounded-2xl p-5 ${accent ? 'bg-gradient-to-br from-maroon-800 to-maroon-950 text-ivory-50' : 'card'}`}>
      <p className={`text-[11px] font-bold uppercase tracking-[0.16em] ${accent ? 'text-gold-300/80' : 'text-charcoal-400'}`}>{label}</p>
      <p className={`mt-1.5 font-display text-2xl font-bold ${accent ? 'text-gold-200' : 'text-charcoal-900'}`}>{value}</p>
      {sub && <p className={`mt-1 text-xs ${accent ? 'text-ivory-100/60' : 'text-charcoal-400'}`}>{sub}</p>}
    </div>
  );
}

function Spinner() {
  return <span className="h-4 w-4 animate-spin rounded-full border-2 border-gold-500 border-t-transparent" />;
}

/* ------------------------------------------------------------------ dashboard */
function Dashboard({ go }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    setError('');
    adminGet('/stats')
      .then(setData)
      .catch((e) => setError(e.message));
  }, []);

  useEffect(load, [load]);

  const gold916 = data?.rates?.rates?.find((r) => r.metal === 'gold' && r.purity === '916');
  const silver = data?.rates?.rates?.find((r) => r.metal === 'silver' && r.purity === '999');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-charcoal-900">Dashboard</h1>
          <p className="text-sm text-charcoal-500">Overview of your store, rates and catalogue.</p>
        </div>
        <button onClick={load} className="btn btn-outline !px-4 !py-2 text-xs">Refresh</button>
      </div>

      {error && (
        <div className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">
          {error}
          <div className="skeleton mt-3 h-24" />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <Stat label="Total Products" value={data?.counts?.products ?? '—'} sub="in catalogue" accent />
        <Stat label="Categories" value={data?.counts?.categories ?? '—'} sub="active" />
        <Stat label="Gold 22K / 916" value={gold916 ? `₹${formatINR(gold916.am)}` : '—'} sub="per 10g · AM" />
        <Stat label="Silver 999" value={silver ? `₹${formatINR(silver.am)}` : '—'} sub="per 1kg · AM" />
        <Stat label="Last API Sync" value={data?.rateStatus?.lastSyncAt ? formatDateTime(data.rateStatus.lastSyncAt) : 'Never'} sub={`Mode: ${data?.rateStatus?.mode || '—'}`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="text-sm font-bold uppercase tracking-wide text-charcoal-600">Quick Actions</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <button onClick={() => go('products')} className="btn btn-dark">Add Product</button>
            <button onClick={() => go('categories')} className="btn btn-outline">Manage Categories</button>
            <button onClick={() => go('rates')} className="btn btn-outline">Sync Rates</button>
            <button onClick={() => go('settings')} className="btn btn-outline">Edit Business Info</button>
          </div>
        </Card>

        <Card>
          <h2 className="text-sm font-bold uppercase tracking-wide text-charcoal-600">API Connection</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-center justify-between">
              <span className="text-charcoal-500">Rates mode</span>
              <span className="font-semibold text-charcoal-800">{data?.rateStatus?.mode || '—'}</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-charcoal-500">IBJA credentials</span>
              <span className={`font-semibold ${data?.rateStatus?.hasCredentials ? 'text-emerald-600' : 'text-amber-600'}`}>
                {data?.rateStatus?.hasCredentials ? 'Configured' : 'Not configured'}
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-charcoal-500">Auto-sync every</span>
              <span className="font-semibold text-charcoal-800">{data?.rateStatus?.autoSyncMinutes || '—'} min</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-charcoal-500">Last error</span>
              <span className="max-w-[60%] truncate font-medium text-rose-500">{data?.rateStatus?.lastError || 'None'}</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ products */
const emptyProduct = { name: '', category: '', purity: '', weight: '', description: '', images: [], featured: false };

function Products() {
  const [products, setProducts] = useState(null);
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const load = useCallback(() => {
    Promise.all([adminGet('/products'), adminGet('/categories')])
      .then(([p, c]) => {
        setProducts(p.products || []);
        setCategories(c.categories || []);
      })
      .catch(() => {});
  }, []);

  useEffect(load, [load]);

  const save = async (form, id) => {
    setSaving(true);
    setMessage('');
    try {
      if (id) await adminPut(`/products/${id}`, form);
      else await adminPost('/products', form);
      setMessage(id ? 'Product updated.' : 'Product added.');
      setEditing(null);
      load();
    } catch (e) {
      setMessage(`Error: ${e.message}`);
    } finally {
      setSaving(false);
    }
  };

  const toggleFeatured = async (p) => {
    await adminPut(`/products/${p._id}`, { featured: !p.featured });
    load();
  };

  const remove = async (p) => {
    if (!confirm(`Delete "${p.name}"?`)) return;
    await adminDelete(`/products/${p._id}`);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-charcoal-900">Products</h1>
          <p className="text-sm text-charcoal-500">{products ? `${products.length} in catalogue` : 'Loading...'}</p>
        </div>
        <button onClick={() => setEditing({ ...emptyProduct })} className="btn btn-gold">+ Add Product</button>
      </div>
      {message && <Note text={message} />}

      {!products ? (
        <div className="space-y-3">
          <div className="skeleton h-16" />
          <div className="skeleton h-16" />
          <div className="skeleton h-16" />
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((p) => (
            <div key={p._id} className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
              <div className="flex min-w-0 flex-1 items-center gap-4">
                <img
                  src={p.images?.[0] && !p.images[0].startsWith('data:') ? API_URL + p.images[0] : fallbackArt(p.name)}
                  alt=""
                  className="h-16 w-16 shrink-0 rounded-xl object-cover"
                  onError={(e) => (e.currentTarget.src = fallbackArt(p.name))}
                />
                <div className="min-w-0">
                  <p className="truncate font-semibold text-charcoal-900">{p.name}</p>
                  <p className="text-xs text-charcoal-500">
                    {p.category} · {p.purity || '—'} · {p.weight || '—'}
                  </p>
                  <button onClick={() => toggleFeatured(p)} className={`mt-1 text-[11px] font-bold ${p.featured ? 'text-gold-700' : 'text-charcoal-400'}`}>
                    {p.featured ? '★ Featured' : '☆ Not featured'} — toggle
                  </button>
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <button onClick={() => setEditing({ ...p })} className="btn btn-outline !px-3 !py-2 text-xs">Edit</button>
                <button onClick={() => remove(p)} className="btn !px-3 !py-2 text-xs bg-rose-50 text-rose-600 hover:bg-rose-100">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <Modal title={editing._id ? 'Edit Product' : 'Add Product'} onClose={() => setEditing(null)}>
          <ProductForm
            initial={editing}
            categories={categories}
            saving={saving}
            onSave={(f) => save(f, editing._id)}
            onUploaded={(urls) => setEditing((e) => ({ ...e, images: [...e.images, ...urls] }))}
            onImageChange={(idx, url) => {
              setEditing((e) => {
                const imgs = [...e.images];
                imgs[idx] = url;
                return { ...e, images: imgs };
              });
            }}
            onNewImage={() => setEditing((e) => ({ ...e, images: [...e.images, ''] }))}
            onRemoveImage={(idx) => setEditing((e) => ({ ...e, images: e.images.filter((_, i) => i !== idx) }))}
          />
        </Modal>
      )}
    </div>
  );
}

function ProductForm({ initial, categories, saving, onSave, onUploaded, onImageChange, onNewImage, onRemoveImage }) {
  const [form, setForm] = useState(initial);
  const [uploading, setUploading] = useState(false);

  const set = (k) => (e) => {
    const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [k]: v }));
  };

  const handleFiles = async (files) => {
    if (!files?.length) return;
    setUploading(true);
    try {
      const res = await uploadImages(Array.from(files));
      onUploaded(res.urls);
    } catch (e) {
      alert(e.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(form);
      }}
      className="space-y-4"
    >
      <div>
        <label className="label">Product name*</label>
        <input className="input" value={form.name} onChange={set('name')} required />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Category*</label>
          <select className="input" value={form.category} onChange={set('category')} required>
            <option value="" disabled>Select…</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Featured</label>
          <label className="flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold text-charcoal-600">
            <input type="checkbox" checked={form.featured} onChange={set('featured')} /> Show on homepage
          </label>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Purity</label>
          <input className="input" placeholder="e.g. 22K / 916" value={form.purity} onChange={set('purity')} />
        </div>
        <div>
          <label className="label">Weight</label>
          <input className="input" placeholder="e.g. Approx. 12g" value={form.weight} onChange={set('weight')} />
        </div>
      </div>
      <div>
        <label className="label">Description</label>
        <textarea rows={3} className="input resize-none" value={form.description} onChange={set('description')} />
      </div>
      <div>
        <label className="label">Images</label>
        <div className="flex flex-wrap gap-2">
          {form.images.map((im, i) => (
            <div key={i} className="relative">
              <img src={im ? API_URL + im : ''} alt="" className="h-20 w-20 rounded-xl border object-cover" onError={(e) => (e.currentTarget.style.opacity = '0.25')} />
              <input className="mt-1 w-20 text-[10px]" value={im} onChange={(e) => onImageChange(i, e.target.value)} placeholder="path or URL" />
              <button type="button" onClick={() => onRemoveImage(i)} className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-rose-500 text-white">
                ×
              </button>
            </div>
          ))}
          <button type="button" onClick={onNewImage} className="grid h-20 w-20 place-items-center rounded-xl border border-dashed text-2xl text-charcoal-400">
            +
          </button>
        </div>
        <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-gold-100 px-4 py-2 text-xs font-bold text-gold-800">
          {uploading ? 'Uploading...' : 'Upload image files'}
          <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
        </label>
        <p className="mt-1 text-[11px] text-charcoal-400">Uploaded images are stored securely on the backend server.</p>
      </div>
      <button type="submit" disabled={saving || uploading} className="btn btn-gold w-full !py-3">
        {saving ? <Spinner /> : null} {editingLabel(initial)}
      </button>
    </form>
  );
}

function editingLabel(p) {
  return p?._id ? 'Update Product' : 'Add Product';
}

/* ------------------------------------------------------------------ categories */
function Categories() {
  const [categories, setCategories] = useState(null);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const load = useCallback(() => {
    adminGet('/categories').then((res) => setCategories(res.categories || [])).catch(() => {});
  }, []);
  useEffect(load, [load]);

  const save = async (form, id) => {
    setSaving(true);
    setMessage('');
    try {
      if (id) await adminPut(`/categories/${id}`, form);
      else await adminPost('/categories', form);
      setMessage(id ? 'Category updated.' : 'Category added.');
      setEditing(null);
      load();
    } catch (e) {
      setMessage(`Error: ${e.message}`);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (c) => {
    if (!confirm(`Delete category "${c.name}"? Products in it are not deleted.`)) return;
    await adminDelete(`/categories/${c._id}`);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-charcoal-900">Categories</h1>
          <p className="text-sm text-charcoal-500">Organise your jewellery catalogue.</p>
        </div>
        <button onClick={() => setEditing({ name: '', description: '' })} className="btn btn-gold">+ Add Category</button>
      </div>
      {message && <Note text={message} />}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {(categories || []).map((c) => (
          <div key={c._id} className="card p-5">
            <h3 className="font-display text-lg font-semibold text-charcoal-900">{c.name}</h3>
            <p className="text-xs text-charcoal-400">{c.slug}</p>
            <p className="mt-2 text-sm text-charcoal-600">{c.description}</p>
            <div className="mt-4 flex gap-2">
              <button onClick={() => setEditing(c)} className="btn btn-outline !px-3 !py-2 text-xs">Edit</button>
              <button onClick={() => remove(c)} className="btn !px-3 !py-2 text-xs bg-rose-50 text-rose-600 hover:bg-rose-100">Delete</button>
            </div>
          </div>
        ))}
      </div>
      {editing && (
        <Modal title={editing._id ? 'Edit Category' : 'Add Category'} onClose={() => setEditing(null)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              save(editing, editing._id);
            }}
            className="space-y-4"
          >
            <div>
              <label className="label">Name*</label>
              <input className="input" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} required />
            </div>
            <div>
              <label className="label">Description</label>
              <textarea rows={2} className="input resize-none" value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
            </div>
            <button type="submit" disabled={saving} className="btn btn-gold w-full !py-3">
              {saving ? <Spinner /> : null} {editing._id ? 'Update Category' : 'Add Category'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ rates */
function Rates() {
  const [status, setStatus] = useState(null);
  const [rates, setRates] = useState([]);
  const [history, setHistory] = useState([]);
  const [manual, setManual] = useState({ metal: 'gold', purity: '916', am: '', pm: '' });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  const load = useCallback(() => {
    adminGet('/rates').then((res) => {
      setStatus(res.rateStatus);
      setRates(res.rates || []);
    }).catch(() => {});
    adminGet('/rates/history?limit=100').then((res) => setHistory(res.history || [])).catch(() => {});
  }, []);
  useEffect(load, [load]);

  const syncNow = async () => {
    setBusy(true);
    setMessage('');
    try {
      const res = await adminPost('/rates/sync');
      setMessage(res.message || 'Sync triggered.');
      load();
    } catch (e) {
      setMessage(`Error: ${e.message}`);
    } finally {
      setBusy(false);
    }
  };

  const saveManual = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMessage('');
    try {
      const res = await adminPut('/rates/manual', {
        metal: manual.metal,
        purity: manual.purity,
        am: manual.am === '' ? null : Number(manual.am),
        pm: manual.pm === '' ? null : Number(manual.pm),
      });
      setMessage(`Manual fallback rate saved. Status now: ${res.meta?.status}`);
      load();
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-charcoal-900">Rate Management</h1>
          <p className="text-sm text-charcoal-500">IBJA live sync, cache status and manual fallback.</p>
        </div>
        <button onClick={syncNow} disabled={busy} className="btn btn-gold">
          {busy ? <Spinner /> : <RefreshIcon className="h-4 w-4" />} Sync Now
        </button>
      </div>
      {message && <Note text={message} tone={message.startsWith('Error') ? 'error' : 'ok'} />}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="text-sm font-bold uppercase tracking-wide text-charcoal-600">Connection Status</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <StatusRow label="Rates mode" value={status?.mode} />
            <StatusRow label="Auto sync" value={status ? `${status.autoSyncMinutes} min` : '—'} />
            <StatusRow label="IBJA credentials" value={status?.hasCredentials ? 'Configured ✓' : 'Not configured'} ok={status?.hasCredentials} />
            <StatusRow label="Last sync" value={status?.lastSyncAt ? formatDateTime(status.lastSyncAt) : 'Never'} />
            <StatusRow label="Last source" value={status?.lastSource || '—'} />
            <StatusRow label="Last error" value={status?.lastError || 'None'} ok={!status?.lastError} />
          </div>
          <p className="mt-4 rounded-xl bg-ivory-200 px-4 py-3 text-xs leading-relaxed text-charcoal-500">
            The IBJA API key never leaves the backend. The website and Android app read only from <code className="font-mono">GET /api/rates</code>. Set <code className="font-mono">IBJA_API_URL</code> and <code className="font-mono">IBJA_API_KEY</code> in <code className="font-mono">backend/.env</code> and switch <code className="font-mono">RATES_MODE=ibja</code>.
          </p>
        </Card>

        <Card>
          <h2 className="text-sm font-bold uppercase tracking-wide text-charcoal-600">Manual Fallback Rate</h2>
          <p className="mt-1 text-xs text-charcoal-500">Use only if the API is unavailable. UI will label these as reference rates.</p>
          <form onSubmit={saveManual} className="mt-4 space-y-3">
            <select className="input" value={manual.metal} onChange={(e) => setManual({ ...manual, metal: e.target.value })}>
              <option value="gold">Gold</option>
              <option value="silver">Silver</option>
            </select>
            <select className="input" value={manual.purity} onChange={(e) => setManual({ ...manual, purity: e.target.value })}>
              {['999', '916', '750'].map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <input className="input" type="number" placeholder={`AM rate (${manual.metal === 'gold' ? '₹/10g' : '₹/1kg'})`} value={manual.am} onChange={(e) => setManual({ ...manual, am: e.target.value })} />
            <input className="input" type="number" placeholder="PM rate (optional)" value={manual.pm} onChange={(e) => setManual({ ...manual, pm: e.target.value })} />
            <button type="submit" disabled={busy} className="btn btn-dark w-full">{busy ? <Spinner /> : null} Save Fallback Rate</button>
          </form>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="text-sm font-bold uppercase tracking-wide text-charcoal-600">Current Cached Rates</h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {rates.map((r) => (
              <div key={`${r.metal}${r.purity}`} className="rounded-xl bg-ivory-100 p-4">
                <p className="text-xs font-bold uppercase text-charcoal-500">{r.label}</p>
                <p className="mt-1 text-sm font-bold text-charcoal-800">AM: {formatINR(r.am)}</p>
                <p className="text-sm font-bold text-charcoal-800">PM: {formatINR(r.pm)}</p>
                <p className="mt-1 text-[10px] text-charcoal-400">{formatDateTime(r.timestamp)}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-sm font-bold uppercase tracking-wide text-charcoal-600">Rate History ({history.length})</h2>
          <div className="mt-4 max-h-80 overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-charcoal-400">
                  <th className="pb-2">Metal</th>
                  <th className="pb-2">AM</th>
                  <th className="pb-2">PM</th>
                  <th className="pb-2">Time</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h, i) => (
                  <tr key={i} className="border-t border-ivory-200">
                    <td className="py-2 font-semibold text-charcoal-700">{h.metal.toUpperCase()} {h.purity}</td>
                    <td className="py-2">{formatINR(h.am)}</td>
                    <td className="py-2">{formatINR(h.pm)}</td>
                    <td className="py-2 text-charcoal-400">{formatDate(h.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}

function StatusRow({ label, value, ok = true }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-ivory-100 px-4 py-3">
      <span className="text-xs font-semibold text-charcoal-500">{label}</span>
      <span className={`text-xs font-bold ${ok ? 'text-charcoal-800' : 'text-rose-500'}`}>{value || '—'}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ gallery */
function Gallery() {
  const [items, setItems] = useState(null);
  const [form, setForm] = useState({ title: '', category: '', image: '' });
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);

  const load = useCallback(() => {
    adminGet('/gallery').then((res) => setItems(res.gallery || [])).catch(() => {});
  }, []);
  useEffect(load, [load]);

  const add = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await adminPost('/gallery', form);
      setForm({ title: '', category: '', image: '' });
      setMessage('Image added to gallery.');
      load();
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  };

  const remove = async (g) => {
    if (!confirm('Remove this image?')) return;
    await adminDelete(`/gallery/${g._id}`);
    load();
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-charcoal-900">Gallery</h1>
      {message && <Note text={message} />}
      <Card>
        <h2 className="text-sm font-bold uppercase tracking-wide text-charcoal-600">Add Image</h2>
        <form onSubmit={add} className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <input className="input" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <input className="input" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <input className="input" placeholder="Image path or URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
          <div className="flex gap-2">
            <button type="submit" className="btn btn-gold flex-1">Add</button>
            <label className="btn btn-outline !px-3 cursor-pointer">
              Upload
              <input type="file" accept="image/*" multiple className="hidden" onChange={async (e) => {
                if (!e.target.files?.length) return;
                setUploading(true);
                try {
                  const res = await uploadImages(Array.from(e.target.files));
                  if (res.urls?.[0]) setForm((f) => ({ ...f, image: f.image || res.urls[0] }));
                } finally {
                  setUploading(false);
                }
              }} />
            </label>
          </div>
        </form>
      </Card>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {(items || []).map((g) => (
          <figure key={g._id} className="group relative overflow-hidden rounded-2xl">
            <img src={API_URL + g.image} alt={g.title} className="aspect-square w-full object-cover" onError={(e) => (e.currentTarget.style.opacity = '0.2')} loading="lazy" />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-2 pt-8 text-xs font-semibold text-white">
              {g.title || 'Untitled'}
            </figcaption>
            <button onClick={() => remove(g)} className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-rose-600 text-white opacity-0 transition group-hover:opacity-100">
              ×
            </button>
          </figure>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ settings */
function Settings() {
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const load = useCallback(() => {
    adminGet('/settings').then((res) => setForm(res.settings || {})).catch(() => {});
  }, []);
  useEffect(load, [load]);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const res = await adminPut('/settings', form);
      setForm(res.settings);
      setMessage('Settings saved. Changes appear on the website & app immediately.');
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-charcoal-900">Site Settings</h1>
        <p className="text-sm text-charcoal-500">These values drive the website, admin panel and Android app.</p>
      </div>
      {message && <Note text={message} tone="ok" />}
      {!form ? (
        <div className="skeleton h-96" />
      ) : (
        <form onSubmit={save} className="card space-y-4 p-6">
          <div>
            <label className="label">Business name (Hindi)</label>
            <input className="input" value={form.businessName || ''} onChange={set('businessName')} />
          </div>
          <div>
            <label className="label">Tagline</label>
            <input className="input" value={form.tagline || ''} onChange={set('tagline')} />
          </div>
          <div>
            <label className="label">Phone</label>
            <input className="input" value={form.phone || ''} onChange={set('phone')} />
          </div>
          <div>
            <label className="label">WhatsApp (with country code)</label>
            <input className="input" value={form.whatsapp || ''} onChange={set('whatsapp')} />
          </div>
          <div>
            <label className="label">Address</label>
            <textarea rows={3} className="input resize-none" value={form.address || ''} onChange={set('address')} />
          </div>
          <div>
            <label className="label">About section</label>
            <textarea rows={4} className="input resize-none" value={form.about || ''} onChange={set('about')} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Banner title</label>
              <input className="input" value={form.bannerTitle || ''} onChange={set('bannerTitle')} />
            </div>
            <div>
              <label className="label">Banner subtitle</label>
              <input className="input" value={form.bannerSubtitle || ''} onChange={set('bannerSubtitle')} />
            </div>
          </div>
          <button type="submit" disabled={saving} className="btn btn-gold w-full !py-3">
            {saving ? <Spinner /> : null} Save Settings
          </button>
        </form>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ small components */
function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative my-8 w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-charcoal-900">{title}</h2>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full bg-ivory-200 text-charcoal-600 hover:bg-ivory-300">
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Note({ text, tone = 'default' }) {
  const cls =
    tone === 'ok'
      ? 'bg-emerald-50 text-emerald-700'
      : tone === 'error'
        ? 'bg-rose-50 text-rose-600'
        : 'bg-ivory-200 text-charcoal-600';
  return <p className={`rounded-xl px-4 py-3 text-sm font-medium ${cls}`}>{text}</p>;
}