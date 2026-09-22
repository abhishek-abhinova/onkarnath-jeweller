export const COLORS = {
  maroon: '#5B1423',
  maroonDeep: '#2A070E',
  maroonMid: '#4A0E1B',
  gold: '#C9942C',
  goldLight: '#EBC55F',
  goldPale: '#FAEDC8',
  ivory: '#FBF6EC',
  ivoryDark: '#EBDFC6',
  charcoal: '#31281C',
  charcoalSoft: '#6B5F4F',
  white: '#FFFFFF',
  green: '#1FA855',
  danger: '#C0392B',
};

export const TYPE = {
  hindiTitle: { fontWeight: '700' },
};

export function inr(n) {
  if (typeof n !== 'number' || !Number.isFinite(n)) return '—';
  return `₹${Math.round(n).toLocaleString('en-IN')}`;
}

export function fmtDateTime(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function fmtDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}