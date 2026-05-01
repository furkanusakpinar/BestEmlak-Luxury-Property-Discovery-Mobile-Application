import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { DARK_COLORS, SPACING, SIZES } from '../../constants/Theme';
import { logoutUser, subscribeToAuthChanges } from '../../services/AuthService';

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((u, data) => {
      setUser(u);
      setUserData(data);
    });
    return unsubscribe;
  }, []);

  const handleLogout = () => {
    Alert.alert('Çıkış', 'Çıkış yapmak istediğinize emin misiniz?', [
      { text: 'İptal', style: 'cancel' },
      { text: 'Çıkış Yap', onPress: async () => {
        await SecureStore.deleteItemAsync('saved_email');
        await SecureStore.deleteItemAsync('saved_password');
        await logoutUser();
        router.replace('/auth/login');
      }}
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Profil</Text>
        
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle" size={80} color={DARK_COLORS.primary} />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{userData?.fullName || 'Misafir Kullanıcı'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'Giriş yapılmadı'}</Text>
          </View>
        </View>

        <View style={styles.menu}>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="settings-outline" size={24} color="#FFFFFF" />
            <Text style={styles.menuText}>Ayarlar</Text>
            <Ionicons name="chevron-forward" size={20} color="#A0A0A0" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, styles.logoutItem]} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="#FF5252" />
            <Text style={[styles.menuText, { color: '#FF5252' }]}>Çıkış Yap</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: DARK_COLORS.background },
  content: { padding: SPACING.xl },
  title: { fontSize: 28, fontWeight: '800', color: '#FFFFFF', marginBottom: 30 },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    padding: SPACING.lg,
    borderRadius: SIZES.radius_lg,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  userInfo: { marginLeft: SPACING.md },
  userName: { fontSize: 20, fontWeight: '700', color: '#FFFFFF' },
  userEmail: { fontSize: 14, color: '#A0A0A0', marginTop: 4 },
  menu: { gap: SPACING.md },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    padding: SPACING.md,
    borderRadius: SIZES.radius_md,
    height: 60,
  },
  menuText: { flex: 1, marginLeft: 15, fontSize: 16, color: '#FFFFFF', fontWeight: '600' },
  adminItem: { borderColor: DARK_COLORS.primary, borderWidth: 1 },
});
