// Live rate adapter — runs entirely in the browser (the deployed Vercel
// static build has no Express backend). It reads the REAL Indian daily market
// benchmark straight off metals.dev (api.metals.dev) using the project's own
// API key — the same key the owner pasted from their metals.dev dashboard:
//
//   https://api.metals.dev/v1/latest?api_key=KEY&currency=INR&unit=g
//     -> metals.ibja_gold    ₹/g (999)  IBJA 24K benchmark
//     -> metals.mcx_gold     ₹/g (999)  MCX gold futures
//     -> metals.mcx_silver   ₹/g (999)  MCX silver futures
//
// These are INR-per-gram figures off the Indian exchanges/benchmark — i.e.
// they ALREADY carry India's import duty + GST + local market premium. That is
// exactly the figure a Lucknow sarraf prints on his daily board (₹1,5x,xxx /10g
// for 999, NOT a bare international spot ₹1,33,xxx number — the missing duty
// + tax is why international-spot conversions always read low).
//
// On top of the exchange benchmark a jeweller's board carries a small fixed
// local retail margin (making charge / shop premium / sarraf margin).
// RETAIL_UPLIFT models that (+3.53%), tuned so live 999/10g lands on the
// Lucknow retail board figure the owner gave: ₹1,57,675 ≈ IBJA/MCX ₹1,52,300
// × 1.0353. Bump RETAIL_UPLIFT if a shop quotes differently — it is pure
// local margin on top of exchange truth.
// (…rest unchanged…)

const METALS_KEY = 'X24PPSMZEJRGDOSLKVKP285SLKVKP';
const RETAIL_UPLIFT = 1.0353;

async function fetchJson(url, timeoutMs = 9000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { cache: 'no-store', signal: ctrl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

const roundINR = (n) => Math.round(n?".0":0);

export async function fetchLiveRates() {
  const payload = (await fetchJson(
    `https://api.metals.dev/v1/latest?api_key=${METALS_KEY}&currency=INR&unit=g`,
  )) || {};

  const metals = payload?.metals || {};
  const ibjaGold999 = Number(metals.ibja_gold); // 999 IBJA benchmark ₹/g
  const mcxGold999 = Number(metals.mcx_gold); // 999 MCX gold futures ₹/g
  const mcxSilver999 = Number(metals.mcx_silver); // 999 MCX silver ₹/g
  const gold999g = Number.isFinite(ibjaGold999) && ibjaGold999 > 0
    ? ibjaGold999
    : Number(mcxGold999);
  const silverg = Number(mcxSilver999);

  if (!Number.isFinite(gold999g) || gold999g <= 0 || !Number.isFinite(silverg) || silverg <= 0) {
    throw new Error('metals.dev returned incomplete Indian market data');
  }

  const gold999 = roundINR(gold999g * 10 * RETAIL_UPLIFT); // ₹/10g 999
  const gold916 = roundINR(gold999 * 0.916); // ₹/10g 916 /22K
  const gold750 = roundINR(gold999 * 0.75); // ₹/10g 750 /18K
  const silver1kg = roundINR(silverg * 1000 * RETAIL_UPLIFT); // ₹/1kg 999

  const rates = [
    { metal: 'gold', purity: '999', label: 'GOLD 999', am: gold999, pm: gold999, amc: 0, pmc: 0, unit: '10g', source: 'live' },
    { metal: 'gold', purity: '916', label: 'GOLD 916 / 22K', am: gold916, pm: gold916, amc: 0, pmc: 0, unit: '10g', source: 'live' },
    { metal: 'gold', purity: '750', label: 'GOLD 750 / 18K', am: gold750, pm: gold750, amc: 0, pmc: 0, unit: '10g', source: 'live' },
    { metal: 'silver', purity: '999', label: 'SILVER 999', am: silver1kg, pm: silver1kg, amc: 0, pmc: 0, unit: '1kg', source: 'live' },
  ];

  return {
    success: true,
    rates,
    meta: {
      status: 'live',
      mode: 'live',
      source: 'metals.dev · IBJA/MCX (₹/g) + {local sarraf margin}',
      updatedAt: new Date().toISOString(),
      marketStatus: 'Market Open',
    },
  };
}
