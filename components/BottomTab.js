import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { SPACING, SIZES } from '../constants/Theme';

const { width } = Dimensions.get('window');

const TABS = [
  { id: 'home', icon: 'home-outline', activeIcon: 'home', label: 'Ana Sayfa' },
  { id: 'agents', icon: 'people-outline', activeIcon: 'people', label: 'Emlakçılar' },
  { id: 'favorites', icon: 'heart-outline', activeIcon: 'heart', label: 'Favoriler' },
  { id: 'profile', icon: 'person-outline', activeIcon: 'person', label: 'Profil' },
];

export default function BottomTab({ activeTab, onTabPress, colors }) {
  return (
    <View style={styles.outerContainer}>
      <BlurView intensity={80} tint={colors.background === '#FFFFFF' ? 'light' : 'dark'} style={styles.container}>
        <View style={[styles.content, { borderTopColor: colors.glass }]}>
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                style={styles.tab}
                onPress={() => onTabPress(tab.id)}
                activeOpacity={0.7}
              >
                <Ionicons 
                  name={isActive ? tab.activeIcon : tab.icon} 
                  size={24} 
                  color={isActive ? colors.primary : colors.textSecondary} 
                />
                <Text style={[
                  styles.label, 
                  { color: isActive ? colors.primary : colors.textSecondary }
                ]}>
                  {tab.label}
                </Text>
                {isActive && (
                  <View style={[styles.activeIndicator, { backgroundColor: colors.primary }]} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    bottom: 0,
    width: width,
    paddingBottom: 20, // To give some space at the bottom (iPhone home bar)
  },
  container: {
    marginHorizontal: SPACING.lg,
    borderRadius: 30,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  content: {
    flexDirection: 'row',
    height: 70,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: SPACING.md,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 4,
  },
  activeIndicator: {
    position: 'absolute',
    top: -10,
    width: 20,
    height: 3,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  }
});
