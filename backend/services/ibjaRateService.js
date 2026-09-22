const env = require('../config/env');
const store = require('../data/store');

const GOLD = 'gold';
const SILVER = 'silver';

const UNITS = { gold: '10g', silver: '1kg' };

const SPECS = [
  { metal: GOLD, purity: '999', label: 'GOLD 999' },
  { metal: GOLD, purity: '916', label: 'GOLD 916 / 22K' },
  { metal: GOLD, purity: '750', label: 'GOLD 750 / 18K' },
  { metal: SILVER, purity: '999', label: 'SILVER 999' },
];

// in-memory state (also persisted to storage; memory serves fast validation + flight path)
const state = {
  lastSyncAt: null,
  lastSuccessAt: null,
  lastSource: null,
  lastError: null,
  syncing: false,
  manual: false,
};

const toNum = (v) => {
  const n =
    typeof v === 'number' ? v : typeof v === 'string' ? Number(String(v).replace(/[,\s₹]/g, '')) : NaN;
  return Number.isFinite(n) ? n : null;
};

const SANITY = {
  gold: { min: 50000, max: 400000 }, // ₹ per 10g (indicative daily range guard)
  silver: { min: 5000, max: 300000 }, // ₹ per 1kg
};

/**
 * Normalize a raw IBJA response into our standard shape:
 *   [{ metal, purity, label, am, pm, unit }]
 * Accepts object map schemas or an explicit array. Unknown input → throws.
 */
function normalizeRates(raw) {
  if (!raw) throw new Error('Empty response from rate source');

  const pickAmPm = (metal, purity) => {
    const node = raw[metal] && typeof raw[metal] === 'object' ? raw[metal][purity] : undefined;
    if (node && typeof node === 'object') {
      const am = toNum(node.am ?? node.buy ?? node.morning);
      const pm = toNum(node.pm ?? node.sell ?? node.evening);
      if (am || pm) return { am, pm };
    }
    return null;
  };

  const result = [];
  for (const spec of SPECS) {
    const v =
      raw[spec.metal] && typeof raw[spec.metal] === 'object' ? pickAmPm(spec.metal, spec.purity) : null;
    if (v) {
      result.push({ ...spec, unit: UNITS[spec.metal], am: v.am, pm: v.pm, source: 'ibja' });
      continue;
    }
    // flatter keys e.g. gold_999_am / gold999am
    const am = toNum(raw[`${spec.metal}_${spec.purity}_am`] ?? raw[`${spec.metal}${spec.purity}am`]);
    const pm = toNum(raw[`${spec.metal}_${spec.purity}_pm`] ?? raw[`${spec.metal}${spec.purity}pm`]);
    if (am || pm) result.push({ ...spec, unit: UNITS[spec.metal], am, pm, source: 'ibja' });
  }

  if (result.length === 0 && Array.isArray(raw)) {
    for (const item of raw) {
      const metal = item.metal === GOLD ? GOLD : item.metal === SILVER ? SILVER : GOLD;
      const purity = String(item.purity || '999');
      const am = toNum(item.am ?? item.rate ?? item.buy);
      const pm = toNum(item.pm ?? item.sell);
      if (am || pm) result.push({ metal, purity, label: `${metal.toUpperCase()} ${purity}`, am, pm, unit: UNITS[metal], source: 'ibja' });
    }
  }

  if (result.length === 0) {
    throw new Error('Rate source response could not be mapped to a known schema');
  }

  const valid = result.filter((r) => {
    const range = SANITY[r.metal];
    const okAm = r.am === null || (r.am >= range.min && r.am <= range.max);
    const okPm = r.pm === null || (r.pm >= range.min && r.pm <= range.max);
    return okAm && okPm && (r.am !== null || r.pm !== null);
  });

  if (valid.length === 0) throw new Error('Rate source returned values outside sanity range');
  return valid;
}

/**
 * Fetch current rates from the client's authorized IBJA API.
 * Never called from the browser — backend only. Credentials live in .env.
 */
async function fetchIBJARates() {
  if (!env.hasIBJACreds) {
    throw new Error('IBJA_API_URL / IBJA_API_KEY not configured in backend/.env');
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), env.IBJA_TIMEOUT_MS);

  const attempts = [1, 2]; // one retry
  let lastErr = null;
  for (const attempt of attempts) {
    try {
      const res = await fetch(env.IBJA_API_URL, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
          'X-IBJA-Key': env.IBJA_API_KEY,
          Authorization: `Bearer ${env.IBJA_API_KEY}`,
        },
      });
      if (!res.ok) throw new Error(`IBJA responded ${res.status}`);
      const raw = await res.json();
      return normalizeRates(raw);
    } catch (err) {
      lastErr = err;
      if (attempt < attempts.length) await new Promise((r) => setTimeout(r, 1000));
    }
  }
  throw lastErr || new Error('Rate fetch failed');
}

/**
 * Cache the fetched rates in storage + memory with a timestamp.
 */
async function saveRates(normalized, source = 'ibja') {
  const now = new Date();
  await store.setRates(
    normalized.map((r) => ({
      metal: r.metal,
      purity: r.purity,
      label: r.label,
      am: r.am,
      pm: r.pm,
      unit: r.unit,
      source,
      timestamp: now,
      apiUpdatedAt: now.toISOString(),
    }))
  );
  await store.addRateHistory(
    normalized.map((r) => ({
      metal: r.metal,
      purity: r.purity,
      am: r.am,
      pm: r.pm,
      unit: r.unit,
      source,
    }))
  );
  state.lastSyncAt = now;
  state.lastSuccessAt = now;
  state.lastSource = source;
  state.lastError = null;
  state.manual = source === 'manual';
  return normalized;
}

/**
 * One full sync cycle. Falls back to the last cached rates on failure
 * and never fabricates data.
 */
async function syncRates() {
  if (state.syncing) return state;
  state.syncing = true;
  try {
    if (env.RATES_MODE === 'ibja') {
      if (!env.hasIBJACreds) throw new Error('IBJA credentials missing in .env');
      const normalized = await fetchIBJARates();
      await saveRates(normalized, 'ibja');
    } else {
      // serve manual/fallback rates only — never pretend these are live
      state.lastSyncAt = new Date();
      state.lastSource = env.RATES_MODE === 'fallback' ? 'fallback' : 'cached';
    }
  } catch (err) {
    state.lastError = err.message;
    state.lastSource = 'cached';
  } finally {
    state.syncing = false;
  }
  return state;
}

function schedule() {
  const minutes = Math.max(5, env.RATES_SYNC_MINUTES);
  setInterval(() => {
    syncRates().catch((e) => console.warn('[rates] scheduled sync failed:', e.message));
  }, minutes * 60 * 1000);
}

const marketOpen = () => {
  const now = new Date();
  const ist = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  const day = ist.getDay();
  return day >= 1 && day <= 5 ? 'Open' : 'Closed';
};

/**
 * Latest cached rates with transparent status metadata for the UI.
 */
async function getLatestRates() {
  const stored = await store.getRates();
  const merged = SPECS.map((spec) => {
    const row = stored.find((r) => r.metal === spec.metal && r.purity === spec.purity);
    return {
      metal: spec.metal,
      purity: spec.purity,
      label: spec.label,
      am: row && typeof row.am === 'number' ? row.am : null,
      pm: row && typeof row.pm === 'number' ? row.pm : null,
      unit: UNITS[spec.metal],
      source: row ? row.source : null,
      timestamp: row ? row.timestamp : null,
    };
  });

  const hasAny = merged.some((r) => r.am !== null || r.pm !== null);
  const newest = merged
    .map((r) => (r.timestamp ? new Date(r.timestamp) : null))
    .filter(Boolean)
    .sort((a, b) => b - a)[0];

  const mode = env.RATES_MODE;
  const isLiveSource = state.lastSource === 'ibja';
  const stale = state.lastSyncAt && Date.now() - new Date(state.lastSyncAt).getTime() > 4 * 60 * 60 * 1000;

  let status;
  if (!hasAny) status = 'unavailable';
  else if (mode === 'fallback') status = 'fallback';
  else if (isLiveSource && !stale) status = 'live';
  else if (state.lastSource === 'cached') status = 'cached';
  else status = 'cached';

  return {
    rates: merged,
    meta: {
      status,
      mode,
      marketStatus: marketOpen(),
      date: newest ? newest.toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN'),
      updatedAt: newest ? newest.toISOString() : state.lastSyncAt ? state.lastSyncAt.toISOString() : null,
      source: state.lastSource,
      lastSyncAt: state.lastSyncAt ? state.lastSyncAt.toISOString() : null,
      lastError: state.lastError,
      available: hasAny,
    },
  };
}

function getStatus() {
  return {
    mode: env.RATES_MODE,
    hasCredentials: env.hasIBJACreds,
    lastSyncAt: state.lastSyncAt ? state.lastSyncAt.toISOString() : null,
    lastSuccessAt: state.lastSuccessAt ? state.lastSuccessAt.toISOString() : null,
    lastSource: state.lastSource,
    lastError: state.lastError,
    syncing: state.syncing,
    autoSyncMinutes: env.RATES_SYNC_MINUTES,
  };
}

module.exports = {
  SPECS,
  fetchIBJARates,
  normalizeRates,
  saveRates,
  syncRates,
  schedule,
  getLatestRates,
  getStatus,
};