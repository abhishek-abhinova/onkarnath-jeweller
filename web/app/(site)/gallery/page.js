import GalleryGrid from '@/components/site/GalleryGrid';

export const metadata = {
  title: 'Gallery — Jewellery Designs',
  description: 'Gallery of designs from ओंकार नाथ अग्रवाल सर्राफ — necklaces, jhumkas, bangles, rings and silver jewellery.',
};

export default function GalleryPage() {
  return (
    <>
      <div className="bg-hero py-14 sm:py-16">
        <div className="container-x">
          <span className="eyebrow"><span className="h-px w-6 bg-gold-500/60" />Gallery</span>
          <h1 className="heading-hindi mt-3 text-3xl font-bold text-ivory-50 sm:text-4xl">हमारी डिज़ाइन गैलरी</h1>
          <p className="mt-3 max-w-xl text-sm text-ivory-100/75">
            दुकान की मुख्य डिज़ाइनों की झलक — पसंद आने पर व्हाट्सऐप पर पूछें या दुकान पर आएं।
          </p>
        </div>
      </div>
      <section className="section-pad bg-ivory-100">
        <div className="container-x">
          <GalleryGrid limit={24} />
        </div>
      </section>
    </>
  );
}