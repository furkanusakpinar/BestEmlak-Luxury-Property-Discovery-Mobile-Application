import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { DARK_COLORS, SPACING, SIZES, SHADOWS } from '../constants/Theme';

export default function PropertyCard({ item, onPress, onFavorite, horizontal = false, colors = DARK_COLORS }) {
  const cardWidth = horizontal ? 280 : '100%';
  
  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        { width: cardWidth, backgroundColor: colors.surface, borderColor: colors.glass, borderWidth: 1 }, 
        !horizontal && styles.verticalCard
      ]} 
      activeOpacity={0.9}
      onPress={onPress}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      
      <TouchableOpacity 
        style={styles.heartButton} 
        onPress={(e) => {
          e.stopPropagation();
          onFavorite && onFavorite(item.id);
        }}
      >
        <Ionicons 
          name={item.isFavorite ? "heart" : "heart-outline"} 
          size={22} 
          color={item.isFavorite ? "#FF5252" : "#FFFFFF"} 
        />
      </TouchableOpacity>

      <View style={styles.priceBadge}>
        <Text style={styles.priceText}>{item.priceStr || item.price}</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>{item.title}</Text>
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={14} color={colors.primary} />
          <Text style={[styles.locationText, { color: colors.textSecondary }]}>{item.location}</Text>
        </View>
        
        <View style={styles.detailsRow}>
          {item.beds > 0 && (
            <View style={styles.detailItem}>
              <Ionicons name="bed-outline" size={16} color={colors.textSecondary} />
              <Text style={[styles.detailText, { color: colors.textSecondary }]}>{item.beds} Yatak</Text>
            </View>
          )}
          <View style={styles.detailItem}>
            <Ionicons name="resize-outline" size={16} color={colors.textSecondary} />
            <Text style={[styles.detailText, { color: colors.textSecondary }]}>{item.sqm} m²</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: DARK_COLORS.surface,
    borderRadius: SIZES.radius_lg,
    marginRight: SPACING.md,
    overflow: 'hidden',
    ...SHADOWS.dark,
  },
  verticalCard: {
    marginBottom: SPACING.lg,
  },
  image: {
    width: '100%',
    height: 180,
  },
  heartButton: {
    position: 'absolute',
    top: SPACING.md,
    left: SPACING.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  priceBadge: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    backgroundColor: DARK_COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: SIZES.radius_sm,
  },
  priceText: {
    color: DARK_COLORS.white,
    fontWeight: '700',
    fontSize: 14,
  },
  infoContainer: {
    padding: SPACING.md,
  },
  title: {
    color: DARK_COLORS.white,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  locationText: {
    color: DARK_COLORS.textSecondary,
    fontSize: 12,
    marginLeft: 4,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  detailText: {
    color: DARK_COLORS.textSecondary,
    fontSize: 12,
    marginLeft: 6,
  },
});
