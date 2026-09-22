import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Screen, SectionTitle, Loading, ErrorBox } from '../components/ui';
import RateCard from '../components/RateCard';
import AppImage from '../components/AppImage';
import { apiGet } from '../api';
import { COLORS, fmtDateTime } from '../theme';
import { BUSINESS, waLink, callLink } from '../config';

const TRUST = ['Trusted Store', 'Live Rates', 'Quality Jewellery', 'Support'];

export default function Home({ navigation }) {
  const [rates, setRates] = useState(null);
  const [products, setProducts] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    apiGet('/api/rates').then(setRates).catch((e) => setError(e.message));
    apiGet('/api/products?featured=true').then((r) => setProducts(r.products || [])).catch(() => {});
  }, []);

  return (
    <Screen>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>पीढ़ियों का भरोसा · Atarra, Banda</Text>
        <Text style={styles.heroTitle}>
          विश्वास के साथ सोने और चांदी की <Text style={{ color: COLORS.goldLight }}>शुद्धता</Text>
        </Text>
        <Text style={styles.heroSub}>{BUSINESS.name} — विश्वसनीय सोना, चांदी एवं आभूषण</Text>
        <View style={styles.ctaRow}>
          <TouchableOpacity style={styles.btnGold} onPress={() => navigation.navigate('Rates')}>
            <Text style={styles.btnGoldText}>आज के रेट देखें</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnOutline}
            onPress={() => Linking.openURL(waLink('नमस्ते, मुझे आपके आभूषणों की जानकारी चाहिए।'))}
          >
            <Text style={styles.btnOutlineText}>WhatsApp</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.trust}>
          {TRUST.map((t) => (
            <Text key={t} style={styles.trustItem}>✓ {t}</Text>
          ))}
        </View>
      </View>

      <SectionTitle
        eyebrow="Collection"
        title="हमारे खास आभूषण"
        right={
          <TouchableOpacity onPress={() => navigation.navigate('Jewellery')}>
            <Text style={styles.link}>View all</Text>
          </TouchableOpacity>
        }
      />
      {!products ? (
        <Loading />
      ) : products.length ? (
        <View style={styles.grid}>
          {products.slice(0, 6).map((p) => (
            <TouchableOpacity
              key={p._id}
              style={styles.miniCard}
              onPress={() => navigation.navigate('ProductDetail', { product: p })}
              activeOpacity={0.85}
            >
              <AppImage source={p.images?.[0]} fallback={require('../../assets/icon.png')} style={styles.miniImg} label="✦" />
              <Text style={styles.miniName} numberOfLines={1}>{p.name}</Text>
              <Text style={styles.miniCat}>{p.purity || p.category}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <ErrorBox message="Featured products will appear here." />
      )}

      <SectionTitle
        eyebrow="Live Rates"
        title="आज के सोने और चांदी के भाव"
        right={
          <TouchableOpacity onPress={() => navigation.navigate('Rates')}>
            <Text style={styles.link}>Details</Text>
          </TouchableOpacity>
        }
      />
      {!rates ? (
        <Loading />
      ) : rates?.rates?.length ? (
        rates.rates.map((r) => <RateCard key={`${r.metal}-${r.purity}`} rate={r} />)
      ) : error ? (
        <ErrorBox message="Rate temporarily unavailable." />
      ) : (
        <ErrorBox message="Rate temporarily unavailable." />
      )}
      {rates?.meta?.updatedAt ? (
        <Text style={styles.hint}>
          Last updated: {fmtDateTime(rates.meta.updatedAt)} · Benchmark rates (exclude GST & making)
        </Text>
      ) : null}

      <SectionTitle eyebrow="Contact" title="संपर्क करें" />
      <View style={styles.contactRow}>
        <TouchableOpacity style={[styles.btnCard, { backgroundColor: COLORS.maroon }]} onPress={() => Linking.openURL(callLink())}>
          <Text style={styles.btnCardText}>📞 Call Now</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btnCard, { backgroundColor: COLORS.green }]}
          onPress={() => Linking.openURL(waLink('नमस्ते, मुझे जानकारी चाहिए।'))}
        >
          <Text style={styles.btnCardText}>💬 WhatsApp</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: COLORS.maroonMid,
    borderRadius: 22,
    padding: 20,
    marginBottom: 22,
  },
  eyebrow: { color: COLORS.goldLight, fontSize: 11, letterSpacing: 1.4, fontWeight: '700' },
  heroTitle: { color: '#FDF6E3', fontSize: 26, fontWeight: '700', marginTop: 10, lineHeight: 34 },
  heroSub: { color: 'rgba(251,246,236,0.8)', fontSize: 13, marginTop: 8, lineHeight: 19 },
  ctaRow: { flexDirection: 'row', gap: 10, marginTop: 16 },
  btnGold: {
    backgroundColor: COLORS.gold,
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  btnGoldText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  btnOutline: {
    borderWidth: 1,
    borderColor: 'rgba(235,197,95,0.6)',
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  btnOutlineText: { color: COLORS.goldLight, fontWeight: '700', fontSize: 13 },
  trust: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 16 },
  trustItem: { color: 'rgba(251,246,236,0.85)', fontSize: 11, fontWeight: '600' },
  link: { color: COLORS.maroon, fontSize: 13, fontWeight: '700' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  miniCard: { width: '48.5%', marginBottom: 12, backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden' },
  miniImg: { width: '100%', aspectRatio: 4 / 3.4 },
  miniName: { fontSize: 12, fontWeight: '700', color: COLORS.charcoal, paddingHorizontal: 8, paddingTop: 8 },
  miniCat: { fontSize: 10, color: COLORS.charcoalSoft, paddingHorizontal: 8, paddingBottom: 8, marginTop: 2 },
  hint: { fontSize: 10, color: COLORS.charcoalSoft, textAlign: 'center', marginVertical: 10, lineHeight: 15 },
  contactRow: { flexDirection: 'row', gap: 10 },
  btnCard: { flex: 1, borderRadius: 16, paddingVertical: 14, alignItems: 'center' },
  btnCardText: { color: '#fff', fontWeight: '700', fontSize: 13 },
});