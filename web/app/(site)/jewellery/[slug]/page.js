import { notFound } from 'next/navigation';
import { apiGet } from '@/lib/api';
import ProductDetailView from '@/components/site/ProductDetailView';
import { BUSINESS } from '@/lib/constants';

export const metadata = { title: 'Product', description: 'Jewellery by ओंकार नाथ अग्रवाल सर्राफ' };
export const dynamic = 'force-dynamic';

export default async function ProductDetailPage({ params }) {
  let product = null;
  try {
    const res = await apiGet(`/api/products/${params.slug}`);
    product = res.product;
  } catch {
    /* handled below */
  }

  if (!product) notFound();

  return (
    <>
      <ProductDetailView product={product} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            description: product.description,
            category: product.category,
            brand: { '@type': 'Brand', name: BUSINESS.name },
            image: product.images?.[0] || '/logo.svg',
          }),
        }}
      />
    </>
  );
}