import Hero from '@/components/site/Hero';
import RatesSection from '@/components/site/RatesSection';
import CategoryGrid from '@/components/site/CategoryGrid';
import FeaturedProducts from '@/components/site/FeaturedProducts';
import AboutTeaser from '@/components/site/AboutTeaser';
import RateCalculator from '@/components/site/RateCalculator';
import GalleryGrid from '@/components/site/GalleryGrid';
import ContactSection from '@/components/site/ContactSection';
import SectionHeading from '@/components/site/SectionHeading';
import ScrollReveal from '@/components/site/ScrollReveal';

export default function HomePage() {
  return (
    <>
      <RatesSection compact />
      <Hero />
      <CategoryGrid />

      <section className="section-pad bg-white">
        <div className="container-x">
          <ScrollReveal>
            <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-ivory-100 to-gold-100/70 p-1.5">
              <div className="grid items-center gap-6 rounded-[20px] bg-white/80 p-8 backdrop-blur sm:grid-cols-[auto_1fr]">
                <div className="text-center sm:text-left">
                  <p className="font-hindi text-4xl sm:text-5xl">✨</p>
                </div>
                <div className="text-center sm:text-left">
                  <p className="font-display text-2xl font-semibold text-charcoal-900 sm:text-3xl">
                    सगाई, शादी या किसी भी ख़ुशी के मौके पर
                  </p>
                  <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-charcoal-500 sm:mx-0">
                    ब्राइडल सेट से लेकर डेली-वियर आभूषणों तक — हमारे पास हर अवसर के लिए कुछ न कुछ है। आज ही दुकान पर आकर पसंदीदा डिज़ाइन चुनें।
                  </p>
                  <div className="mt-4 flex flex-wrap justify-center gap-3 sm:justify-start">
                    <a href="/jewellery" className="btn btn-gold">Browse Jewellery</a>
                    <a href="/contact" className="btn btn-outline">Visit the Store</a>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <FeaturedProducts />
      <AboutTeaser />
      <RateCalculator />

      <section className="section-pad bg-marquee-gold relative overflow-hidden">
        <div className="dotted-line absolute inset-0 opacity-25" aria-hidden />
        <div className="container-x relative">
          <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-end">
            <SectionHeading
              align="left"
              eyebrow="Gallery"
              hindi
              title="हमारी कारीगरी की झलक"
              sub="दुकान के कुछ प्रमुख डिज़ाइन — पूरी गैलरी देखने के लिए क्लिक करें।"
            />
            <a href="/gallery" className="btn btn-outline shrink-0">View Full Gallery</a>
          </div>
          <div className="mt-9">
            <GalleryGrid limit={8} />
          </div>
        </div>
      </section>

      <ContactSection compact />
    </>
  );
}