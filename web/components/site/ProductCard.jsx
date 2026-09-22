'use client';

import { useState } from 'react';
import { resolveImage } from '@/lib/api';
import { fallbackArt } from '@/lib/artfallback';
import { waLink } from '@/lib/constants';
import { ArrowRightIcon, StarIcon } from './icons';

export default function ProductCard({ product, className = '' }) {
  const [src, setSrc] = useState(resolveImage(product.images?.[0]));

  const waMsg = `Hello, I am interested in ${product.name}. Please share details and price.`;

  return (
    <article className="group card flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-soft">
      <div className="relative overflow-hidden bg-ivory-200">
        {src ? (
          <img
            src={src}
            alt={product.name}
            loading="lazy"
            width={600}
            height={450}
            onError={() => setSrc(fallbackArt(product.name))}
            className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="aspect-[4/3] w-full bg-gradient-to-br from-ivory-100 to-ivory-300" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
        {product.featured && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-maroon-800/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-gold-200 backdrop-blur">
            <StarIcon className="h-3 w-3" /> Featured
          </span>
        )}
        {product.category && (
          <span className="absolute right-3 top-3 rounded-full bg-white/85 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-maroon-700 backdrop-blur">
            {product.category}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2">
          {product.purity && <span className="chip">{product.purity}</span>}
          {product.weight && <span className="text-xs font-medium text-charcoal-400">{product.weight}</span>}
        </div>
        <h3 className="mt-2 font-display text-lg font-semibold leading-snug text-charcoal-900">{product.name}</h3>
        <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-charcoal-500">{product.description}</p>

        <div className="mt-auto flex items-center gap-2 pt-5">
          <a
            href={`/jewellery/${product.slug}`}
            className="btn btn-dark flex-1 !px-3 !py-2.5 text-[13px]"
          >
            View Details <ArrowRightIcon className="h-3.5 w-3.5" />
          </a>
          <a
            href={waLink(waMsg)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Enquire about ${product.name} on WhatsApp`}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#1fa855] text-white transition hover:bg-[#189349] active:scale-95"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
            </svg>
          </a>
        </div>
      </div>
    </article>
  );
}