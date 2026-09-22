import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="grid min-h-[70vh] place-items-center bg-ivory-100 px-4">
      <div className="text-center">
        <p className="font-display text-7xl font-bold text-gold-400">404</p>
        <h1 className="mt-2 heading-hindi text-2xl font-bold text-charcoal-900">कुछ नहीं मिला</h1>
        <p className="mt-2 text-sm text-charcoal-500">The page or jewellery design you are looking for does not exist.</p>
        <Link href="/" className="btn btn-gold mt-6">Back Home</Link>
      </div>
    </section>
  );
}