import { Tabs } from 'expo-router';
import React, { useState } from 'react';
import { View } from 'react-native';
import BottomTab from '../../components/BottomTab';
import FilterDrawer from '../../components/FilterDrawer';
import { DARK_COLORS, LIGHT_COLORS } from '../../constants/Theme';

export default function TabLayout() {
  const [isDarkMode] = useState(true); // Can be linked to a global theme context later
  const colors = isDarkMode ? DARK_COLORS : LIGHT_COLORS;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => {
        // Map current route name to tab id
        const currentRoute = props.state.routes[props.state.index].name;
        const activeTab = currentRoute === 'index' ? 'home' : currentRoute;

        return (
          <BottomTab 
            activeTab={activeTab} 
            onTabPress={(id) => {
              const route = id === 'home' ? 'index' : id;
              props.navigation.navigate(route);
            }} 
            colors={colors} 
          />
        );
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="agents" options={{ title: 'Agents' }} />
      <Tabs.Screen name="favorites" options={{ title: 'Favorites' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
