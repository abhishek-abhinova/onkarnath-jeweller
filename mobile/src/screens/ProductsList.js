import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList } from 'react-native';
import ProductCard from '../components/ProductCard';
import { Loading, ErrorBox } from '../components/ui';
import { apiGet } from '../api';
import { COLORS } from '../theme';

export default function ProductsList({ route, navigation }) {
  const { category, title } = route.params;
  const [products, setProducts] = useState(null);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setProducts(null);
    const params = new URLSearchParams();
    if (category !== 'all') params.set('category', category);
    if (query.trim()) params.set('search', query.trim());
    apiGet(`/api/products?${params.toString()}`)
      .then((r) => setProducts(r.products || []))
      .catch((e) => setError(e.message));
  }, [category, query]);

  return (
    <View style={styles.root}>
      <View style={styles.searchWrap}>
        <TextInput
          style={styles.search}
          placeholder="Search jewellery..."
          value={query}
          onChangeText={setQuery}
          placeholderTextColor={COLORS.charcoalSoft}
        />
      </View>

      {!products ? (
        error ? <ErrorBox message="Products temporarily unavailable." /> : <Loading />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(p) => p._id}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={() => navigation.navigate('ProductDetail', { product: item })}
            />
          )}
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <ErrorBox message={error ? 'Products temporarily unavailable.' : `No jewellery found in ${title}. Try another search.`} />
          }
          ListHeaderComponent={<Text style={styles.title}>{title}</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.ivory },
  title: { fontSize: 20, fontWeight: '700', color: COLORS.maroon, marginBottom: 10 },
  searchWrap: { paddingHorizontal: 16, paddingTop: 12 },
  search: {
    backgroundColor: '#fff',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 11,
    fontSize: 14,
    color: COLORS.charcoal,
  },
});