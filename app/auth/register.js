import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { DARK_COLORS, SPACING, SIZES } from '../../constants/Theme';
import { registerUser } from '../../services/AuthService';

export default function RegisterScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!fullName || !email || !password) {
      Toast.show({
        type: 'error',
        text1: 'Hata',
        text2: 'Lütfen tüm alanları doldurun.'
      });
      return;
    }
    setLoading(true);
    const { user, error } = await registerUser(email, password, fullName);
    setLoading(false);
    
    if (error) {
      Toast.show({
        type: 'error',
        text1: 'Hata',
        text2: error
      });
    } else {
      Toast.show({
        type: 'success',
        text1: 'Başarılı',
        text2: 'Hesabınız oluşturuldu!'
      });
      router.replace('/(tabs)');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.content}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Kayıt Ol</Text>
          <Text style={styles.subtitle}>Best Emlak ailesine katılın</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#A0A0A0" style={styles.inputIcon} />
            <TextInput
              placeholder="Ad Soyad"
              placeholderTextColor="#A0A0A0"
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              maxLength={100}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#A0A0A0" style={styles.inputIcon} />
            <TextInput
              placeholder="E-posta"
              placeholderTextColor="#A0A0A0"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              maxLength={100}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#A0A0A0" style={styles.inputIcon} />
            <TextInput
              placeholder="Şifre"
              placeholderTextColor="#A0A0A0"
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              maxLength={100}
            />
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleRegister} disabled={loading}>
            <Text style={styles.loginButtonText}>{loading ? 'Kaydediliyor...' : 'Kayıt Ol'}</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Zaten hesabınız var mı?</Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.footerLink}>Giriş Yap</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK_COLORS.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
  },
  backButton: {
    marginTop: SPACING.md,
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  header: {
    marginTop: 30,
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#A0A0A0',
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderRadius: SIZES.radius_md,
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.md,
    height: 60,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: DARK_COLORS.primary,
    height: 60,
    borderRadius: SIZES.radius_md,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  footerText: {
    color: '#A0A0A0',
    marginRight: 8,
  },
  footerLink: {
    color: DARK_COLORS.primary,
    fontWeight: '700',
  },
});
