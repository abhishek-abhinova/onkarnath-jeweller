export const BUSINESS = {
  name: 'ओंकार नाथ अग्रवाल सर्राफ',
  nameLatin: 'Onkar Nath Agrawal Sarraf',
  tagline: 'विश्वास के साथ सोने और चांदी की शुद्धता',
  phone: '9143914358',
  phoneDisplay: '+91 91439 14358',
  whatsappNumber: '919143914358',
  address: 'Naraini Road, Atarra - 210201, District Banda, Uttar Pradesh, India',
  addressLines: ['Naraini Road,', 'Atarra - 210201,', 'District Banda,', 'Uttar Pradesh, India'],
  locality: 'Atarra',
  district: 'Banda',
  state: 'Uttar Pradesh',
  country: 'India',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Naraini%20Road%2C%20Atarra%2C%20Banda%2C%20Uttar%20Pradesh%20210201',
  mapsEmbed: 'https://www.google.com/maps?q=Naraini%20Road%2C%20Atarra%2C%20Banda%2C%20Uttar%20Pradesh%20210201&output=embed',
};

export const NAV = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Jewellery', href: '/jewellery' },
  { label: 'Live Rates', href: '/rates' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Contact', href: '/contact' },
];

export const waLink = (message = '') =>
  `https://wa.me/${BUSINESS.whatsappNumber}${message ? `?text=${encodeURIComponent(message)}` : ''}`;

export const callLink = () => `tel:${BUSINESS.phone}`;