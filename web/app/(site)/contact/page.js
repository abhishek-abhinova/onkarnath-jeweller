import ContactSection from '@/components/site/ContactSection';
import { BUSINESS } from '@/lib/constants';

export const metadata = {
  title: 'Contact Us — Atarra, Banda',
  description:
    'Contact ओंकार नाथ अग्रवाल सर्राफ: Naraini Road, Atarra - 210201, Banda (UP). Call +91 9143914358 or WhatsApp for jewellery enquiries.',
};

export default function ContactPage() {
  return (
    <>
      <div className="bg-hero py-14 sm:py-16">
        <div className="container-x">
          <span className="eyebrow"><span className="h-px w-6 bg-gold-500/60" />Contact</span>
          <h1 className="heading-hindi mt-3 text-3xl font-bold text-ivory-50 sm:text-4xl">संपर्क करें</h1>
          <p className="mt-3 max-w-xl text-sm text-ivory-100/75">
            किसी भी आभूषण, रेट या ऑर्डर के लिए — कॉल, व्हाट्सऐप या सीधे दुकान पर।
          </p>
        </div>
      </div>

      <ContactSection />

      <section className="pb-16">
        <div className="container-x">
          <div className="overflow-hidden rounded-3xl shadow-soft ring-1 ring-charcoal-900/5">
            <iframe
              title="Map — ओंकार नाथ अग्रवाल सर्राफ, Naraini Road, Atarra"
              src={BUSINESS.mapsEmbed}
              width="100%"
              height="380"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block w-full border-0"
            />
          </div>
        </div>
      </section>
    </>
  );
}