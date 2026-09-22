import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Screen, Header } from '../components/ui';
import { apiGet } from '../api';
import { COLORS, inr } from '../theme';

const GOLD_PURITIES = [
  { value: '999', label: '999 · 24K' },
  { value: '916', label: '916 · 22K' },
  { value: '750', label: '750 · 18K' },
  { value: '585', label: '585 · 14K' },
];
const SILVER_PURITIES = [
  { value: '999', label: '999 · Fine' },
  { value: '925', label: '925 · Sterling' },
];

export default function Calculator() {
  const [rates, setRates] = useState(null);
  const [metal, setMetal] = useState('gold');
  const [purity, setPurity] = useState('916');
  const [weight, setWeight] = useState('10');
  const [making, setMaking] = useState('12');
  const [includeGst, setIncludeGst] = useState(true);

  useEffect(() => {
    apiGet('/api/rates').then(setRates).catch(() => setRates(null));
  }, []);

  const basePerGram = useMemo(() => {
    if (metal === 'gold') {
      const r = rates?.rates?.find((x) => x.metal === 'gold' && x.purity === '999');
      if (!r?.am) return null;
      return (r.am / 10) * ((parseInt(purity, 10) || 999) / 999);
    }
    const r = rates?.rates?.find((x) => x.metal === 'silver' && x.purity === '999');
    if (!r?.am) return null;
    return (r.am / 1000) * ((parseInt(purity, 10) || 999) / 999);
  }, [metal, purity, rates]);

  const w = parseFloat(weight) || 0;
  const m = parseFloat(making) || 0;
  const base = basePerGram != null ? basePerGram * w : 0;
  const makingVal = base * (m / 100);
  const gst = includeGst ? (base + makingVal) * 0.03 : 0;
  const total = base + makingVal + gst;

  const switchMetal = (m) => {
    setMetal(m);
    setPurity(m === 'gold' ? '916' : '999');
  };

  const purities = metal === 'gold' ? GOLD_PURITIES : SILVER_PURITIES;

  return (
    <Screen>
      <Header title="Rate Calculator" sub="अनुमानित आभूषण मूल्य — बेस वैल्यू + मेकिंग चार्ज + GST" />

      <View style={styles.seg}>
        {['gold', 'silver'].map((m) => (
          <TouchableOpacity
            key={m}
            style={[styles.segBtn, metal === m && styles.segActive]}
            onPress={() => switchMetal(m)}
          >
            <Text style={[styles.segText, metal === m && styles.segTextActive]}>{m === 'gold' ? 'Gold' : 'Silver'}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Purity</Text>
      <View style={styles.purityRow}>
        {purities.map((p) => (
          <TouchableOpacity
            key={p.value}
            onPress={() => setPurity(p.value)}
            style={[styles.purityBtn, purity === p.value && styles.purityActive]}
          >
            <Text style={[styles.purityText, purity === p.value && styles.purityTextActive]}>{p.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Weight (grams)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight}
        placeholder="e.g. 10"
      />

      <Text style={styles.label}>Making Charges (%)</Text>
      <TextInput style={styles.input} keyboardType="numeric" value={making} onChangeText={setMaking} placeholder="e.g. 12" />

      <TouchableOpacity style={styles.gstRow} onPress={() => setIncludeGst(!includeGst)}>
        <Text style={styles.gstText}>Add GST 3%</Text>
        <View style={[styles.switch, includeGst && styles.switchOn]}>
          <View style={[styles.knob, includeGst && styles.knobOn]} />
        </View>
      </TouchableOpacity>

      <View style={styles.result}>
        <Row label={`Base Metal (${w}g)`} value={inr(base)} />
        <Row label={`Making (${m}%)`} value={inr(makingVal)} />
        {includeGst && <Row label="GST (3%)" value={inr(gst)} />}
        <View style={styles.divider} />
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Estimated Value</Text>
          <Text style={styles.totalValue}>{inr(total)}</Text>
        </View>
      </View>

      <Text style={styles.note}>
        Estimated value only. Final price may vary based on design, making charges, wastage and applicable taxes.
      </Text>
    </Screen>
  );
}

function Row({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const chip = {
  borderRadius: 999,
  paddingVertical: 10,
  paddingHorizontal: 16,
  alignItems: 'center',
  justifyContent: 'center',
};

const styles = StyleSheet.create({
  seg: { flexDirection: 'row', backgroundColor: COLORS.ivoryDark, borderRadius: 999, padding: 4 },
  segBtn: { ...chip, flex: 1 },
  segActive: { backgroundColor: COLORS.maroon },
  segText: { fontSize: 13, fontWeight: '700', color: COLORS.charcoalSoft },
  segTextActive: { color: COLORS.goldLight },
  label: { fontSize: 11, fontWeight: '700', letterSpacing: 1, color: COLORS.charcoalSoft, marginTop: 16, marginBottom: 8 },
  purityRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  purityBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(49,40,28,0.15)',
    backgroundColor: '#fff',
  },
  purityActive: { backgroundColor: COLORS.gold, borderColor: COLORS.gold },
  purityText: { fontSize: 12, fontWeight: '700', color: COLORS.charcoal },
  purityTextActive: { color: '#fff' },
  input: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.charcoal,
    borderWidth: 1,
    borderColor: 'rgba(49,40,28,0.1)',
  },
  gstRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginTop: 16,
  },
  gstText: { fontSize: 13, fontWeight: '700', color: COLORS.charcoal },
  switch: { width: 44, height: 24, borderRadius: 12, backgroundColor: 'rgba(49,40,28,0.15)', padding: 2 },
  switchOn: { backgroundColor: COLORS.gold },
  knob: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#fff' },
  knobOn: { marginLeft: 20 },
  result: {
    marginTop: 18,
    backgroundColor: COLORS.maroon,
    borderRadius: 18,
    padding: 18,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  rowLabel: { color: 'rgba(251,246,236,0.7)', fontSize: 13 },
  rowValue: { color: '#FDF6E3', fontSize: 13, fontWeight: '700' },
  divider: { height: 1, backgroundColor: 'rgba(235,197,95,0.2)', marginVertical: 8 },
  totalRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  totalLabel: { color: COLORS.goldLight, fontSize: 13, fontWeight: '700' },
  totalValue: { color: COLORS.goldLight, fontSize: 24, fontWeight: '800' },
  note: { fontSize: 10, color: COLORS.charcoalSoft, textAlign: 'center', marginTop: 14, lineHeight: 15 },
});