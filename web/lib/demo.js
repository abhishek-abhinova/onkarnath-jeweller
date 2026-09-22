// Bundled demo catalogue used by the deployed (Vercel / static) website so the
// site always renders complete content — even when the Express API is not
// reachable (there is no always-on backend behind a static host).
//
// Local dev still talks to the real API (lib/api.js) and gets live data.
// This module only serves as a graceful, fully-populated fallback so a
// prospective customer browsing the site never sees an empty page.

const IMG = (name) => `/seed/${name}.png`;

export const CATEGORIES = [
  { name: 'Gold Jewellery', slug: 'gold-jewellery', description: 'Trusted BIS hallmarked gold jewellery for every occasion.' },
  { name: 'Silver Jewellery', slug: 'silver-jewellery', description: 'Handcrafted silver ornaments and daily-wear pieces.' },
  { name: 'Rings', slug: 'rings', description: 'Gold, silver and stone rings for men and women.' },
  { name: 'Necklaces', slug: 'necklaces', description: 'Elegant gold necklaces and chains.' },
  { name: 'Earrings', slug: 'earrings', description: 'Jhumkas, studs and drops crafted with fine detail.' },
  { name: 'Bangles', slug: 'bangles', description: 'Classic gold bangles with premium finish.' },
  { name: 'Chains', slug: 'chains', description: 'Durable everyday chains in multiple purities.' },
  { name: 'Pendants', slug: 'pendants', description: 'Meaningful pendants and lockets for daily wear.' },
  { name: 'Bridal Jewellery', slug: 'bridal-jewellery', description: 'Complete bridal sets for your special day.' },
];

export const PRODUCTS = [
  {
    _id: 'demo-gold-necklace',
    name: 'Traditional Gold Necklace',
    slug: 'traditional-gold-necklace',
    category: 'Necklaces',
    purity: '22K / 916',
    weight: 'Approx. 24g',
    purityLabel: '22K · 916',
    featured: true,
    description:
      'A classic 22 karat gold necklace in antique finish — a timeless piece built on generations of trust.',
    images: [IMG('gold-necklace')],
  },
  {
    _id: 'demo-bridal-set',
    name: 'Bridal Gold Necklace Set',
    slug: 'bridal-gold-necklace-set',
    category: 'Bridal Jewellery',
    purity: '22K / 916',
    weight: 'Approx. 42g',
    purityLabel: '22K · 916',
    featured: true,
    description:
      'A full bridal ensemble — layered necklace, pair of jhumkas and maang tikka in polished gold.',
    images: [IMG('bridal-necklace')],
  },
  {
    _id: 'demo-gold-jhumka',
    name: 'Gold Jhumka Earrings',
    slug: 'gold-jhumka-earrings',
    category: 'Earrings',
    purity: '22K / 916',
    weight: 'Approx. 9g',
    purityLabel: '22K · 916',
    featured: true,
    description: 'Traditional bell-shaped jhumkas with rich gold finish and fine filigree detail.',
    images: [IMG('gold-jhumka')],
  },
  {
    _id: 'demo-gold-bangles',
    name: 'Gold Bangles Set',
    slug: 'gold-bangles-set',
    category: 'Bangles',
    purity: '22K / 916',
    weight: 'Approx. 32g',
    purityLabel: '22K · 916',
    featured: true,
    description: 'Hallmarked gold bangles with premium finish — sleek, classic and polished for daily wear.',
    images: [IMG('gold-bangles')],
  },
  {
    _id: 'demo-gold-ring',
    name: 'Gold Ring',
    slug: 'gold-ring',
    category: 'Rings',
    purity: '22K / 916',
    weight: 'Approx. 4g',
    purityLabel: '22K · 916',
    featured: false,
    description: 'A clean everyday gold ring with fine detailing, available in any size.',
    images: [IMG('gold-ring')],
  },
  {
    _id: 'demo-gold-chain',
    name: 'Gold Chain',
    slug: 'gold-chain',
    category: 'Chains',
    purity: '22K / 916',
    weight: 'Approx. 20g',
    purityLabel: '22K · 916',
    featured: false,
    description: 'A durable, well-finished gold chain that pairs with any pendant.',
    images: [IMG('gold-chain')],
  },
  {
    _id: 'demo-diamond-ring',
    name: 'Diamond Ring',
    slug: 'diamond-ring',
    category: 'Rings',
    purity: '18K / 750',
    weight: 'Approx. 3g',
    purityLabel: '18K · 750',
    featured: false,
    description: 'A brilliant diamond-set ring in polished 18 karat gold — a sparkle for every celebration.',
    images: [IMG('diamond-ring')],
  },
  {
    _id: 'demo-silver-payal',
    name: 'Silver Payal',
    slug: 'silver-payal',
    category: 'Silver Jewellery',
    purity: '999 / Fine',
    weight: 'Approx. 280g (pair)',
    purityLabel: '999 · Fine',
    featured: true,
    description: 'Traditional silver payal with fine detailing — comfort and elegance in pure silver.',
    images: [IMG('silver-payal')],
  },
];

export const RATES = [
  { metal: 'gold', purity: '999', label: 'GOLD 999', am: 153680, pm: 153742, amc: 0, pmc: 0, unit: '10g', source: 'demo' },
  { metal: 'gold', purity: '916', label: 'GOLD 916 / 22K', am: 140891, pm: 140948, amc: 0, pmc: 0, unit: '10g', source: 'demo' },
  { metal: 'gold', purity: '750', label: 'GOLD 750 / 18K', am: 115402, pm: 115452, amc: 0, pmc: 0, unit: '10g', source: 'demo' },
  { metal: 'silver', purity: '999', label: 'SILVER 999', am: 104210, pm: 104301, amc: 0, pmc: 0, unit: '1kg', source: 'demo' },
];

export const GALLERY = [
  { _id: 'demo-g1', title: 'Gold Necklace', category: 'Necklaces', image: IMG('gold-necklace') },
  { _id: 'demo-g2', title: 'Bridal Set', category: 'Bridal', image: IMG('bridal-necklace') },
  { _id: 'demo-g3', title: 'Jhumka', category: 'Earrings', image: IMG('gold-jhumka') },
  { _id: 'demo-g4', title: 'Bangles', category: 'Bangles', image: IMG('gold-bangles') },
  { _id: 'demo-g5', title: 'Ring', category: 'Rings', image: IMG('gold-ring') },
  { _id: 'demo-g6', title: 'Chain', category: 'Chains', image: IMG('gold-chain') },
  { _id: 'demo-g7', title: 'Diamond Ring', category: 'Rings', image: IMG('diamond-ring') },
  { _id: 'demo-g8', title: 'Silver Payal', category: 'Silver', image: IMG('silver-payal') },
];

export const SETTINGS = {
  businessName: 'ओंकार नाथ अग्रवाल सर्राफ',
  tagline: 'विश्वास के साथ सोने और चांदी की शुद्धता',
  address: 'Naraini Road, Atarra - 210201, District Banda, Uttar Pradesh, India',
  phone: '9143914358',
  whatsapp: '919143914358',
  about:
    'ओंकार नाथ अग्रवाल सर्राफ is a trusted gold and silver sarraf based at Naraini Road, Atarra, District Banda, Uttar Pradesh. With years of honest dealing in pure gold and silver jewellery, we serve families across Atarra, Banda and nearby towns — from wedding sets to everyday ornaments, always with guaranteed purity and fair, transparent rates.',
  bannerTitle: 'पीढ़ियों का भरोसा, हर आभूषण में',
  bannerSubtitle: '20+ वर्षों से शुद्ध स्वर्ण एवं रजत का विश्वसनीय साथ',
};

// Endpoint responses served in demo/fallback mode. Query strings are ignored by
// the /jewellery page only for category + search narrowing of the small demo set.
const withQuery = (url) => {
  const [path, qsRaw] = url.split('?');
  const qs = new URLSearchParams(qsRaw || '');
  return { path, qs };
};

export function demoResponse(url) {
  const { path, qs } = withQuery(url并与);
  if (path === '/api/categories') return { success: true, categories: CATEGORIES };
  if (path === '/api/products') {
    let list = [...PRODUCTS];
    const cat = qs.get('category');
    const search = (qs.get('search') || '').toLowerCase();
    if (cat && cat !== 'all') {
      const c = CATEGORIES.find((x) => x.slug === cat);
      list = list.filter((p) => (c ? p.category === c.name : false));
    }
    if (search) list = list.filter((p) => `${p.name} ${p.description}`.toLowerCase().includes(search));
    return { success: true, products: list.map(({ purity, weight, purityLabel, ...rest }) => ({ ...rest })) };
  }
  if (path === '/api/rates') return { success: true, rates: RATES, meta: { status: 'demo', mode: 'demo', source: 'demo', updatedAt: new Date().toISOString() } };
  if (path === '/api/gallery') return { success: true, gallery: GALLERY };
  if (path === '/api/settings') return { success: true, settings: SETTINGS };
  if (path === '/api/rates/history') return { success: true, history: [] };
  if (path.startsWith('/api/products/')) {
    const slug = path.replace('/api/products/', '');
    return { success: true, product: PRODUCTS.find((p) => p.slug === slug) || null };
  }
  return { success: true, [path.split('/')[2] || 'data']: [] };
}
