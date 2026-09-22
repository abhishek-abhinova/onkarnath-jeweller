// Demo seed content for ओंकार नाथ अग्रवाल सर्राफ.
// All of this is replaceable from the admin panel.

const IMG = (name) => `/uploads/seed/${name}.png`;

const CATEGORIES = [
  { name: 'Gold Jewellery', slug: 'gold-jewellery', description: 'Trusted BIS hallmarked gold jewellery for every occasion.' },
  { name: 'Silver Jewellery', slug: 'silver-jewellery', description: 'Handcrafted silver ornaments and daily-wear pieces.' },
  { name: 'Rings', slug: 'rings', description: 'Gold, silver and stone-set rings for men and women.' },
  { name: 'Necklaces', slug: 'necklaces', description: 'Elegant gold and silver necklaces and chains.' },
  { name: 'Earrings', slug: 'earrings', description: 'Jhumkas, studs and drops crafted with fine detail.' },
  { name: 'Bangles', slug: 'bangles', description: 'Classic gold and silver bangles with premium finish.' },
  { name: 'Chains', slug: 'chains', description: 'Durable everyday chains in multiple purities.' },
  { name: 'Pendants', slug: 'pendants', description: 'Meaningful pendants and lockets for daily wear.' },
  { name: 'Bridal Jewellery', slug: 'bridal-jewellery', description: 'Complete bridal sets for your special day.' },
];

const PRODUCTS = [
  {
    name: 'Traditional Gold Necklace',
    category: 'Necklaces',
    purity: '22K / 916',
    weight: 'Approx. 24g',
    featured: true,
    description:
      'A classic 22 karat gold necklace crafted in an antique finish. A timeless piece built on generations of trust — suitable for festivals, weddings and daily elegance.',
    images: [IMG('gold-necklace')],
  },
  {
    name: 'Bridal Gold Necklace Set',
    category: 'Bridal Jewellery',
    purity: '22K / 916',
    weight: 'Approx. 42g',
    featured: true,
    description:
      'A complete bridal ensemble with layered necklace, pair of jhumkas and maang tikka. Hand-finished in polished gold with intricate kundan-inspired detail.',
    images: [IMG('bridal-necklace')],
  },
  {
    name: 'Gold Jhumka Earrings',
    category: 'Earrings',
    purity: '22K / 916',
    weight: 'Approx. 9g',
    featured: true,
    description:
      'Traditional bell-shaped jhumkas with a rich gold finish and fine filigree detailing. Lightweight comfort with an elegant statement look.',
    images: [IMG('gold-jhumka')],
  },
  {
    name: 'Gold Bangles Set',
    category: 'Bangles',
    purity: '22K / 916',
    weight: 'Approx. 30g',
    featured: true,
    description:
      'A sleek set of hallmarked gold bangles available in multiple designs. Polished daily-wear pieces that never go out of style.',
    images: [IMG('gold-bangles')],
  },
  {
    name: 'Gold Ring',
    category: 'Rings',
    purity: '22K / 916',
    weight: 'Approx. 4g',
    featured: false,
    description:
      'A clean, modern gold band with a polished finish. Customisable in size and available with or without stone settings.',
    images: [IMG('gold-ring')],
  },
  {
    name: 'Gold Chain',
    category: 'Chains',
    purity: '22K / 916',
    weight: 'Approx. 8g',
    featured: false,
    description:
      'A durable everyday gold chain with a secure clasp. Pairs beautifully with pendants or worn alone.',
    images: [IMG('gold-chain')],
  },
  {
    name: 'Diamond Ring',
    category: 'Rings',
    purity: '18K / 750',
    weight: 'Approx. 2.5g',
    featured: false,
    description:
      'A brilliant diamond-set ring in 18 karat gold. Available in a range of solitaire and cluster designs. Sold with trusted certification.',
    images: [IMG('diamond-ring')],
  },
  {
    name: 'Silver Payal',
    category: 'Silver Jewellery',
    purity: 'Silver 999',
    weight: 'Approx. 55g',
    featured: true,
    description:
      'Traditional silver payal with a gentle jingle and intricate buti detailing. Crafted from high-purity sterling silver, comfortable for all-day wear.',
    images: [IMG('silver-payal')],
  },
];

// Realistic benchmark-style reference values ONLY for the off-line demo.
// When IBJA credentials are configured, these are replaced by API data and
// the UI automatically stops showing them as reference/live.
const FALLBACK_RATES = [
  { metal: 'gold', purity: '999', label: 'GOLD 999', am: 153680, pm: 153742, unit: '10g', source: 'fallback' },
  { metal: 'gold', purity: '916', label: 'GOLD 916 / 22K', am: 140891, pm: 140948, unit: '10g', source: 'fallback' },
  { metal: 'gold', purity: '750', label: 'GOLD 750 / 18K', am: 115402, pm: 115452, unit: '10g', source: 'fallback' },
  { metal: 'silver', purity: '999', label: 'SILVER 999', am: 102410, pm: 102520, unit: '1kg', source: 'fallback' },
];

const SETTINGS = {
  businessName: 'ओंकार नाथ अग्रवाल सर्राफ',
  tagline: 'विश्वास के साथ सोने और चांदी की शुद्धता',
  address: 'Naraini Road, Atarra - 210201, District Banda, Uttar Pradesh, India',
  phone: '9143914358',
  whatsapp: '919143914358',
  about:
    'ओंकार नाथ अग्रवाल सर्राफ is a trusted gold and silver sarraf based at Naraini Road, Atarra, District Banda, Uttar Pradesh. With years of honest dealing in pure gold and silver jewellery, we serve families across Atarra, Banda and nearby towns — from wedding sets to everyday ornaments, always with guaranteed purity and fair rates.',
  bannerTitle: 'पीढ़ियों का भरोसा, हर आभूषण में',
  bannerSubtitle: '20+ वर्षों से शुद्ध स्वर्ण एवं रजत का विश्वसनीय साथ',
};

const GALLERY = [
  { title: 'Gold Necklace', category: 'Necklaces', image: IMG('gold-necklace') },
  { title: 'Bridal Set', category: 'Bridal Jewellery', image: IMG('bridal-necklace') },
  { title: 'Jhumka', category: 'Earrings', image: IMG('gold-jhumka') },
  { title: 'Bangles', category: 'Bangles', image: IMG('gold-bangles') },
  { title: 'Ring', category: 'Rings', image: IMG('gold-ring') },
  { title: 'Chain', category: 'Chains', image: IMG('gold-chain') },
  { title: 'Diamond Ring', category: 'Rings', image: IMG('diamond-ring') },
  { title: 'Silver Payal', category: 'Silver Jewellery', image: IMG('silver-payal') },
];

const ADMIN_USER = {
  name: 'Store Admin',
  username: 'admin',
  email: 'admin@onassarraf.com',
  password: 'admin123',
};

module.exports = { CATEGORIES, PRODUCTS, FALLBACK_RATES, SETTINGS, GALLERY, ADMIN_USER };