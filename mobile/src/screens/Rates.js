import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { ScrollView } from 'react-native';
import { Header, Loading, ErrorBox, Chip } from '../components/ui';
import RateCard from '../components/RateCard';
import { apiGet } from '../api';
import { COLORS, fmtDateTime } from '../theme';

export default function Rates({ navigation }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const load = async (silent = false) => {
    if (silent) setRefreshing(true);
    setError('');
    try {
      const res = await apiGet('/api/rates');
      setData(res);
    } catch (e) {
      setError(e.message);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const statusLabel = {
    live: '● Live Rate',
    cached: '● Cached',
    fallback: '● Reference Rates',
    unavailable: '● Unavailable',
  }[data?.meta?.status] || '…';

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.ivory }}
      contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={COLORS.gold} />}
      showsVerticalScrollIndicator={false}
    >
      <Header title="आज के सोने और चांदी के भाव" sub="IBJA benchmark rates • Updated automatically" />

      <View style={styles.toolbar}>
        <Chip label={statusLabel} tone="dark" />
        <TouchableOpacity style={styles.refresh} onPress={() => load(true)}>
          <Text style={styles.refreshText}>↻ Refresh</Text>
        </TouchableOpacity>
      </View>

      {!data ? (
        error ? <ErrorBox message="Latest rate temporarily unavailable." /> : <Loading />
      ) : data.rates?.length ? (
        data.rates.map((r) => <RateCard key={`${r.metal}-${r.purity}`} rate={r} />)
      ) : (
        <ErrorBox message="Rate temporarily unavailable." />
      )}

      {data?.meta && (
        <View style={styles.meta}>
          <Meta label="Rate Date" value={data.meta.date} />
          <Meta label="Last Updated" value={fmtDateTime(data.meta.updatedAt)} />
          <Meta label="Market Status" value={data.meta.marketStatus} />
        </View>
      )}

      <Text style={styles.disclaimer}>
        Rates are indicative/benchmark rates and exclude GST & making charges. Rates may not be published on
        Saturdays, Sundays and certain holidays.
      </Text>

      <TouchableOpacity style={styles.calcBtn} onPress={() => navigation.navigate('Calculator')}>
        <Text style={styles.calcBtnText}>🧮 Rate Calculator →</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function Meta({ label, value }) {
  return (
    <View style={styles.metaItem}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value || '—'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  toolbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  refresh: { borderWidth: 1, borderColor: 'rgba(201,148,44,0.5)', borderRadius: 999, paddingVertical: 8, paddingHorizontal: 14 },
  refreshText: { color: '#8C651C', fontSize: 12, fontWeight: '700' },
  meta: { flexDirection: 'row', gap: 8, marginTop: 6 },
  metaItem: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
  },
  metaLabel: { fontSize: 9, fontWeight: '700', letterSpacing: 1, color: COLORS.charcoalSoft },
  metaValue: { fontSize: 12, fontWeight: '700', color: COLORS.charcoal, marginTop: 4 },
  disclaimer: { fontSize: 10, color: COLORS.charcoalSoft, lineHeight: 15, marginTop: 14, textAlign: 'center' },
  calcBtn: {
    marginTop: 16,
    backgroundColor: COLORS.maroon,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
  },
  calcBtnText: { color: COLORS.goldLight, fontWeight: '700', fontSize: 14 },
});