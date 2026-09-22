// Live rate adapter — runs entirely in the browser on the deployed (Vercel /
// static) site where there is no Express backend. Every source is:
//   • keyless (no API key)   • CORS-open (Access-Control-Allow-Origin: *)
// so the client can fetch them directly. If any upstream is unreachable we
// reject, letting the caller fall back to the bundled demo dataset.
//
//   gold  (XAU) -> https://api.gold-api.com/price/XAU   USD per troy oz
//   silver(XAG) -> https://api.gold-api.com/price/XAG   USD per troy oz
//   fx    (INR) -> https://open.er-api.com/v6/latest/USD
//
// Conversions (1 troy oz = 31.1034768 g):
//   gold   10g  = XAU_USD * INR/USD * 10 / 31.1034768
//   gold   916  = gold999 * 0.916    (22K)
//   gold   750  = gold999 * 0.750    (18K)
//   silver 1kg  = XAG_USD * INR/USD * 1000 / 31.1034768

const TROY_OZ_GRAMS = 31.1034768;

async function fetchJson(url, timeoutMs = 9000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

const roundINR = (n) => Math.round(n);

export async function fetchLiveRates() {
  const [gold, silver, fx] = await Promise.all([
    fetchJson('https://api.gold-api.com/price/XAU'),
    fetchJson('https://api.gold-api.com/price/XAG'),
    fetchJson('https://open.er-api.com/v6/latest/USD'),
  ]);

  const xau = Number(gold?.price);
  const xag = Number(silver?.price);
  const inr = Number(fx?.rates?.INR);

  if (![xau, xag, inr].every((v) => Number.isFinite(v) && v > 0)) {
    throw new Error('Live rate source returned incomplete data');
  }

  // 1 troy oz of gold = XAU USD; silver = XAG USD. Convert to INR per local unit.
  const gold999 = roundINR((xau * inr * 10) / TROY_OZ_GRAMS); // ₹ per 10g
  const silver1kg = roundINR((xag * inr * 1000) / TROY_OZ_GRAMS); // ₹ per 1kg

  const rates = [
    { metal: 'gold', purity: '999', label: 'GOLD 999', am: gold999, pm: gold999, amc: 0, pmc: 0, unit: '10g', source: 'live' },
    { metal: 'gold', purity: '916', label: 'GOLD 916 / 22K', am: Math.round(gold999 * 0.916), pm: Math.round(gold999 * 0.916), amc: 0, pmc: 0, unit: '10g', source: 'live' },
    { metal: 'gold', purity: '750', label: 'GOLD 750 / 18K', am: Math.round(gold999 * 0.75), pm: Math.round(gold999 * 0.75), amc: 0, pmc: 0, unit: '10g', source: 'live' },
    { metal: 'silver', purity: '999', label: 'SILVER 999', am: silver1kg, pm: silver1kg, amc: 0, pmc: 0, unit: '1kg', source: 'live' },
  ];

  return {
    success: true,
    rates,
    meta: {
      status: 'live',
      mode: 'live',
      source: 'gold-api + open.er-api',
      updatedAt: new Date().toISOString(),
      upstream: { xau, xag, inrPerUsd: inr },
    },
  };
}
