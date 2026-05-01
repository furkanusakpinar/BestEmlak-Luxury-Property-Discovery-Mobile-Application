import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, SafeAreaView, FlatList, Image, TouchableOpacity, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { DARK_COLORS, SPACING, SIZES } from '../../constants/Theme';
import { getAgents } from '../../services/FirebaseService';

export default function AgentsScreen() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(() => {
    getAgents((data) => {
      setAgents(data);
      setLoading(false);
      setRefreshing(false);
    });
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);

  const renderAgent = ({ item }) => (
    <TouchableOpacity style={styles.agentCard} activeOpacity={0.9}>
      <View style={styles.cardHeader}>
        <Image source={{ uri: item.image }} style={styles.avatar} />
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.role}>{item.role}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={styles.ratingText}>{item.rating} • {item.experience}</Text>
          </View>
        </View>
      </View>
      
      <Text style={styles.bio} numberOfLines={2}>{item.bio}</Text>
      
      <View style={styles.cardFooter}>
        <View style={styles.footerStat}>
          <Text style={styles.statLabel}>Aktif İlanlar</Text>
          <Text style={styles.statValue}>{item.listings}</Text>
        </View>
        <TouchableOpacity style={styles.contactBtn}>
          <Text style={styles.contactText}>İletişime Geç</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={styles.title}>Uzman Emlakçılar</Text>
        </View>
        <Text style={styles.subtitle}>Güvenilir ve profesyonel danışman kadromuz</Text>
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={DARK_COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={agents}
          keyExtractor={(item) => item.id}
          renderItem={renderAgent}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
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
              <Text style={styles.emptyText}>Henüz emlakçı bulunamadı. Lütfen senkronize edin.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: DARK_COLORS.background },
  header: { padding: SPACING.xl, paddingBottom: SPACING.md },
  title: { fontSize: 28, fontWeight: '800', color: '#FFFFFF' },
  subtitle: { fontSize: 16, color: '#A0A0A0', marginTop: 8 },
  list: { padding: SPACING.xl, paddingBottom: 100 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 },
  emptyText: { color: '#A0A0A0', fontSize: 16, textAlign: 'center' },
  agentCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: SIZES.radius_lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md },
  avatar: { width: 70, height: 70, borderRadius: 35 },
  headerInfo: { marginLeft: SPACING.md, flex: 1 },
  name: { fontSize: 18, fontWeight: '700', color: '#FFFFFF' },
  role: { fontSize: 14, color: DARK_COLORS.primary, marginTop: 2 },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  ratingText: { color: '#A0A0A0', fontSize: 12, marginLeft: 4 },
  bio: { color: '#A0A0A0', fontSize: 14, lineHeight: 20, marginBottom: SPACING.md },
  cardFooter: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    borderTopWidth: 1, 
    borderTopColor: 'rgba(255,255,255,0.05)',
    paddingTop: SPACING.md 
  },
  footerStat: { },
  statLabel: { color: '#A0A0A0', fontSize: 11, textTransform: 'uppercase' },
  statValue: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', marginTop: 2 },
  contactBtn: { backgroundColor: DARK_COLORS.primary, paddingHorizontal: 20, paddingVertical: 10, borderRadius: SIZES.radius_md },
  contactText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 }
});
