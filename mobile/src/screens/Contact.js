import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Screen } from '../components/ui';
import { COLORS } from '../theme';
import { BUSINESS, waLink, callLink } from '../config';

export default function Contact() {
  return (
    <Screen>
      <Text style={styles.eyebrow}>✦ Contact</Text>
      <Text style={styles.title}>संपर्क करें</Text>
      <Text style={styles.sub}>कॉल, व्हाट्सऐप या सीधे दुकान पर — हम हर सवाल का जवाब देने को तैयार हैं।</Text>

      <View style={styles.card}>
        <Text style={styles.biz}>{BUSINESS.name}</Text>
        <Text style={styles.address}>{BUSINESS.address}</Text>
      </View>

      <TouchableOpacity style={[styles.btn, { backgroundColor: COLORS.maroon }]} onPress={() => Linking.openURL(callLink())}>
        <Text style={styles.btnText}>📞 {BUSINESS.phoneDisplay}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.btn, { backgroundColor: COLORS.green }]} onPress={() => Linking.openURL(waLink('नमस्ते, मुझे जानकारी चाहिए।'))}>
        <Text style={styles.btnText}>💬 WhatsApp</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.btn, styles.outline]} onPress={() => Linking.openURL(BUSINESS.mapsUrl)}>
        <Text style={styles.outlineText}>📍 Get Directions</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.btn, styles.outline]} onPress={() => Linking.openURL(`https://www.google.com/maps?q=${encodeURIComponent(BUSINESS.address)}`)}>
        <Text style={styles.outlineText}>🗺 Open in Google Maps</Text>
      </TouchableOpacity>

      <View style={styles.hours}>
        <Text style={styles.hoursTitle}>समय</Text>
        <Text style={styles.hoursText}>सोमवार – शनिवार</Text>
        <Text style={styles.hoursText}>सुबह 10:00 – रात 8:00 बजे</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  eyebrow: { color: COLORS.gold, fontSize: 11, letterSpacing: 2, fontWeight: '700' },
  title: { fontSize: 26, fontWeight: '800', color: COLORS.maroon, marginTop: 6 },
  sub: { fontSize: 13, color: COLORS.charcoalSoft, lineHeight: 19, marginTop: 8 },
  card: {
    backgroundColor: COLORS.maroon,
    borderRadius: 18,
    padding: 18,
    marginTop: 20,
  },
  biz: { color: COLORS.goldLight, fontSize: 17, fontWeight: '800' },
  address: { color: 'rgba(251,246,236,0.8)', fontSize: 12, marginTop: 8, lineHeight: 18 },
  btn: {
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  btnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  outline: { backgroundColor: '#fff', borderWidth: 1, borderColor: 'rgba(201,148,44,0.5)' },
  outlineText: { color: '#8C651C', fontSize: 13, fontWeight: '700' },
  hours: {
    marginTop: 18,
    backgroundColor: COLORS.goldPale,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  hoursTitle: { fontSize: 11, fontWeight: '800', letterSpacing: 1.5, color: '#6E4F14' },
  hoursText: { fontSize: 13, color: '#8C651C', fontWeight: '600', marginTop: 4 },
});