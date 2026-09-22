import { formatINR } from '@/lib/format';

const METAL_META = {
  gold: { label: 'Gold', dot: 'bg-gradient-to-br from-gold-300 to-gold-600' },
  silver: { dot: 'bg-gradient-to-br from-slate-200 to-slate-400' },
};

export default function RateCard({ rate }) {
  const meta = METAL_META[rate.metal] || METAL_META.gold;
  return (
    <article className="card group relative overflow-hidden p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-soft">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300 opacity-70" aria-hidden />
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2.5 text-sm font-bold uppercase tracking-wide text-charcoal-800">
          <span className={`h-3 w-3 rounded-full ${meta.dot} ring-2 ring-black/10`} aria-hidden />
          {rate.label}
        </span>
        <span className="rounded-full bg-ivory-200 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-charcoal-500">
          {rate.unit}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-ivory-100 p-3">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-charcoal-400">AM</p>
          <p className="mt-1 font-display text-lg font-bold leading-tight text-gold-700 sm:text-xl">
            {formatINR(rate.am)}
          </p>
        </div>
        <div className="rounded-xl bg-maroon-900 p-3">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-gold-300/80">PM</p>
          <p className="mt-1 font-display text-lg font-bold leading-tight text-gold-200 sm:text-xl">
            {formatINR(rate.pm)}
          </p>
        </div>
      </div>
    </article>
  );
}