'use client';

import { useEffect, useState } from 'react';
import { apiGet } from '@/lib/api';
import ProductCard from './ProductCard';
import SectionHeading from './SectionHeading';
import ScrollReveal from './ScrollReveal';
import { ArrowRightIcon } from './icons';

const SkeletonCard = () => (
  <div className="card overflow-hidden">
    <div className="skeleton aspect-[4/3]" />
    <div className="space-y-3 p-5">
      <div className="skeleton h-4 w-24" />
      <div className="skeleton h-5 w-3/4" />
      <div className="skeleton h-3 w-full" />
      <div className="flex gap-2 pt-2">
        <div className="skeleton h-9 flex-1" />
        <div className="skeleton h-9 w-10" />
      </div>
    </div>
  </div>
);

export default function FeaturedProducts() {
  const [products, setProducts] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    apiGet('/api/products?featured=true&limit=8')
      .then((res) => alive && setProducts(res.products || []))
      .catch((e) => alive && setError(e.message));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section className="section-pad bg-ivory-100">
      <div className="container-x">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            align="left"
            eyebrow="Collection"
            hindi
            title="हमारे खास आभूषण"
            sub="हर अवसर के लिए शुद्ध सोने-चांदी की बेहतरीन डिज़ाइन — सीधे हमारी दुकान से।"
          />
          <a href="/jewellery" className="btn btn-outline shrink-0 self-start sm:self-auto">
            View All Jewellery <ArrowRightIcon className="h-4 w-4" />
          </a>
        </div>

        <div className="mt-9">
          {!products ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[0, 1, 2, 3].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : products.length ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((p, i) => (
                <ScrollReveal key={p._id} delay={(i % 4) * 70}>
                  <ProductCard product={p} />
                </ScrollReveal>
              ))}
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-8 text-center text-sm text-amber-800">
              Featured products temporarily unavailable. Please check back shortly.
            </div>
          ) : (
            <div className="rounded-2xl border border-ivory-300 bg-white/60 p-8 text-center text-sm text-charcoal-500">
              Products will appear here as soon as they are added from the admin panel.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}