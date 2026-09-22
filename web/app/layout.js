import './globals.css';
import { BUSINESS } from '@/lib/constants';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://onassarraf.in'),
  title: {
    default: 'ओंकार नाथ अग्रवाल सर्राफ | Gold & Silver Jewellery | Atarra, Banda',
    template: '%s | ओंकार नाथ अग्रवाल सर्राफ',
  },
  description:
    'ओंकार नाथ अग्रवाल सर्राफ, Atarra Banda — Gold, Silver and Jewellery. Check updated gold and silver benchmark rates, explore jewellery and contact us.',
  keywords: [
    'gold jewellery Atarra',
    'jewellery shop Atarra',
    'gold rate Banda',
    'silver rate Atarra',
    'sarraf Atarra',
    'gold jewellery Banda',
    'ओंकार नाथ अग्रवाल सर्राफ',
    'gold rate Atarra',
  ],
  authors: [{ name: 'ओंकार नाथ अग्रवाल सर्राफ' }],
  icons: { icon: '/icon.svg' },
  openGraph: {
    type: 'website',
    locale: 'hi_IN',
    siteName: BUSINESS.name,
    title: 'ओंकार नाथ अग्रवाल सर्राफ | Gold & Silver Jewellery | Atarra, Banda',
    description:
      'Trusted gold, silver and jewellery store on Naraini Road, Atarra, Banda. Live benchmark rates, premium jewellery catalogue and enquiry on WhatsApp.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: BUSINESS.name,
  alternateName: BUSINESS.nameLatin,
  description:
    'Gold and silver jewellery sarraf at Atarra, District Banda, Uttar Pradesh. Pure gold and silver jewellery, benchmark rates and trusted service.',
  telephone: `+91${BUSINESS.phone}`,
  image: '/logo.svg',
  priceRange: '₹₹',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Naraini Road',
    addressLocality: BUSINESS.locality,
    addressRegion: BUSINESS.state,
    postalCode: '210201',
    addressCountry: BUSINESS.country,
  },
  geo: { '@type': 'GeoCoordinates', latitude: 25.4353, longitude: 80.5674 },
  openingHours: 'Mo-Sa 10:00-20:00',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://onassarraf.in',
};

export default function RootLayout({ children }) {
  return (
    <html lang="hi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@400;500;600;700&family=Noto+Sans+Devanagari:wght@400;500;600;700&family=Noto+Serif+Devanagari:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}