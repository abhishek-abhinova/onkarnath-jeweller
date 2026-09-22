'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { apiGet } from '@/lib/api';
import ProductCard from '@/components/site/ProductCard';
import { SearchIcon, CloseIcon } from '@/components/site/icons';

const allCats = ['all'];

export default function JewelleryPage() {
  return (
    <Suspense fallback={<JewellerySkeleton />}>
      <JewelleryList />
    </Suspense>
  );
}

function JewellerySkeleton() {
  return (
    <>
      <div className="bg-hero py-12 sm:py-14">
        <div className="container-x">
          <span className="eyebrow"><span className="h-px w-6 bg-gold-500/60" />Collection</span>
          <div className="skeleton mt-3 h-9 w-64 rounded-lg" />
          <div className="skeleton mt-3 h-4 w-80 max-w-full rounded-lg" />
        </div>
      </div>
      <div className="section-pad bg-ivory-100">
        <div className="container-x">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="card overflow-hidden">
                <div className="skeleton aspect-[4/3]" />
                <div className="space-y-3 p-5">
                  <div className="skeleton h-4 w-20" />
                  <div className="skeleton h-5 w-3/4" />
                  <div className="skeleton h-9" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function JewelleryList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCat = searchParams.get('cat') || 'all';

  const [categories, setCategories] = useState(null);
  const [products, setProducts] = useState(null);
  const [active, setActive] = useState(initialCat);
  const [query, setQuery] = useState('');
  const [error, setError] = useState(null);
  const loadedRef = useRef(initialCat);

  useEffect(() => {
    let alive = true;
    apiGet('/api/categories')
      .then((res) => alive && setCategories(res.categories || []))
      .catch(() => alive && setCategories([]));
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const cat = searchParams.get('cat') || 'all';
    setActive(cat);
  }, [searchParams]);

  useEffect(() => {
    setProducts(null);
    setError(null);
    let alive = true;
    const params = new URLSearchParams();
    if (active !== 'all') params.set('category', active);
    if (query.trim()) params.set('search', query.trim());
    apiGet(`/api/products?${params.toString()}`)
      .then((res) => alive && setProducts(res.products || []))
      .catch((e) => alive && setError(e.message));
    return () => {
      alive = false;
    };
  }, [active, query]);

  const select = (slug) => {
    if (slug === 'all') router.push('/jewellery');
    else router.push(`/jewellery?cat=${slug}`);
  };

  const chips = useMemo(
    () => [allCats[0], ...(categories || []).map((c) => c.slug)],
    [categories]
  );

  const activeLabel = categories?.find((c) => c.slug === active)?.name || (active === 'all' ? 'All Jewellery' : active);

  return (
    <>
      <div className="bg-hero py-12 sm:py-14">
        <div className="container-x">
          <span className="eyebrow"><span className="h-px w-6 bg-gold-500/60" />Collection</span>
          <h1 className="heading-hindi mt-3 text-3xl font-bold text-ivory-50 sm:text-4xl">हमारा आभूषण संग्रह</h1>
          <p className="mt-3 max-w-xl text-sm text-ivory-100/75">
            शुद्ध सोना, चांदी और स्टोन आभूषण — डिज़ाइन चुनें और व्हाट्सऐप पर कीमत व विवरण पूछें।
          </p>
        </div>
      </div>

      <section className="section-pad bg-ivory-100">
        <div className="container-x">
          {/* filters */}
          <div className="sticky top-[72px] z-30 -mx-4 bg-ivory-100/95 px-4 py-3 backdrop-blur">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="scrollbar-none -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
                <Chip active={active === 'all'} label="All" onClick={() => select('all')} />
                {(categories || []).map((c) => (
                  <Chip key={c._id} active={active === c.slug} label={c.name} onClick={() => select(c.slug)} />
                ))}
              </div>
              <div className="relative shrink-0 lg:w-64">
                <SearchIcon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search jewellery..."
                  className="input !pl-10"
                />
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-600"
                    aria-label="Clear search"
                  >
                    <CloseIcon className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <p className="mt-4 flex items-center gap-2 text-xs font-semibold text-charcoal-500">
            {activeLabel}
            <span className="rounded-full bg-gold-100 px-2 py-0.5 text-gold-700">
              {products ? products.length : '…'} designs
            </span>
          </p>

          <div className="mt-5">
            {!products ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="card overflow-hidden">
                    <div className="skeleton aspect-[4/3]" />
                    <div className="space-y-3 p-5">
                      <div className="skeleton h-4 w-20" />
                      <div className="skeleton h-5 w-3/4" />
                      <div className="skeleton h-9" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-ivory-300 bg-white/70 p-12 text-center">
                {error ? (
                  <>
                    <p className="font-semibold text-rose-500">Products temporarily unavailable.</p>
                    <p className="mt-1 text-sm text-charcoal-500">Please check back shortly.</p>
                  </>
                ) : (
                  <>
                    <p className="font-hindi text-3xl">🔎</p>
                    <p className="mt-2 font-display text-lg font-semibold text-charcoal-800">No jewellery found</p>
                    <p className="mt-1 text-sm text-charcoal-500">
                      Try a different category or search term — या हमें व्हाट्सऐप पर ज़रूर बताएं कि आप क्या ढूंढ रहे हैं।
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function Chip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full px-4 py-2 text-[13px] font-semibold transition-all active:scale-95 ${
        active
          ? 'bg-maroon-800 text-gold-100 shadow'
          : 'border border-charcoal-900/10 bg-white text-charcoal-600 hover:border-gold-500/40 hover:text-maroon-700'
      }`}
    >
      {label}
    </button>
  );
}