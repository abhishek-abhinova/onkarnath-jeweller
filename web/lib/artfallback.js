export function fallbackArt(name = '') {
  const n = name.toLowerCase();
  if (n.includes('bridal')) return '/images/products/bridal-necklace.svg';
  if (n.includes('jhumka')) return '/images/products/gold-jhumka.svg';
  if (n.includes('bangle')) return '/images/products/gold-bangles.svg';
  if (n.includes('diamond')) return '/images/products/diamond-ring.svg';
  if (n.includes('ring')) return '/images/products/gold-ring.svg';
  if (n.includes('payal')) return '/images/products/silver-payal.svg';
  if (n.includes('chain')) return '/images/products/gold-chain.svg';
  if (n.includes('necklace')) return '/images/products/gold-necklace.svg';
  return '/logo.svg';
}