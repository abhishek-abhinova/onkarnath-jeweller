import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking } from 'react-native';
import AppImage from '../components/AppImage';
import { Header, Loading, ErrorBox } from '../components/ui';
import { apiGet } from '../api';
import { COLORS } from '../theme';
import { waLink } from '../config';

export default function Gallery({ navigation }) {
  const [items, setItems] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    apiGet('/api/gallery')
      .then((r) => setItems(r.gallery || []))
      .catch((e) => setError(e.message));
  }, []);

  if (!items) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.ivory, padding: 16 }}>
        <Header title="Gallery" />
        {error ? <ErrorBox message="Gallery temporarily unavailable." /> : <Loading />}
      </View>
    );
  }

  return (
    <FlatList
      style={{ flex: 1, backgroundColor: COLORS.ivory }}
      contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      numColumns={2}
      columnWrapperStyle={{ gap: 10 }}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={<Header title="हमारी डिज़ाइन गैलरी" sub="पसंद आए तो व्हाट्सऐप या दुकान पर बात करें" />}
      data={items}
      keyExtractor={(g) => g._id}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.item}
          activeOpacity={0.85}
          onPress={() => Linking.openURL(waLink(`नमस्ते, मुझे देखे गए डिज़ाइन (${item.title || 'gallery'}) की जानकारी चाहिए।`))}
        >
          <AppImage source={item.image} fallback={require('../../assets/icon.png')} style={styles.img} label="✦" />
          <View style={styles.caption}>
            <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
            {item.category ? <Text style={styles.cat}>{item.category}</Text> : null}
          </View>
        </TouchableOpacity>
      )}
      ListEmptyComponent={<ErrorBox message="गैलरी में अभी कोई फ़ोटो उपलब्ध नहीं है।" />}
    />
  );
}

const styles = StyleSheet.create({
  item: { flex: 1, marginBottom: 10, backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden' },
  img: { width: '100%', aspectRatio: 1 },
  caption: { padding: 8 },
  title: { fontSize: 12, fontWeight: '700', color: COLORS.charcoal },
  cat: { fontSize: 10, color: COLORS.charcoalSoft, marginTop: 2 },
});