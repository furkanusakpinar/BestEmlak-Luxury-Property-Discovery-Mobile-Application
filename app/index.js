import React, { useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withDelay, 
  Easing 
} from 'react-native-reanimated';
import { COLORS, SPACING, SIZES } from '../constants/Theme';

const { width, height } = Dimensions.get('window');

export default function OnboardingScreen() {
  const router = useRouter();
  
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(30);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 1000 });
    translateY.value = withTiming(0, { 
      duration: 1000, 
      easing: Easing.out(Easing.exp) 
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop' }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
        
        <Animated.View style={[styles.content, animatedStyle]}>
          <Text style={styles.subtitle}>Lüksün Yeni Adresi</Text>
          <Text style={styles.title}>Best Emlak</Text>
          <Text style={styles.description}>
            Hayalinizdeki evi bulmanız için kurumsal ve güvenilir çözümler sunuyoruz.
          </Text>
          
          <TouchableOpacity 
            style={styles.button}
            activeOpacity={0.8}
            onPress={() => router.replace('/auth/login')}
          >
            <Text style={styles.buttonText}>Keşfetmeye Başla</Text>
          </TouchableOpacity>
        </Animated.View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  content: {
    padding: SPACING.xl,
    paddingBottom: SPACING.xxl + 20,
    backgroundColor: 'rgba(18, 18, 18, 0.85)',
    borderTopLeftRadius: SIZES.radius_xl,
    borderTopRightRadius: SIZES.radius_xl,
  },
  subtitle: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: SPACING.xs,
  },
  title: {
    color: COLORS.white,
    fontSize: 42,
    fontWeight: '800',
    marginBottom: SPACING.md,
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: SPACING.xl,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.lg,
    borderRadius: SIZES.radius_md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '700',
  },
});
