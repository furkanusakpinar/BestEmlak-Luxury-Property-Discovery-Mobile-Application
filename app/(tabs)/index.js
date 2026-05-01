import React, { useState, useEffect, useCallback } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  FlatList,
  Alert,
  RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { COLORS, SPACING, SIZES } from '../../constants/Theme';
import PropertyCard from '../../components/PropertyCard';
import CategoryItem from '../../components/CategoryItem';
import { ALL_PROPERTIES, PRICE_RANGES } from '../../constants/Data';
import FilterDrawer from '../../components/FilterDrawer';
import { DARK_COLORS, LIGHT_COLORS } from '../../constants/Theme';
import { getProperties, seedDatabase } from '../../services/FirebaseService';
import { subscribeToAuthChanges, toggleFavorite } from '../../services/AuthService';

const CATEGORIES = ['Hepsi', 'Villa', 'Daire', 'Ofis', 'Arsa'];

export default function HomeScreen() {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const colors = isDarkMode ? DARK_COLORS : LIGHT_COLORS;
  
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [properties, setProperties] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: 'Hepsi',
    region: 'Hepsi',
    priceRange: PRICE_RANGES[0],
  });

  const fetchData = useCallback(() => {
    getProperties((data) => {
      const list = data.length > 0 ? data : ALL_PROPERTIES;
      setProperties(list);
      setRefreshing(false);
    });
  }, []);

  useEffect(() => {
    const unsubscribeAuth = subscribeToAuthChanges((u, data) => {
      setUser(u);
      setUserData(data);
    });

    fetchData();

    return () => unsubscribeAuth();
  }, [fetchData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);

  const handleFavorite = async (propertyId) => {
    if (!user) {
      Toast.show({ type: 'info', text1: 'Giriş Yapın', text2: 'Favorilere eklemek için giriş yapmalısınız.' });
      return;
    }
    const { favorites } = await toggleFavorite(user.uid, propertyId, userData?.favorites || []);
    if (favorites) {
      setUserData({ ...userData, favorites });
    }
  };

  const processedProperties = properties.map(p => ({
    ...p,
    isFavorite: userData?.favorites?.includes(p.id) || false
  }));

  const filteredProperties = processedProperties.filter(item => {
    const matchesCategory = filters.category === 'Hepsi' || item.type === filters.category;
    const matchesRegion = filters.region === 'Hepsi' || 
                         (item.region && item.region.toLowerCase().includes(filters.region.toLowerCase())) ||
                         (item.location && item.location.toLowerCase().includes(filters.region.toLowerCase()));
    const matchesPrice = item.price >= filters.priceRange.min && item.price <= filters.priceRange.max;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (item.location && item.location.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesRegion && matchesPrice && matchesSearch;
  });

  const featuredList = filteredProperties.filter(item => item.featured);
  const recentList = filteredProperties.filter(item => !item.featured);

  const renderHeader = () => (
    <View style={styles.header}>
      <View>
        <Text style={[styles.greeting, { color: colors.textSecondary }]}>Hoş Geldiniz,</Text>
        <Text style={[styles.userName, { color: colors.text }]}>Best Emlak</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity 
          style={[styles.profileButton, { backgroundColor: colors.surface, borderColor: colors.glass }]}
          onPress={() => setIsDarkMode(!isDarkMode)}
        >
          <Ionicons name={isDarkMode ? "sunny-outline" : "moon-outline"} size={24} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.profileButton, { backgroundColor: colors.surface, borderColor: colors.glass, marginLeft: 10 }]}
          onPress={() => Alert.alert('Profil', 'Profil sayfası yakında eklenecek.')}
        >
          <Ionicons name="notifications-outline" size={24} color={colors.text} />
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSearchBar = () => (
    <Animated.View entering={FadeInDown.delay(200)} style={styles.searchContainer}>
      <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.glass }]}>
        <Ionicons name="search-outline" size={20} color={colors.textSecondary} />
        <TextInput 
          placeholder="Şehir, semt veya proje ara..." 
          placeholderTextColor={colors.textSecondary}
          style={[styles.searchInput, { color: colors.text }]}
          value={searchQuery}
          onChangeText={setSearchQuery}
          maxLength={100}
        />
      </View>
      <TouchableOpacity 
        style={styles.filterButton}
        onPress={() => setIsDrawerOpen(true)}
      >
        <Ionicons name="options-outline" size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </Animated.View>
  );

  const renderCategories = () => (
    <View style={styles.categoryContainer}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryScrollContent}
      >
        {CATEGORIES.map((cat) => (
          <CategoryItem 
            key={cat} 
            title={cat} 
            active={filters.category === cat} 
            onPress={() => setFilters({ ...filters, category: cat })} 
            colors={colors}
          />
        ))}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {renderHeader()}
        {renderSearchBar()}
        {renderCategories()}

        {featuredList.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Öne Çıkanlar</Text>
              <TouchableOpacity onPress={() => {
                setSearchQuery('');
                setFilters({ category: 'Hepsi', region: 'Hepsi', priceRange: PRICE_RANGES[0] });
              }}>
                <Text style={styles.seeAll}>Temizle</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              horizontal
              data={featuredList}
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featuredList}
              renderItem={({ item, index }) => (
                <Animated.View entering={FadeInRight.delay(index * 200)}>
                  <PropertyCard 
                    item={item} 
                    horizontal 
                    onPress={() => router.push(`/details/${item.id}`)}
                    onFavorite={handleFavorite}
                    colors={colors}
                  />
                </Animated.View>
              )}
            />
          </>
        )}

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {searchQuery || filters.category !== 'Hepsi' ? 'Sonuçlar' : 'Yeni Eklenenler'}
          </Text>
        </View>

        <View style={styles.recentList}>
          {recentList.map((item, index) => (
            <Animated.View key={item.id} entering={FadeInDown.delay(400 + index * 100)}>
              <PropertyCard 
                item={item} 
                onPress={() => router.push(`/details/${item.id}`)}
                onFavorite={handleFavorite}
                colors={colors}
              />
            </Animated.View>
          ))}
          {recentList.length === 0 && (
            <Text style={[styles.noResults, { color: colors.textSecondary }]}>Sonuç bulunamadı.</Text>
          )}
        </View>
      </ScrollView>

      <FilterDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        filters={filters}
        onUpdateFilters={setFilters}
        colors={colors}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 120, // Increased for BottomTab
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  greeting: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  userName: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: '800',
  },
  profileButton: {
    width: 45,
    height: 45,
    borderRadius: SIZES.radius_md,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.glass,
  },
  notificationDot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    borderWidth: 2,
    borderColor: COLORS.surface,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    height: 55,
    borderRadius: SIZES.radius_md,
    marginRight: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.glass,
  },
  searchInput: {
    flex: 1,
    color: COLORS.white,
    marginLeft: SPACING.sm,
    fontSize: 16,
  },
  filterButton: {
    width: 55,
    height: 55,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius_md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryContainer: {
    marginBottom: SPACING.xl,
  },
  categoryScrollContent: {
    paddingHorizontal: SPACING.xl,
  },
  noResults: {
    color: COLORS.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    marginTop: SPACING.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '700',
  },
  seeAll: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  featuredList: {
    paddingLeft: SPACING.xl,
    paddingBottom: SPACING.lg,
  },
  recentList: {
    paddingHorizontal: SPACING.xl,
  },
});
