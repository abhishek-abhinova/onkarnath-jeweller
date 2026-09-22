import RatesSection from '@/components/site/RatesSection';
import RateCalculator from '@/components/site/RateCalculator';

export const metadata = {
  title: 'Live Gold & Silver Rates — Atarra, Banda',
  description:
    'आज के सोने और चांदी के भाव: IBJA benchmark rates for gold 999, 916/22K, 750/18K and silver 999. Rate calculator included.',
};

export default function RatesPage() {
  return (
    <>
      <div className="bg-hero py-14 sm:py-16">
        <div className="container-x">
          <span className="eyebrow"><span className="h-px w-6 bg-gold-500/60" />Live Rates</span>
          <h1 className="heading-hindi mt-3 text-3xl font-bold text-ivory-50 sm:text-4xl">आज के सोने और चांदी के भाव</h1>
          <p className="mt-3 max-w-xl text-sm text-ivory-100/75">
            IBJA benchmark rates • Updated automatically. ये दरें सूचक/बेंचमार्क हैं और इनमें GST व मेकिंग चार्ज शामिल नहीं है।
          </p>
        </div>
      </div>

      <RatesSection />
      <RateCalculator />
    </>
  );
}