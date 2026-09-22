'use client';

import { useCallback, useEffect, useState } from 'react';
import { apiGet } from '@/lib/api';
import { formatDateTime, formatDate } from '@/lib/format';
import RateCard from './RateCard';
import { RefreshIcon } from './icons';
import SectionHeading from './SectionHeading';

const STATUS_META = {
  live: { label: 'Live Rate', cls: 'bg-emerald-500/15 text-emerald-600 ring-emerald-500/30', dot: 'bg-emerald-500' },
  cached: { label: 'Cached Rate', cls: 'bg-amber-500/15 text-amber-700 ring-amber-500/30', dot: 'bg-amber-500' },
  fallback: { label: 'Reference Rates', cls: 'bg-amber-500/15 text-amber-700 ring-amber-500/30', dot: 'bg-amber-500' },
  unavailable: { label: 'Unavailable', cls: 'bg-rose-500/15 text-rose-600 ring-rose-500/30', dot: 'bg-rose-500' },
};

const RateSkeleton = () => (
  <div className="card p-5">
    <div className="flex items-center justify-between">
      <div className="skeleton h-4 w-32" />
      <div className="skeleton h-5 w-14" />
    </div>
    <div className="mt-5 grid grid-cols-2 gap-3">
      <div className="skeleton h-16 rounded-xl" />
      <div className="skeleton h-16 rounded-xl" />
    </div>
  </div>
);

export default function RatesSection({ compact = false }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    setError(null);
    try {
      const res = await apiGet('/api/rates');
      setData(res);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const meta = data?.meta;
  const status = STATUS_META[meta?.status] || STATUS_META.unavailable;

  return (
    <section id="live-rates" className="bg-marquee-gold relative overflow-hidden py-14 sm:py-20">
      <div className="dotted-line absolute inset-0 opacity-30" aria-hidden />
      <div className="container-x relative">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            align="left"
            eyebrow="Live Rates"
            hindi
            title="आज के सोने और चांदी के भाव"
            sub="IBJA benchmark rates • Updated automatically — सोने और चांदी की आज की दर, एक बार में।"
          />
          <div className="flex flex-wrap items-center gap-3">
            {meta && (
              <span className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold ring-1 ${status.cls}`}>
                <span className={`h-2 w-2 rounded-full ${status.dot} animate-pulse-dot`} />
                {status.label}
              </span>
            )}
            <button
              onClick={() => load({ silent: true })}
              disabled={refreshing}
              className="inline-flex items-center gap-2 rounded-full border border-gold-500/50 bg-white px-4 py-2 text-xs font-semibold text-gold-700 transition hover:bg-gold-50 disabled:opacity-60"
            >
              <RefreshIcon className={`h-4 w-4 ${refreshing ? 'animate-spin-slow' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        <div className="mt-9">
          {loading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[0, 1, 2, 3].map((i) => (
                <RateSkeleton key={i} />
              ))}
            </div>
          ) : data?.rates?.length ? (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {data.rates.map((r, i) => (
                  <div key={`${r.metal}-${r.purity}`} className="animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
                    <RateCard rate={r} />
                  </div>
                ))}
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <InfoChip label="Rate Date" value={meta?.date} />
                <InfoChip label="Last Updated" value={formatDateTime(meta?.updatedAt)} />
                <InfoChip label="Market Status" value={meta?.marketStatus || '—'} />
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-8 text-center">
              <p className="font-semibold text-rose-600">Rate temporarily unavailable.</p>
              <p className="mt-1 text-sm text-charcoal-500">
                हम जल्द ही आज के भाव अपडेट करेंगे। कृपया कुछ समय बाद दोबारा देखें।
              </p>
            </div>
          )}
        </div>

        {meta?.updatedAt && !loading && (
          <p className="mt-5 text-center text-xs font-medium text-charcoal-500">
            Last updated: <span className="text-gold-700">{formatDateTime(meta.updatedAt)}</span>
            {meta.source ? ` · Source: ${meta.source.toUpperCase()}` : ''}
          </p>
        )}

        {error && (
          <p className="mt-3 text-center text-xs text-rose-500">
            Latest rate temporarily unavailable. Showing cached reference where available.
          </p>
        )}

        <div className="mt-6 flex flex-col items-center gap-2 text-center">
          <p className="max-w-2xl text-[11px] leading-relaxed text-charcoal-500">
            Rates are indicative/benchmark rates and exclude GST &amp; making charges.
          </p>
          <p className="max-w-2xl text-[11px] leading-relaxed text-charcoal-400">
            Rates may not be published on Saturdays, Sundays and certain holidays.
          </p>
        </div>

        {!compact && (
          <div className="mt-8 text-center">
            <a href="/rates" className="text-sm font-bold text-gold-700 underline-offset-4 hover:underline">
              View history & calculator →
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

function InfoChip({ label, value }) {
  return (
    <div className="rounded-xl border border-gold-500/15 bg-white/70 px-4 py-3 text-center backdrop-blur">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-charcoal-400">{label}</p>
      <p className="mt-0.5 text-sm font-bold text-charcoal-800">{value || '—'}</p>
    </div>
  );
}