import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { COLORS, inr } from '../theme';

export function Screen({ children, style, scroll = true }) {
  if (!scroll) return <View style={[styles.screen, style]}>{children}</View>;
  return (
    <ScrollView style={[styles.screen, style]} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  );
}

export function Header({ title, sub }) {
  return (
    <View style={styles.header}>
      <Text style={styles.eyebrow}>✦ ओंकार नाथ अग्रवाल सर्राफ</Text>
      <Text style={styles.title}>{title}</Text>
      {sub ? <Text style={styles.sub}>{sub}</Text> : null}
    </View>
  );
}

export function SectionTitle({ eyebrow, title, right }) {
  return (
    <View style={styles.sectionTitleRow}>
      <View style={{ flex: 1 }}>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {right}
    </View>
  );
}

export function Skeleton({ w, h, radius = 14 }) {
  return <View style={{ width: w, height: h, borderRadius: radius, backgroundColor: COLORS.ivoryDark, marginBottom: 10 }} />;
}

export function Loading({ text = 'Fetching latest rates...' }) {
  return (
    <View style={styles.loading}>
      <ActivityIndicator color={COLORS.gold} size="small" />
      <Text style={styles.loadingText}>{text}</Text>
    </View>
  );
}

export function ErrorBox({ message }) {
  return (
    <View style={styles.errorBox}>
      <Text style={styles.errorText}>{message}</Text>
    </View>
  );
}

export function Chip({ label, tone = 'pale' }) {
  return (
    <View style={[styles.chip, tone === 'dark' ? styles.chipDark : styles.chipPale]}>
      <Text style={[styles.chipText, tone === 'dark' && styles.chipTextDark]}>{label}</Text>
    </View>
  );
}

export function RateRow({ label, value, unit }) {
  return (
    <View style={styles.rateRow}>
      <Text style={styles.rateLabel}>{label}</Text>
      <Text style={styles.rateValue}>
        {inr(value)} <Text style={styles.rateUnit}>/ {unit || ''}</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.ivory },
  content: { padding: 16, paddingBottom: 40 },
  header: {
    marginBottom: 18,
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: COLORS.gold,
    fontWeight: '700',
    marginBottom: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.maroon,
  },
  sub: {
    fontSize: 13,
    color: COLORS.charcoalSoft,
    marginTop: 6,
    lineHeight: 19,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.charcoal,
  },
  loading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 30,
  },
  loadingText: { color: COLORS.charcoalSoft, fontSize: 13 },
  errorBox: {
    backgroundColor: '#FDEBEC',
    borderRadius: 14,
    padding: 16,
    marginVertical: 8,
  },
  errorText: { color: COLORS.danger, fontSize: 13, fontWeight: '600' },
  chip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  chipPale: { backgroundColor: COLORS.goldPale },
  chipDark: { backgroundColor: COLORS.maroon },
  chipText: { fontSize: 11, fontWeight: '700', color: '#8C651C' },
  chipTextDark: { color: COLORS.goldLight },
  rateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  rateLabel: { fontSize: 13, color: COLORS.charcoalSoft },
  rateValue: { fontSize: 15, fontWeight: '700', color: COLORS.charcoal },
  rateUnit: { fontSize: 10, color: COLORS.charcoalSoft },
});