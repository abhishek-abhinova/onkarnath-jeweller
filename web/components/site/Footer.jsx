import Logo from './Logo';
import { BUSINESS, NAV, callLink, waLink } from '@/lib/constants';
import { PhoneIcon, WhatsAppIcon, MapPinIcon, ArrowRightIcon } from './icons';

const CATEGORY_LINKS = [
  { label: 'Gold Jewellery', href: '/jewellery?cat=gold-jewellery' },
  { label: 'Silver Jewellery', href: '/jewellery?cat=silver-jewellery' },
  { label: 'Rings', href: '/jewellery?cat=rings' },
  { label: 'Necklaces', href: '/jewellery?cat=necklaces' },
  { label: 'Earrings', href: '/jewellery?cat=earrings' },
  { label: 'Bangles', href: '/jewellery?cat=bangles' },
  { label: 'Bridal Jewellery', href: '/jewellery?cat=bridal-jewellery' },
];

export default function Footer() {
  return (
    <footer className="bg-maroon-950 text-ivory-100/80">
      <div className="bg-maroon-900 py-10">
        <div className="container-x flex flex-col items-center gap-5 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <p className="font-hindi text-xl font-semibold text-gold-200">आज के लाइव सोने-चांदी के भाव देखें</p>
            <p className="mt-1 text-sm text-ivory-100/70">प्रतिदिन अपडेट होने वाले बेंचमार्क रेट — सिर्फ एक क्लिक पर।</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a href="/rates" className="btn btn-gold">
              देखें लाइव रेट <ArrowRightIcon className="h-4 w-4" />
            </a>
            <a href={waLink('नमस्ते, मुझे आज के सोने/चांदी के भाव की जानकारी चाहिए।')} target="_blank" rel="noopener noreferrer" className="btn btn-outline-dark">
              <WhatsAppIcon className="h-4 w-4" /> WhatsApp पर पूछें
            </a>
          </div>
        </div>
      </div>

      <div className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo light />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ivory-100/70">
            Naraini रोड, अटारा (बांदा) पर स्थित विश्वसनीय सर्राफ — शुद्ध सोने, चांदी एवं बेहतरीन आभूषणों के लिए पीढ़ियों का भरोसा।
          </p>
          <div className="mt-5 flex gap-3">
            <a href={callLink()} aria-label="Call" className="grid h-10 w-10 place-items-center rounded-full border border-gold-500/40 text-gold-300 transition hover:bg-gold-500/10">
              <PhoneIcon className="h-4 w-4" />
            </a>
            <a href={waLink('नमस्ते')} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="grid h-10 w-10 place-items-center rounded-full border border-gold-500/40 text-gold-300 transition hover:bg-gold-500/10">
              <WhatsAppIcon className="h-4 w-4" />
            </a>
            <a href={BUSINESS.mapsUrl} target="_blank" rel="noopener noreferrer" aria-label="Map" className="grid h-10 w-10 place-items-center rounded-full border border-gold-500/40 text-gold-300 transition hover:bg-gold-500/10">
              <MapPinIcon className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-gold-300">Quick Links</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {NAV.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="group inline-flex items-center gap-2 transition hover:text-gold-200">
                  <span className="h-px w-3 bg-gold-500/50 transition-all group-hover:w-5 group-hover:bg-gold-400" />
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-gold-300">Jewellery</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {CATEGORY_LINKS.map((item) => (
              <li key={item.href + item.label}>
                <a href={item.href} className="group inline-flex items-center gap-2 transition hover:text-gold-200">
                  <span className="h-px w-3 bg-gold-500/50 transition-all group-hover:w-5 group-hover:bg-gold-400" />
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-gold-300">Contact</h3>
          <address className="mt-4 space-y-3 text-sm not-italic">
            <p>
              <span className="font-semibold text-ivory-100">{BUSINESS.name}</span>
              <br />
              {BUSINESS.addressLines.map((l) => (
                <span key={l} className="block">{l}</span>
              ))}
            </p>
            <p>
              <a href={callLink()} className="inline-flex items-center gap-2 text-gold-300 transition hover:text-gold-200">
                <PhoneIcon className="h-4 w-4" /> +91 {BUSINESS.phoneDisplay.replace('+91 ', '')}
              </a>
            </p>
          </address>
          <a href="/rates" className="mt-4 inline-block text-sm font-semibold text-gold-300 underline-offset-4 transition hover:text-gold-200 hover:underline">
            आज के लाइव रेट →
          </a>
        </div>
      </div>

      <div className="border-t border-gold-500/10 py-8">
        <div className="container-x space-y-4 text-center">
          <p className="mx-auto max-w-3xl text-xs leading-relaxed text-ivory-100/50">
            Disclaimer: Gold &amp; Silver rates displayed are benchmark/reference rates and may exclude GST, making charges and other applicable charges. Rates are indicative only and may not be published on Saturdays, Sundays and certain holidays.
          </p>
          <p className="text-xs text-ivory-100/60">
            © 2026 {BUSINESS.name}. All Rights Reserved. · {BUSINESS.nameLatin}
          </p>
        </div>
      </div>
    </footer>
  );
}