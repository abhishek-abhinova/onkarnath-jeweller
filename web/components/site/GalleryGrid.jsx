'use client';

import { useEffect, useState } from 'react';
import { apiGet, resolveImage } from '@/lib/api';
import { fallbackArt } from '@/lib/artfallback';

export default function GalleryGrid({ limit = 8 }) {
  const [items, setItems] = useState(null);
  const [error, setError] = useState(null);
  const [failed, setFailed] = useState({});

  useEffect(() => {
    let alive = true;
    apiGet('/api/gallery')
      .then((res) => alive && setItems((res.gallery || []).slice(0, limit)))
      .catch((e) => alive && setError(e.message));
    return () => {
      alive = false;
    };
  }, [limit]);

  if (!items) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: limit }).map((_, i) => (
          <div key={i} className="skeleton aspect-square rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="rounded-2xl border border-ivory-300 bg-white/60 p-10 text-center text-sm text-charcoal-500">
        {error ? 'Gallery temporarily unavailable. Please check back shortly.' : 'गैलरी में कोई तस्वीर अभी उपलब्ध नहीं है।'}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((g, i) => {
        const src = failed[g._id] ? fallbackArt(g.title || '') : resolveImage(g.image);
        return (
          <figure
            key={g._id}
            className="group relative overflow-hidden rounded-2xl shadow-card"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <img
              src={src}
              alt={g.title || 'Jewellery'}
              loading="lazy"
              width={500}
              height={500}
              onError={() => setFailed((f) => ({ ...f, [g._id]: true }))}
              className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-maroon-950/85 to-transparent px-4 pb-3 pt-10">
              <p className="text-sm font-semibold text-gold-200">{g.title}</p>
              {g.category && <p className="text-[11px] text-ivory-100/70">{g.category}</p>}
            </figcaption>
          </figure>
        );
      })}
    </div>
  );
}