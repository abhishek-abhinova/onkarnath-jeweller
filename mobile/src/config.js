// Shared config for the Android app — same backend as website & admin.
//
// IMPORTANT:
//   For a physical phone keep the computer's LAN IP here, e.g. http://192.168.1.5:5000
//   The Android emulator reaches the host via  http://10.0.2.2:5000
//   In production point this to your deployed backend, e.g. https://api.onassarraf.in
export const API_URL = 'http://10.0.2.2:5000';

export const BUSINESS = {
  name: 'ओंकार नाथ अग्रवाल सर्राफ',
  nameLatin: 'Onkar Nath Agrawal Sarraf',
  tagline: 'विश्वास के साथ सोने और चांदी की शुद्धता',
  phone: '9143914358',
  phoneDisplay: '+91 91439 14358',
  whatsappNumber: '919143914358',
  address: 'Naraini Road, Atarra - 210201, District Banda, Uttar Pradesh, India',
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Naraini+Road%2C+Atarra%2C+Banda%2C+Uttar+Pradesh+210201',
};

export const waLink = (message = '') =>
  `https://wa.me/${BUSINESS.whatsappNumber}${message ? `?text=${encodeURIComponent(message)}` : ''}`;

export const callLink = () => `tel:${BUSINESS.phone}`;