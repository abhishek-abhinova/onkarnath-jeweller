'use client';

import { useEffect, useMemo, useState } from 'react';
import { apiGet } from '@/lib/api';
import { formatINR } from '@/lib/format';
import { RupeeIcon, ScaleIcon } from './icons';

const GOLD_PURITIES = [
  { value: '999', label: '999 · 24K' },
  { value: '916', label: '916 · 22K' },
  { value: '750', label: '750 · 18K' },
  { value: '585', label: '585 · 14K' },
];
const SILVER_PURITIES = [
  { value: '999', label: '999 · Fine Silver' },
  { value: '925', label: '925 · Sterling' },
];

const toNum = (s) => {
  const n = parseFloat(s);
  return Number.isFinite(n) && n >= 0 ? n : 0;
};

export default function RateCalculator() {
  const [rates, setRates] = useState(null);
  const [metal, setMetal] = useState('gold');
  const [purity, setPurity] = useState('916');
  const [weight, setWeight] = useState(10);
  const [makingPct, setMakingPct] = useState(12);
  const [includeGst, setIncludeGst] = useState(true);
  const [ratesLoading, setRatesLoading] = useState(true);

  useEffect(() => {
    apiGet('/api/rates')
      .then((res) => setRates(res))
      .catch(() => setRates(null))
      .finally(() => setRatesLoading(false));
  }, []);

  const goldBase = useMemo(() => {
    const gold999 = rates?.rates?.find((r) => r.metal === 'gold' && r.purity === '999');
    return gold999?.am || null;
  }, [rates]);

  const silverBase = useMemo(() => {
    const silver = rates?.rates?.find((r) => r.metal === 'silver' && r.purity === '999');
    return silver?.am || null;
  }, [rates]);

  const basePerGram = useMemo(() => {
    if (metal === 'gold') {
      if (goldBase === null) return null;
      const p = parseInt(purity, 10) || 999;
      return (goldBase / 10) * (p / 999);
    }
    if (silverBase === null) return null;
    const p = parseInt(purity, 10) || 999;
    return (silverBase / 1000) * (p / 999);
  }, [metal, purity, goldBase, silverBase]);

  const w = toNum(weight);
  const baseValue = basePerGram !== null ? basePerGram * w : 0;
  const making = baseValue * (toNum(makingPct) / 100);
  const gst = includeGst ? (baseValue + making) * 0.03 : 0;
  const total = baseValue + making + gst;

  const rateNote =
    metal === 'gold'
      ? goldBase !== null
        ? `Based on today's gold 999 rate ${formatINR(goldBase)}/10g (scaled for purity)`
        : null
      : silverBase !== null
        ? `Based on today's silver rate ${formatINR(silverBase)}/1kg (scaled for purity)`
        : null;

  return (
    <section className="relative overflow-hidden bg-maroon-950 py-14 sm:py-20">
      <div className="pattern-zari absolute inset-0 opacity-20" aria-hidden />
      <div className="container-x relative grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <span className="eyebrow"><span className="h-px w-6 bg-gold-500/60" />Rate Calculator</span>
          <h2 className="heading-hindi mt-3 text-3xl text-ivory-50 sm:text-4xl">
            आभूषण का अनुमानित मूल्य <span className="gold-text">पाएं</span>
          </h2>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ivory-100/80">
            सोना/चांदी, शुद्धता और वजन चुनें — हमारा कैलकुलेटर तुरंत बेस मेटल वैल्यू, मेकिंग चार्ज और GST सहित अनुमानित कीमत दिखाता है।
          </p>

          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-gold-500/15 bg-maroon-900/60 p-4">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold-500/15 text-gold-300">
              <ScaleIcon className="h-4 w-4" />
            </span>
            <p className="text-xs leading-relaxed text-ivory-100/70">
              Estimated value only. Final price may vary based on jewellery design, making charges, wastage and applicable taxes.
            </p>
          </div>
        </div>

        <div className="card overflow-hidden !bg-white/95 p-6 backdrop-blur sm:p-8">
          {ratesLoading ? (
            <div className="space-y-4">
              <div className="skeleton h-10 w-1/2" />
              <div className="skeleton h-10" />
              <div className="skeleton h-44" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Metal</label>
                  <div className="grid grid-cols-2 gap-1 rounded-xl bg-ivory-200 p-1">
                    {['gold', 'silver'].map((m) => (
                      <button
                        key={m}
                        onClick={() => {
                          setMetal(m);
                          setPurity(m === 'gold' ? '916' : '999');
                        }}
                        className={`rounded-lg px-2 py-2.5 text-sm font-semibold capitalize transition ${
                          metal === m ? 'bg-maroon-800 text-gold-100 shadow' : 'text-charcoal-500 hover:text-charcoal-700'
                        }`}
                      >
                        {m === 'gold' ? 'Gold' : 'Silver'}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="label" htmlFor="purity">Purity</label>
                  <select
                    id="purity"
                    value={purity}
                    onChange={(e) => setPurity(e.target.value)}
                    className="input"
                  >
                    {(metal === 'gold' ? GOLD_PURITIES : SILVER_PURITIES).map((p) => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="label" htmlFor="weight">Weight (grams)</label>
                <div className="relative">
                  <input
                    id="weight"
                    type="number"
                    min="0"
                    step="0.5"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="input pr-14"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-charcoal-400">g</span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="label" htmlFor="making">Making Charges</label>
                  <div className="relative">
                    <input
                      id="making"
                      type="number"
                      min="0"
                      max="30"
                      value={makingPct}
                      onChange={(e) => setMakingPct(e.target.value)}
                      className="input pr-11"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-charcoal-400">%</span>
                  </div>
                </div>
                <div className="flex flex-col justify-end pb-1">
                  <button
                    onClick={() => setIncludeGst(!includeGst)}
                    className={`flex items-center justify-between rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                      includeGst
                        ? 'border-gold-500 bg-gold-50 text-gold-700'
                        : 'border-charcoal-900/10 text-charcoal-500'
                    }`}
                  >
                    GST 3%
                    <span className={`relative h-5 w-9 rounded-full transition ${includeGst ? 'bg-gold-500' : 'bg-charcoal-900/15'}`}>
                      <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${includeGst ? 'left-[18px]' : 'left-0.5'}`} />
                    </span>
                  </button>
                </div>
              </div>

              {basePerGram === null && (
                <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-xs font-medium text-rose-600">
                  Current benchmark rate unavailable. Please try again later.
                </p>
              )}

              <div className="mt-6 rounded-2xl bg-gradient-to-br from-maroon-800 to-maroon-950 p-5 text-ivory-50">
                <div className="space-y-2 text-sm">
                  <Row label={`Base Metal Value (${w}g)`} value={formatINR(baseValue)} />
                  <Row label={`Making Charges (${toNum(makingPct)}%)`} value={formatINR(making)} />
                  {includeGst && <Row label="GST (3%)" value={formatINR(gst)} />}
                  <div className="my-2 border-t border-gold-500/20" />
                  <div className="flex items-end justify-between">
                    <span className="text-sm font-semibold text-gold-200">Estimated Value</span>
                    <span className="flex items-center gap-1 font-display text-2xl font-bold text-gold-300">
                      <RupeeIcon className="h-4 w-4" /> {formatINR(total)}
                    </span>
                  </div>
                </div>
              </div>

              <p className="mt-3 text-[11px] leading-relaxed text-charcoal-400">
                {rateNote || 'Rates not available yet.'} Making charge % is an assumption — confirm actual charges at the store.
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-ivory-100/70">{label}</span>
      <span className="font-semibold text-ivory-50">{value}</span>
    </div>
  );
}