import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, inr, fmtDateTime } from '../theme';

export default function RateCard({ rate }) {
  const dark = rate.metal === 'silver';
  return (
    <View style={styles.card}>
      <View style={styles.head}>
        <View style={[styles.dot, dark ? styles.dotSilver : styles.dotGold]} />
        <Text style={styles.label}>{rate.label}</Text>
        <Text style={styles.unit}>{rate.unit}</Text>
      </View>
      <View style={styles.rows}>
        <View style={styles.cell}>
          <Text style={styles.cellLabel}>AM</Text>
          <Text style={styles.value}>{inr(rate.am)}</Text>
        </View>
        <View style={[styles.cell, styles.cellDark]}>
          <Text style={[styles.cellLabel, { color: 'rgba(235,197,95,0.7)' }]}>PM</Text>
          <Text style={[styles.value, { color: '#F3DD9B' }]}>{inr(rate.pm)}</Text>
        </View>
      </View>
      <Text style={styles.time}>{fmtDateTime(rate.timestamp)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    borderTopWidth: 3,
    borderTopColor: COLORS.gold,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  head: { flexDirection: 'row', alignItems: 'center' },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  dotGold: { backgroundColor: COLORS.gold },
  dotSilver: { backgroundColor: '#C9D1D8' },
  label: { fontSize: 13, fontWeight: '700', color: COLORS.charcoal, flex: 1 },
  unit: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.charcoalSoft,
    backgroundColor: COLORS.ivory,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    overflow: 'hidden',
  },
  rows: { flexDirection: 'row', gap: 8, marginTop: 10 },
  cell: {
    flex: 1,
    backgroundColor: COLORS.ivory,
    borderRadius: 12,
    padding: 10,
  },
  cellDark: { backgroundColor: COLORS.maroon },
  cellLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 1, color: COLORS.charcoalSoft },
  value: { fontSize: 17, fontWeight: '700', color: '#8C651C', marginTop: 2 },
  time: { fontSize: 10, color: COLORS.charcoalSoft, marginTop: 10, textAlign: 'right' },
});