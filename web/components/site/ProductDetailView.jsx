'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiGet, resolveImage } from '@/lib/api';
import { fallbackArt } from '@/lib/artfallback';
import { BUSINESS, callLink, waLink } from '@/lib/constants';
import ProductCard from './ProductCard';
import { PhoneIcon, WhatsAppIcon, ChevronRightIcon, ChevronLeftIcon } from './icons';

export default function ProductDetailView({ product: initial }) {
  const router = useRouter();
  const [product, setProduct] = useState(initial);
  const [img, setImg] = useState(initial ? 0 : 0);
  const [failed, setFailed] = useState({});
  const [related, setRelated] = useState(null);

  useEffect(() => {
    setProduct(initial);
    setImg(0);
  }, [initial]);

  useEffect(() => {
    if (!product?.category) return;
    let alive = true;
    apiGet(`/api/products?category=${encodeURIComponent(product.category)}&limit=4`)
      .then((res) => alive && setRelated((res.products || []).filter((p) => p._id !== product._id).slice(0, 4)))
      .catch(() => alive && setRelated([]));
    return () => {
      alive = false;
    };
  }, [product]);

  if (!product) return null;

  const images = product.images?.length ? product.images : [null];
  const src = failed[img] ? fallbackArt(product.name) : resolveImage(images[img]);
  const waMsg = `Hello, I am interested in ${product.name}. Please share details and price.`;

  return (
    <section className="section-pad bg-ivory-100">
      <div className="container-x">
        <nav className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-charcoal-400">
          <button onClick={() => router.push('/')} className="hover:text-gold-700">Home</button>
          <ChevronRightIcon className="h-3 w-3" />
          <button onClick={() => router.push('/jewellery')} className="hover:text-gold-700">Jewellery</button>
          <ChevronRightIcon className="h-3 w-3" />
          <span className="text-charcoal-600">{product.category}</span>
        </nav>

        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          {/* gallery */}
          <div>
            <div className="overflow-hidden rounded-3xl bg-ivory-200 shadow-card ring-1 ring-charcoal-900/5">
              <img
                src={src || fallbackArt(product.name)}
                alt={product.name}
                width={700}
                height={700}
                onError={() => setFailed((f) => ({ ...f, [img]: true }))}
                className="aspect-square w-full object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="mt-3 flex gap-3">
                {images.map((im, i) => (
                  <button
                    key={i}
                    onClick={() => setImg(i)}
                    className={`overflow-hidden rounded-xl ring-2 transition ${
                      img === i ? 'ring-gold-500' : 'ring-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={failed[i] ? fallbackArt(product.name) : resolveImage(im)}
                      alt=""
                      width={84}
                      height={84}
                      className="h-20 w-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* info */}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="chip">{product.category}</span>
              {product.featured && <span className="chip !text-maroon-700">★ Featured</span>}
            </div>
            <h1 className="heading-serif mt-3 text-3xl font-bold text-charcoal-900 sm:text-4xl">{product.name}</h1>
            <p className="mt-2 text-sm text-charcoal-400">{BUSINESS.name}</p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {product.purity && <Spec label="Purity" value={product.purity} />}
              {product.weight && <Spec label="Approx. Weight" value={product.weight} />}
              <Spec label="Purity Standard" value="BIS Hallmarked / 999 Fine" />
              <Spec label="Enquiry" value="WhatsApp / Call" />
            </div>

            <p className="mt-6 text-[15px] leading-relaxed text-charcoal-600">{product.description}</p>

            <div className="mt-8 rounded-2xl border border-gold-500/20 bg-white p-5">
              <p className="text-sm text-charcoal-500">
                Price depends on the day's {product.purity ? `${product.purity} ` : ''}rate, weight and making charges. Contact us for today's exact price.
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href={waLink(waMsg)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn flex-1 !py-3.5 bg-[#1fa855] text-white hover:bg-[#189349]"
              >
                <WhatsAppIcon className="h-4 w-4" /> WhatsApp Enquiry
              </a>
              <a href={callLink()} className="btn btn-dark flex-1 !py-3.5">
                <PhoneIcon className="h-4 w-4" /> Call Now
              </a>
            </div>
            <p className="mt-3 text-center text-[11px] text-charcoal-400">
              अधिक फ़ोटो, वजन और कीमत के लिए व्हाट्सऐप पर संपर्क करें।
            </p>
          </div>
        </div>
      </div>

      {related?.length > 0 && (
        <div className="mt-16 bg-white py-14">
          <div className="container-x">
            <h2 className="font-display text-2xl font-semibold text-charcoal-900">Similar in {product.category}</h2>
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function Spec({ label, value }) {
  return (
    <div className="rounded-xl bg-white p-4 ring-1 ring-charcoal-900/5">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-charcoal-400">{label}</p>
      <p className="mt-1 text-sm font-bold text-charcoal-800">{value || '—'}</p>
    </div>
  );
}