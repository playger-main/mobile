// src/components/ui/AuthWelcome.tsx
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from '@/i18n';

interface AuthWelcomeProps {
  onGetStarted: () => void;
  bottomInset: number;
}

export default function AuthWelcome({ onGetStarted, bottomInset }: AuthWelcomeProps) {
  const navigation = useNavigation();
  const { height: windowHeight } = useWindowDimensions();
  const { t } = useTranslation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={[styles.imageContainer, { height: windowHeight * 0.42 }]}>
        <Image
          source={require('../../assets/images/onboarding-sports.png')}
          style={styles.image}
          resizeMode="cover"
        />

        <LinearGradient
          colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.5)', '#FFFFFF']}
          style={styles.imageFadeGradient}
        />
      </View>

      <View style={[styles.content, { paddingBottom: bottomInset + 16 }]}>
        <View>
          <Text style={styles.title}>{t('auth.welcome.title')}</Text>
          <Text style={styles.subtitle}>{t('auth.welcome.subtitle')}</Text>

          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <View style={[styles.bulletIconContainer, { backgroundColor: '#EBF3FF' }]}>
                <Ionicons name="calendar" size={16} color="#208AEF" />
              </View>
              <Text style={styles.bulletText}>{t('auth.welcome.bullet1')}</Text>
            </View>

            <View style={styles.bulletItem}>
              <View style={[styles.bulletIconContainer, { backgroundColor: '#EAF9F5' }]}>
                <Ionicons name="heart-outline" size={16} color="#27AE60" />
              </View>
              <Text style={styles.bulletText}>{t('auth.welcome.bullet2')}</Text>
            </View>

            <View style={styles.bulletItem}>
              <View style={[styles.bulletIconContainer, { backgroundColor: '#FFF0E6' }]}>
                <Ionicons name="trophy-outline" size={16} color="#FF8000" />
              </View>
              <Text style={styles.bulletText}>{t('auth.welcome.bullet3')}</Text>
            </View>
          </View>
        </View>

        <Pressable style={styles.primaryButton} onPress={onGetStarted}>
          <Ionicons
            name="log-in-outline"
            size={20}
            color="#FFFFFF"
            style={styles.iconMargin}
          />
          <Text style={styles.primaryButtonText}>
            {t('auth.welcome.getStarted')}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  imageContainer: { width: '100%', position: 'relative' },
  image: { width: '100%', height: '100%' },
  imageFadeGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#6080A8',
    lineHeight: 22,
    marginTop: 12,
  },
  bulletList: { gap: 16, marginTop: 28 },
  bulletItem: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  bulletIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bulletText: { fontSize: 14, fontWeight: '600', color: '#334A77' },
  primaryButton: {
    width: '100%',
    height: 52,
    backgroundColor: '#006EE6',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  iconMargin: { marginRight: 6 },
});