// liveRates.js — live Indian bullion-rate adapter (browser, keyless, CORS-open).
//
// gold-api.com ships FREE, keyless, CORS-enabled (Access-Control-Allow-Origin: *)
// real-time prices — so the browser can hit it directly; no API key, no Vercel
// env var, no rate limit, INR supported. International INR spot is honest but is
// NOT an Indian jeweller's board: India applies import duty (BCD 15% + AIC) and
// GST on top. The owner's LIVE Lucknow retail board (GOLD 999/10g ₹1,57,675,
// SILVER 1kg ₹2,45,810) equals this international INR spot × the India uplift
// below — deterministic, tuned once, then purely live.
//
// Feeds (no key, CORS-open, browser-safe):
//   https://api.gold-api.com/price/XAU/INR   -> { price: ₹/troy oz gold }
//   https://api.gold-api.com/price/XAG/INR   -> { price: ₹/troy oz silver }

const BASE = "https://api.gold-api.com/price";
const TROY_OZ_G = 31.1034768; // grams per troy ounce

// India retail uplift = import duty + GST folded onto international INR spot
// (deterministic from the owner's live board ÷ live international INR spot):
//   GOLD 999/10g : ₹1,57,675 ÷ (₹13,302.4/g × 10) = 1.18523
//   SILVER 1kg   : ₹2,45,810 ÷ (₹2,01,392/kg)      = 1.22051
const RETAIL_UPLIFT_GOLD   = 1.18523;
const RETAIL_UPLIFT_SILVER = 1.22051;

const roundINR = (n) => Number.isFinite(Number(n)) ? Math.round(Number(n)) : 0;

async function fetchJson(url, timeoutMs = 9000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { cache: "no-store", signal: ctrl.signal });
    if (!res.ok) throw new Error("HTTP " + res.status);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchLiveRates() {
  const [gold, silver] = await Promise.all([
    fetchJson(`${BASE}/XAU/INR`),
    fetchJson(`${BASE}/XAG/INR`),
  ]);

  const goldPerOz = Number(gold?.price);
  const silverPerOz = Number(silver?.price);
  if (!Number.isFinite(goldPerOz) || goldPerOz <= 0) throw new Error("gold-api XAU/INR failed");
  if (!Number.isFinite(silverPerOz) || silverPerOz <= 0) throw new Error("gold-api XAG/INR failed");

  const gold999 = roundINR((goldPerOz / TROY_OZ_G) * 10 * RETAIL_UPLIFT_GOLD);  // ₹/10g 999
  const gold916 = roundINR(gold999 * 0.916); // ₹/10g 916 / 22K
  const gold750 = roundINR(gold999 * 0.75);  // ₹/10g 750 / 18K
  const silverKg = roundINR((silverPerOz / TROY_OZ_G) * 1000 * RETAIL_UPLIFT_SILVER); // ₹/1kg

  const rates = [
    { metal: "gold", purity: "999", label: "GOLD 999", am: gold999, pm: gold999, amc: 0, pmc: 0, unit: "10g", source: "live" },
    { metal: "gold", purity: "916", label: "GOLD 916 / 22K", am: gold916, pm: gold916, amc: 0, pmc: 0, unit: "10g", source: "live" },
    { metal: "gold", purity: "750", label: "GOLD 750 / 18K", am: gold750, pm: gold750, amc: 0, pmc: 0, unit: "10g", source: "live" },
    { metal: "silver", purity: "999", label: "SILVER 999", am: silverKg, pm: silverKg, amc: 0, pmc: 0, unit: "1kg", source: "live" },
  ];

  return {
    success: true,
    rates,
    meta: {
      status: "live",
      mode: "live",
      source: "gold-api.com · XAU/XAG INR + India duty uplift",
      updatedAt: new Date().toISOString(),
      marketStatus: "Market Open",
      live: true,
    },
  };
}
