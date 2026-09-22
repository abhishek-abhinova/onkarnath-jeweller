import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { COLORS } from '../theme';
import { BUSINESS } from '../config';

export default function Splash({ navigation }) {
  useEffect(() => {
    const t = setTimeout(() => {
      navigation.replace('Main');
    }, 1400);
    return () => clearTimeout(t);
  }, [navigation]);

  return (
    <View style={styles.root}>
      <Image source={require('../../assets/icon.png')} style={styles.logo} />
      <Text style={styles.om}>ॐ</Text>
      <Text style={styles.name}>{BUSINESS.name}</Text>
      <Text style={styles.latin}>{BUSINESS.nameLatin}</Text>
      <Text style={styles.tagline}>{BUSINESS.tagline}</Text>
      <View style={styles.line} />
      <Text style={styles.foot}>Gold · Silver · Jewellery</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.maroonMid,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  logo: { width: 120, height: 120, borderRadius: 60, marginBottom: 18 },
  om: { color: COLORS.goldLight, fontSize: 30, marginBottom: 4 },
  name: { color: COLORS.goldLight, fontSize: 24, fontWeight: '700', textAlign: 'center' },
  latin: {
    color: 'rgba(235,197,95,0.75)',
    fontSize: 11,
    letterSpacing: 2.5,
    marginTop: 6,
  },
  tagline: {
    color: 'rgba(251,246,236,0.85)',
    fontSize: 13,
    marginTop: 18,
    textAlign: 'center',
  },
  line: {
    width: 60,
    height: 1,
    backgroundColor: COLORS.gold,
    marginVertical: 18,
    opacity: 0.6,
  },
  foot: { color: 'rgba(251,246,236,0.55)', fontSize: 11, letterSpacing: 1.5 },
});