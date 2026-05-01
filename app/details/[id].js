import React from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ALL_PROPERTIES } from '../../constants/Data';
import { DARK_COLORS, SPACING, SIZES } from '../../constants/Theme';

export default function DetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const property = ALL_PROPERTIES.find(p => p.id === id);

  if (!property) return null;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={{ uri: property.image }} style={styles.image} />
        
        <SafeAreaView edges={['top']} style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </SafeAreaView>

        <View style={styles.content}>
          <Text style={styles.type}>{property.type}</Text>
          <Text style={styles.title}>{property.title}</Text>
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={16} color={DARK_COLORS.primary} />
            <Text style={styles.location}>{property.location}</Text>
          </View>

          <View style={styles.stats}>
            <View style={styles.stat}>
              <Ionicons name="bed-outline" size={20} color="#A0A0A0" />
              <Text style={styles.statText}>{property.beds} Yatak Odası</Text>
            </View>
            <View style={styles.stat}>
              <Ionicons name="resize-outline" size={20} color="#A0A0A0" />
              <Text style={styles.statText}>{property.sqm} m²</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Açıklama</Text>
          <Text style={styles.description}>{property.description}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View>
          <Text style={styles.priceLabel}>Fiyat</Text>
          <Text style={styles.price}>{property.priceStr}</Text>
        </View>
        <TouchableOpacity style={styles.bookButton}>
          <Text style={styles.bookButtonText}>Hemen İncele</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: DARK_COLORS.background },
  image: { width: '100%', height: 400 },
  header: { position: 'absolute', left: SPACING.xl, top: 0 },
  backButton: { 
    width: 45, 
    height: 45, 
    borderRadius: 23, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  content: { padding: SPACING.xl, marginTop: -30, backgroundColor: DARK_COLORS.background, borderTopLeftRadius: 30, borderTopRightRadius: 30 },
  type: { color: DARK_COLORS.primary, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, fontSize: 12, marginBottom: 8 },
  title: { color: '#FFFFFF', fontSize: 28, fontWeight: '800', marginBottom: 12 },
  locationContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  location: { color: '#A0A0A0', marginLeft: 6, fontSize: 16 },
  stats: { flexDirection: 'row', gap: 20, marginBottom: 30 },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statText: { color: '#A0A0A0', fontSize: 14 },
  sectionTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: '700', marginBottom: 12 },
  description: { color: '#A0A0A0', lineHeight: 24, fontSize: 16 },
  footer: { 
    padding: SPACING.xl, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: '#1E1E1E',
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)'
  },
  priceLabel: { color: '#A0A0A0', fontSize: 14 },
  price: { color: '#FFFFFF', fontSize: 22, fontWeight: '800' },
  bookButton: { backgroundColor: DARK_COLORS.primary, paddingHorizontal: 30, paddingVertical: 15, borderRadius: SIZES.radius_md },
  bookButtonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 }
});
