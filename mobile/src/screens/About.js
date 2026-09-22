import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Screen, Header } from '../components/ui';
import { apiGet } from '../api';
import { COLORS } from '../theme';
import { BUSINESS } from '../config';

const DEFAULT_ABOUT =
  'ओंकार नाथ अग्रवाल सर्राफ is a trusted gold and silver sarraf based at Naraini Road, Atarra, District Banda, Uttar Pradesh. With years of honest dealing in pure gold and silver jewellery, we serve families across Atarra, Banda and nearby towns.';

const VALUES = [
  { t: 'शुद्धता का वादा', d: 'BIS hallmarked gold और 999 fine silver — शुद्धता में कोई समझौता नहीं।' },
  { t: 'पारदर्शी दरें', d: 'दर बोर्ड पर साफ भाव, कोई छिपा हुआ खर्च नहीं।' },
  { t: 'पीढ़ियों का भरोसा', d: 'अटारा के परिवारों का वर्षों का विश्वास।' },
];

export default function About() {
  const [about, setAbout] = useState(DEFAULT_ABOUT);

  useEffect(() => {
    apiGet('/api/settings')
      .then((r) => r.settings?.about && setAbout(r.settings.about))
      .catch(() => {});
  }, []);

  return (
    <Screen>
      <Header title="हमारी पहचान" sub="अटारा, बांदा — विश्वास की एक परंपरा" />
      <Text style={styles.para}>{about}</Text>

      {VALUES.map((v) => (
        <View key={v.t} style={styles.value}>
          <Text style={styles.valueTitle}>✦ {v.t}</Text>
          <Text style={styles.valueDesc}>{v.d}</Text>
        </View>
      ))}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{BUSINESS.name}</Text>
        <Text style={styles.cardSub}>{BUSINESS.address}</Text>
        <Text style={styles.cardSub}>{BUSINESS.phoneDisplay}</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  para: { fontSize: 14, lineHeight: 23, color: COLORS.charcoal, marginBottom: 18 },
  value: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.gold,
  },
  valueTitle: { fontSize: 14, fontWeight: '800', color: COLORS.maroon },
  valueDesc: { fontSize: 12, color: COLORS.charcoalSoft, marginTop: 6, lineHeight: 18 },
  card: {
    backgroundColor: COLORS.maroon,
    borderRadius: 18,
    padding: 18,
    marginTop: 6,
  },
  cardTitle: { color: COLORS.goldLight, fontSize: 16, fontWeight: '800' },
  cardSub: { color: 'rgba(251,246,236,0.8)', fontSize: 12, marginTop: 8, lineHeight: 18 },
});