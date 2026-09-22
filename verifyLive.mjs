// throwaway verification script (deleted after use)
import { fetchLiveRates } from '../web/lib/liveRates.js';

try {
  const r = await fetchLiveRates();
  console.log('SUCCESS rates:');
  for (const row of r.rates) {
    console.log(
      `  ${row.label.padEnd(16)} AM ₹${row.am.toLocaleString('en-IN')}  PM ₹${row.pm.toLocaleString('en-IN')}  (${row.unit})`,
    );
  }
  console.log('meta.source =', r.meta.source);
  console.log('signal:', new AbortController().aborted === false ? 'live' : 'unknown');
} catch (e) {
  console.error('FAILED:', e.message);
  process.exit(1);
}
