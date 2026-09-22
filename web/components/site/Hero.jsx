import { waLink } from '@/lib/constants';
import { WhatsAppIcon, ArrowRightIcon, CheckIcon } from './icons';
import ScrollReveal from './ScrollReveal';

const TRUST = [
  'Trusted Jewellery Store',
  'Live Gold & Silver Rates',
  'Quality Jewellery',
  'Customer Support',
];

export default function Hero() {
  return (
    <section className="bg-hero relative overflow-hidden">
      <div className="pattern-zari absolute inset-0 opacity-[0.35]" aria-hidden />
      <div className="absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" aria-hidden />
      <div className="absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-maroon-500/30 blur-3xl" aria-hidden />

      <div className="container-x relative grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-2 lg:py-24">
        <ScrollReveal>
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-500/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-gold-200">
              <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-gold-300" />
              पीढ़ियों का भरोसा · Atarra, Banda
            </span>

            <h1 className="mt-6 font-hindi text-[34px] font-bold leading-[1.2] text-ivory-50 sm:text-5xl lg:text-[54px] text-balance">
              विश्वास के साथ सोने और चांदी की{' '}
              <span className="gold-text">शुद्धता</span>
            </h1>

            <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-ivory-100/85 sm:text-base">
              ओंकार नाथ अग्रवाल सर्राफ — Atarra, Banda में विश्वसनीय सोना, चांदी एवं आभूषण।
              शुद्धता का प्रमाण, उचित मूल्य और हमेशा मुस्कुराता स्वागत।
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#live-rates" className="btn btn-gold !px-7 !py-3.5 text-base">
                देखें आज के लाइव रेट <ArrowRightIcon className="h-4 w-4" />
              </a>
              <a
                href={waLink('नमस्ते, मुझे आपके आभूषणों और रेट की जानकारी चाहिए।')}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-dark !px-7 !py-3.5 text-base"
              >
                <WhatsAppIcon className="h-4 w-4" /> WhatsApp पर संपर्क करें
              </a>
            </div>

            <ul className="mt-9 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
              {TRUST.map((t) => (
                <li key={t} className="flex items-center gap-2 text-[13px] font-medium text-ivory-100/90">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gold-500/20 text-gold-300">
                    <CheckIcon className="h-3 w-3" />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={150} className="relative mx-auto w-full max-w-lg lg:max-w-none">
          <div className="relative">
            <div className="absolute inset-0 -m-3 rounded-[28px] border border-gold-400/20" aria-hidden />
            <div className="overflow-hidden rounded-3xl shadow-[0_40px_80px_-30px_rgba(0,0,0,0.55)] ring-1 ring-gold-400/20">
              <img
                src="/images/products/bridal-necklace.svg"
                alt="Traditional Indian bridal gold jewellery — ओंकार नाथ अग्रवाल सर्राफ"
                className="aspect-[4/4.4] w-full object-cover"
                width={640}
                height={700}
                fetchPriority="high"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-maroon-950/40 via-transparent to-transparent" aria-hidden />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl bg-maroon-950/70 px-4 py-3 backdrop-blur-md">
                <div>
                  <p className="font-hindi text-sm font-semibold text-gold-200">ब्राइडल गोल्ड सेट</p>
                  <p className="text-[11px] text-ivory-100/70">Official catalogue · Worth your trust</p>
                </div>
                <a href="/jewellery" className="btn btn-gold !px-4 !py-2 text-xs">
                  View Jewellery
                </a>
              </div>
            </div>

            {/* floating rate chips */}
            <div className="absolute -left-3 top-6 hidden rounded-2xl border border-gold-400/25 bg-maroon-950/85 px-4 py-3 backdrop-blur-md sm:block">
              <p className="text-[10px] uppercase tracking-[0.18em] text-gold-300">Gold 22K · 10g</p>
              <p className="font-display text-xl font-bold text-gold-200">₹1,40,891</p>
            </div>
            <div className="absolute -right-2 bottom-24 hidden rounded-2xl border border-gold-400/25 bg-maroon-950/85 px-4 py-3 backdrop-blur-md sm:block">
              <p className="text-[10px] uppercase tracking-[0.18em] text-gold-300">Silver · 1kg</p>
              <p className="font-display text-xl font-bold text-ivory-100">₹1,02,410</p>
            </div>
          </div>
        </ScrollReveal>
      </div>

      <div className="relative border-t border-gold-500/10 bg-maroon-950/50">
        <div className="container-x flex flex-wrap items-center justify-center gap-x-8 gap-y-2 py-3.5 text-[12px] font-medium tracking-wide text-gold-300/80 sm:justify-between">
          <span>Hallmarked Purity ✓</span>
          <span>BIS 916 Gold</span>
          <span>999 Fine Silver</span>
          <span>Trusted Since Decades</span>
          <span>IBJA Benchmark Rates</span>
        </div>
      </div>
    </section>
  );
}