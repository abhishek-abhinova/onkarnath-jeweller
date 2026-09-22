import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Screen, Header, Loading } from '../components/ui';
import { apiGet } from '../api';
import { COLORS } from '../theme';

const ICONS = {
  'gold-jewellery': '🪙',
  'silver-jewellery': '⚪',
  rings: '💍',
  necklaces: '📿',
  earrings: '🔔',
  bangles: '⭕',
  chains: '🔗',
  pendants: '✦',
  'bridal-jewellery': '👑',
};

export default function Jewellery({ navigation }) {
  const [cats, setCats] = useState(null);

  useEffect(() => {
    apiGet('/api/categories').then((r) => setCats(r.categories || [])).catch(() => setCats([]));
  }, []);

  return (
    <Screen>
      <Header title="Jewellery" sub="श्रेणी चुनें और डिज़ाइन देखें — कीमत व्हाट्सऐप पर पूछें" />
      <TouchableOpacity style={styles.allBtn} onPress={() => navigation.navigate('ProductsList', { category: 'all', title: 'All Jewellery' })}>
        <Text style={styles.allBtnText}>सभी आभूषण देखें</Text>
      </TouchableOpacity>
      {!cats ? (
        <Loading />
      ) : (
        <View style={styles.grid}>
          {cats.map((c) => (
            <TouchableOpacity
              key={c._id}
              style={styles.cat}
              onPress={() =>
                navigation.navigate('ProductsList', { category: c.slug, title: c.name })
              }
              activeOpacity={0.85}
            >
              <Text style={styles.icon}>{ICONS[c.slug] || '✦'}</Text>
              <Text style={styles.catName}>{c.name}</Text>
              <Text style={styles.catSlug} numberOfLines={1}>{c.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  allBtn: {
    backgroundColor: COLORS.maroon,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  allBtnText: { color: COLORS.goldLight, fontWeight: '700', fontSize: 14 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  cat: {
    width: '48.5%',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderTopWidth: 3,
    borderTopColor: COLORS.gold,
  },
  icon: { fontSize: 26 },
  catName: { fontSize: 14, fontWeight: '700', color: COLORS.charcoal, marginTop: 8 },
  catSlug: { fontSize: 10, color: COLORS.charcoalSoft, marginTop: 3, lineHeight: 14 },
});