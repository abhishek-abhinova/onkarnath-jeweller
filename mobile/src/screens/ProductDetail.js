import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Share } from 'react-native';
import AppImage from '../components/AppImage';
import { Chip } from '../components/ui';
import { COLORS } from '../theme';
import { waLink, callLink } from '../config';

export default function ProductDetail({ route }) {
  const { product } = route.params;
  const waMsg = `Hello, I am interested in ${product.name}. Please share details and price.`;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.ivory }} showsVerticalScrollIndicator={false}>
      <AppImage
        source={product.images?.[0] || null}
        fallback={require('../../assets/icon.png')}
        style={styles.img}
        label="✦"
      />

      <View style={styles.body}>
        <View style={styles.chips}>
          {product.category ? <Chip label={product.category} /> : null}
          {product.featured ? <Chip label="★ Featured" tone="dark" /> : null}
        </View>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.store}>ओंकार नाथ अग्रवाल सर्राफ · Atarra, Banda</Text>

        <View style={styles.specs}>
          {product.purity ? <Spec label="Purity" value={product.purity} /> : null}
          {product.weight ? <Spec label="Weight" value={product.weight} /> : null}
          <Spec label="Enquiry" value="WhatsApp / Call" />
        </View>

        <Text style={styles.desc}>{product.description}</Text>

        <View style={styles.priceNote}>
          <Text style={styles.priceNoteText}>
            Price depends on the day's {product.purity ? `${product.purity} ` : ''}rate, weight and making charges. Contact
            us for today's exact price.
          </Text>
        </View>

        <TouchableOpacity style={[styles.btn, { backgroundColor: COLORS.green }]} onPress={() => Linking.openURL(waLink(waMsg))}>
          <Text style={styles.btnText}>💬 WhatsApp Enquiry</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, { backgroundColor: COLORS.maroon }]} onPress={() => Linking.openURL(callLink())}>
          <Text style={styles.btnText}>📞 Call Now</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, styles.btnGhost]}
          onPress={() => Share.share({ message: `${product.name} — ${product.description}\n\nEnquiry: ${waLink()}` })}
        >
          <Text style={styles.btnGhostText}>Share</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function Spec({ label, value }) {
  return (
    <View style={styles.spec}>
      <Text style={styles.specLabel}>{label}</Text>
      <Text style={styles.specValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  img: { width: '100%', aspectRatio: 1 },
  body: { padding: 18 },
  chips: { flexDirection: 'row', gap: 8 },
  name: { fontSize: 24, fontWeight: '800', color: COLORS.charcoal, marginTop: 10 },
  store: { fontSize: 12, color: COLORS.charcoalSoft, marginTop: 4 },
  specs: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 16 },
  spec: {
    flexGrow: 1,
    minWidth: '45%',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
  },
  specLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 1, color: COLORS.charcoalSoft },
  specValue: { fontSize: 13, fontWeight: '700', color: COLORS.charcoal, marginTop: 3 },
  desc: { fontSize: 14, lineHeight: 22, color: COLORS.charcoal, marginTop: 18 },
  priceNote: {
    backgroundColor: COLORS.goldPale,
    borderRadius: 14,
    padding: 14,
    marginTop: 18,
  },
  priceNoteText: { fontSize: 12, color: '#6E4F14', lineHeight: 18 },
  btn: {
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  btnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  btnGhost: { backgroundColor: 'transparent', borderWidth: 1, borderColor: 'rgba(49,40,28,0.2)' },
  btnGhostText: { color: COLORS.charcoalSoft, fontSize: 13, fontWeight: '700' },
});