import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Dimensions, 
  Pressable,
  ScrollView,
  TextInput
} from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withTiming, 
  Easing
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { DARK_COLORS, SPACING, SIZES } from '../constants/Theme';
import { REGIONS, PRICE_RANGES } from '../constants/Data';

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.85;

export default function FilterDrawer({ 
  isOpen, 
  onClose, 
  filters, 
  onUpdateFilters,
  colors = DARK_COLORS
}) {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { 
          translateX: withTiming(isOpen ? 0 : -DRAWER_WIDTH, { 
            duration: 400,
            easing: Easing.out(Easing.exp)
          }) 
        }
      ],
    };
  });

  const backdropStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isOpen ? 1 : 0),
      zIndex: isOpen ? 100 : -1,
    };
  });

  const categories = ['Hepsi', 'Villa', 'Daire', 'Ofis', 'Arsa'];

  const renderSection = (title, data, key, isObject = false) => (
    <View style={[styles.section, !title && { marginTop: -SPACING.md }]}>
      {title ? <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text> : null}
      <View style={styles.grid}>
        {data.map((item) => {
          const label = isObject ? item.label : item;
          const value = isObject ? item : item;
          const isActive = isObject ? filters[key].label === item.label : filters[key] === item;
          
          return (
            <TouchableOpacity
              key={label}
              onPress={() => onUpdateFilters({ ...filters, [key]: value })}
              style={[
                styles.btn,
                { backgroundColor: colors.surface, borderColor: colors.glass },
                isActive && { backgroundColor: colors.primary, borderColor: colors.primary }
              ]}
            >
              <Text style={[
                styles.btnText,
                { color: colors.textSecondary },
                isActive && { color: colors.white }
              ]}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  return (
    <>
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <Pressable style={styles.flex} onPress={onClose} />
      </Animated.View>

      <Animated.View style={[styles.drawer, animatedStyle, { backgroundColor: colors.background, borderColor: colors.glass }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Filtreleme</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={28} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          {renderSection('Mülk Tipi', categories, 'category')}
          
          <View style={[styles.divider, { backgroundColor: colors.glass }]} />
          
          <View style={styles.group}>
            <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: SPACING.sm }]}>Bölge</Text>
            <TextInput 
              placeholder="Şehir veya ilçe girin..."
              placeholderTextColor={colors.textSecondary}
              style={[styles.manualInput, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.glass }]}
              value={filters.region === 'Hepsi' ? '' : filters.region}
              onChangeText={(val) => onUpdateFilters({ ...filters, region: val || 'Hepsi' })}
            />
            {renderSection('', REGIONS.filter(r => r !== 'Hepsi'), 'region')}
          </View>

          <View style={[styles.divider, { backgroundColor: colors.glass }]} />
          
          <View style={styles.group}>
            <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: SPACING.sm }]}>Fiyat Aralığı (₺)</Text>
            <View style={styles.priceInputRow}>
              <TextInput 
                placeholder="Min"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
                style={[styles.priceInput, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.glass }]}
                value={filters.priceRange.min === 0 ? '' : filters.priceRange.min.toString()}
                onChangeText={(val) => onUpdateFilters({ 
                  ...filters, 
                  priceRange: { ...filters.priceRange, min: parseInt(val) || 0, label: 'Özel' } 
                })}
              />
              <View style={[styles.priceDash, { backgroundColor: colors.textSecondary }]} />
              <TextInput 
                placeholder="Max"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
                style={[styles.priceInput, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.glass }]}
                value={filters.priceRange.max === Infinity ? '' : filters.priceRange.max.toString()}
                onChangeText={(val) => onUpdateFilters({ 
                  ...filters, 
                  priceRange: { ...filters.priceRange, max: parseInt(val) || Infinity, label: 'Özel' } 
                })}
              />
            </View>
            {renderSection('', PRICE_RANGES.filter(p => p.label !== 'Hepsi'), 'priceRange', true)}
          </View>
        </ScrollView>

        <View style={[styles.footer, { backgroundColor: colors.background }]}>
          <TouchableOpacity style={styles.applyBtn} onPress={onClose}>
            <Text style={styles.applyBtnText}>Uygula</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  flex: {
    flex: 1,
  },
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    zIndex: 101,
    paddingTop: 60,
    borderRightWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
  },
  content: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: 120,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: SPACING.lg,
  },
  manualInput: {
    height: 50,
    borderRadius: SIZES.radius_md,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    marginBottom: SPACING.md,
    fontSize: 16,
  },
  priceInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  priceInput: {
    flex: 1,
    height: 50,
    borderRadius: SIZES.radius_md,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    fontSize: 16,
  },
  priceDash: {
    width: 15,
    height: 2,
    marginHorizontal: SPACING.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  btn: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: SIZES.radius_md,
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
    borderWidth: 1,
  },
  btnText: {
    fontWeight: '600',
    fontSize: 13,
  },
  divider: {
    height: 1,
    marginBottom: SPACING.xl,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.xl,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  applyBtn: {
    backgroundColor: '#C5A059',
    paddingVertical: SPACING.lg,
    borderRadius: SIZES.radius_md,
    alignItems: 'center',
  },
  applyBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  group: {
    gap: 10,
  },
});
