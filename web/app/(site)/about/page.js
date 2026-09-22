import AboutBody from '@/components/site/AboutBody';
import ScrollReveal from '@/components/site/ScrollReveal';
import { BUSINESS, callLink, waLink } from '@/lib/constants';
import { MapPinIcon, PhoneIcon, WhatsAppIcon, CheckIcon } from '@/components/site/icons';

export const metadata = {
  title: 'About Us — Atarra, Banda',
  description:
    'About ओंकार नाथ अग्रवाल सर्राफ — a trusted gold & silver sarraf on Naraini Road, Atarra, Banda. Pure jewellery, fair rates, honest service.',
};

const VALUES = [
  {
    title: 'शुद्धता का वादा',
    desc: 'हर सोने के आभूषण पर BIS हॉलमार्क और चांदी में 999 फाइन सिल्वर — शुद्धता को लेकर हम कभी समझौता नहीं करते।',
  },
  {
    title: 'पारदर्शी दरें',
    desc: 'आज का सोना-चांदी दर बोर्ड पर साफ प्रदर्शित; लेन-देन में कोई छिपा हुआ खर्च नहीं।',
  },
  {
    title: 'पीढ़ियों का भरोसा',
    desc: 'अटारा के परिवार हमारे साथ सगाई-शादी से लेकर रोज़मर्रा के आभूषणों तक का सफ़र तय करते आए हैं।',
  },
  {
    title: 'हर ग्राहक अपना है',
    desc: 'ग्राहक को समय, सलाह और सही मार्गदर्शन देना हमारा प्रत्येक दिन का नियम है।',
  },
];

export default function AboutPage() {
  return (
    <>
      <div className="bg-hero py-14 sm:py-16">
        <div className="container-x">
          <span className="eyebrow"><span className="h-px w-6 bg-gold-500/60" />About Us</span>
          <h1 className="heading-hindi mt-3 text-3xl font-bold text-ivory-50 sm:text-4xl">हमारी पहचान</h1>
          <p className="mt-3 max-w-xl text-sm text-ivory-100/75">
            अटारा, बांदा के बीचों-बीच विश्वास की एक परंपरा — शुद्ध सोना, चांदी और बेहतरीन सेवा।
          </p>
        </div>
      </div>

      <section className="section-pad bg-white">
        <div className="container-x grid gap-12 lg:grid-cols-2 lg:items-center">
          <ScrollReveal>
            <div className="relative overflow-hidden rounded-3xl shadow-soft">
              <img src="/images/products/gold-necklace.svg" alt="Traditional gold necklace by ओंकार नाथ अग्रवाल सर्राफ" className="w-full object-cover" loading="lazy" width={640} height={560} />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={120}>
            <span className="eyebrow"><span className="h-px w-6 bg-gold-500/60" />Our Story</span>
            <h2 className="heading-serif mt-3 text-3xl font-semibold text-charcoal-900 sm:text-4xl">
              सरलता में स्थित, भरोसे पर स्थापित
            </h2>
            <div className="mt-6">
              <AboutBody />
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href={callLink()} className="btn btn-dark"><PhoneIcon className="h-4 w-4" /> Call Us</a>
              <a href={waLink('नमस्ते, मुझे और जानकारी चाहिए।')} target="_blank" rel="noopener noreferrer" className="btn bg-[#1fa855] text-white hover:bg-[#189349]">
                <WhatsAppIcon className="h-4 w-4" /> WhatsApp
              </a>
              <a href={BUSINESS.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                <MapPinIcon className="h-4 w-4" /> Find Us
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="section-pad bg-marquee-gold relative overflow-hidden">
        <div className="dotted-line absolute inset-0 opacity-25" aria-hidden />
        <div className="container-x relative grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v, i) => (
            <ScrollReveal key={v.title} delay={i * 80}>
              <div className="card h-full p-6">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-maroon-800 text-gold-300">
                  <CheckIcon className="h-4 w-4" />
                </span>
                <h3 className="mt-4 font-hindi text-lg font-bold text-charcoal-900">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal-500">{v.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </>
  );
}