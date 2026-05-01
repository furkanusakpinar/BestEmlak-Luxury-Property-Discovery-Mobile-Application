import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, SafeAreaView, FlatList, RefreshControl } from 'react-native';
import { DARK_COLORS, SPACING } from '../../constants/Theme';
import { subscribeToAuthChanges, toggleFavorite } from '../../services/AuthService';
import { getProperties } from '../../services/FirebaseService';
import PropertyCard from '../../components/PropertyCard';
import { useRouter } from 'expo-router';

export default function FavoritesScreen() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [properties, setProperties] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(() => {
    getProperties((data) => {
      setProperties(data);
      setRefreshing(false);
    });
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((u, data) => {
      setUser(u);
      setUserData(data);
    });
    fetchData();
    return unsubscribe;
  }, [fetchData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);

  const favoriteProperties = properties.filter(p => 
    userData?.favorites?.includes(p.id)
  ).map(p => ({ ...p, isFavorite: true }));

  const handleFavorite = async (propertyId) => {
    if (!user) return;
    await toggleFavorite(user.uid, propertyId, userData?.favorites || []);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Favorilerim</Text>
        <Text style={styles.subtitle}>Kaydettiğiniz lüks ilanlar</Text>
      </View>

      <FlatList
        data={favoriteProperties}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PropertyCard 
            item={item} 
            onPress={() => router.push(`/details/${item.id}`)}
            onFavorite={handleFavorite}
          />
        )}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={DARK_COLORS.primary}
            colors={[DARK_COLORS.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Henüz favori ilanınız yok.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: DARK_COLORS.background },
  header: { padding: SPACING.xl, paddingBottom: SPACING.md },
  title: { fontSize: 28, fontWeight: '800', color: '#FFFFFF' },
  subtitle: { fontSize: 16, color: '#A0A0A0', marginTop: 8 },
  list: { padding: SPACING.xl, paddingBottom: 100 },
  emptyContainer: { marginTop: 100, alignItems: 'center' },
  emptyText: { color: '#A0A0A0', fontSize: 16 }
});
