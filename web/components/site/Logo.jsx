import { BUSINESS } from '@/lib/constants';

export default function Logo({ compact = false, light = false }) {
  return (
    <a href="/" className="group flex items-center gap-3">
      <span className="relative grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full ring-2 ring-gold-400/40 transition group-hover:ring-gold-400/80">
        <img src="/logo.svg" alt="ओंकार नाथ अग्रवाल सर्राफ logo" className="h-11 w-11" loading="lazy" />
      </span>
      {!compact && (
        <span className="leading-tight">
          <span className={`block font-hindi text-[15px] font-semibold tracking-wide ${light ? 'text-gold-200' : 'text-maroon-800'}`}>
            {BUSINESS.name}
          </span>
          <span className={`block text-[10px] font-semibold uppercase tracking-[0.28em] ${light ? 'text-gold-300/80' : 'text-charcoal-500'}`}>
            {BUSINESS.nameLatin}
          </span>
        </span>
      )}
    </a>
  );
}