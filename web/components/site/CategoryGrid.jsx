'use client';

import { useEffect, useState } from 'react';
import { apiGet } from '@/lib/api';
import SectionHeading from './SectionHeading';

const CATEGORY_ICONS = {
  'gold-jewellery': '🪙',
  'silver-jewellery': '⚪',
  rings: '💍',
  necklaces: '📿',
  earrings: '🔔',
  bangles: '⭕',
  chains: '🔗',
  pendants: '✦',
  'bridal-jewellery': '👑',
};

const BG = [
  'from-gold-200/80 to-ivory-200',
  'from-maroon-100 to-ivory-200',
];

export default function CategoryGrid() {
  const [categories, setCategories] = useState(null);
  const [counts, setCounts] = useState({});

  useEffect(() => {
    let alive = true;
    apiGet('/api/categories')
      .then((res) => alive && setCategories(res.categories || []))
      .catch(() => alive && setCategories([]));
    apiGet('/api/products?limit=100')
      .then((res) => {
        if (!alive) return;
        const map = {};
        (res.products || []).forEach((p) => {
          map[p.category] = map[p.category] ? map[p.category] + 1 : 1;
        });
        setCounts(map);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section className="section-pad bg-marquee-gold relative overflow-hidden">
      <div className="container-x relative">
        <SectionHeading
          eyebrow="Categories"
          hindi
          title="अपनी पसंद का आभूषण चुनें"
          sub="सोने और चांदी के हर आभूषण के लिए श्रेणियाँ — डिज़ाइन देखें और व्हाट्सऐप पर पूछें।"
        />

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {(categories || Array.from({ length: 8 })).map((c, i) =>
            !c ? (
              <div key={i} className="skeleton aspect-[5/4] rounded-2xl" />
            ) : (
              <a
                key={c._id}
                href={`/jewellery?cat=${c.slug}`}
                className={`group relative overflow-hidden rounded-2xl border border-gold-500/15 bg-gradient-to-br ${BG[i % BG.length]} p-5 transition-all duration-300 hover:-translate-y-1 hover:border-gold-500/40 hover:shadow-soft`}
              >
                <span className="text-3xl opacity-80" aria-hidden>
                  {CATEGORY_ICONS[c.slug] || '✦'}
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-charcoal-900 group-hover:text-maroon-700">
                  {c.name}
                </h3>
                <p className="mt-0.5 text-xs font-semibold text-gold-700">
                  {counts[c.name] ? `${counts[c.name]} design${counts[c.name] > 1 ? 's' : ''}` : 'Browse designs'}
                </p>
                <span className="absolute right-4 top-4 grid h-7 w-7 place-items-center rounded-full bg-white/60 text-gold-700 opacity-0 transition group-hover:opacity-100">→</span>
              </a>
            )
          )}
        </div>
      </div>
    </section>
  );
}