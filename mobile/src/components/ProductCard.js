import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../theme';
import AppImage from './AppImage';

export default function ProductCard({ product, onPress }) {
  const src = product.images?.[0] || null;
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <AppImage source={src} fallback={require('../../assets/icon.png')} style={styles.img} label={'✦'} />
      <View style={styles.body}>
        <View style={styles.chips}>
          {product.purity ? <Chip label={product.purity} /> : null}
          {product.weight ? <Text style={styles.weight}>{product.weight}</Text> : null}
        </View>
        <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
        <Text style={styles.cat}>{product.category}</Text>
        <Text style={styles.cta}>View details →</Text>
      </View>
    </TouchableOpacity>
  );
}

function Chip({ label }) {
  return (
    <View style={styles.chip}>
      <Text style={styles.chipText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  img: { width: '100%', aspectRatio: 4 / 3 },
  body: { padding: 12 },
  chips: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  chip: {
    backgroundColor: COLORS.goldPale,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  chipText: { fontSize: 10, fontWeight: '700', color: '#8C651C' },
  weight: { fontSize: 10, color: COLORS.charcoalSoft },
  name: { fontSize: 15, fontWeight: '700', color: COLORS.charcoal, marginTop: 6 },
  cat: { fontSize: 11, color: COLORS.charcoalSoft, marginTop: 2 },
  cta: { fontSize: 12, fontWeight: '700', color: COLORS.maroon, marginTop: 8 },
});