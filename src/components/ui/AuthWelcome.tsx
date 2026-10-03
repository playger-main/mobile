// src/components/ui/AuthWelcome.tsx
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from '@/i18n';
import { useTheme } from '@/hooks/useTheme';

interface AuthWelcomeProps {
  onGetStarted: () => void;
  bottomInset: number;
}

export default function AuthWelcome({ onGetStarted, bottomInset }: AuthWelcomeProps) {
  const navigation = useNavigation();
  const { height: windowHeight } = useWindowDimensions();
  const { t } = useTranslation();
  const { theme, colors } = useTheme();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const imageHeight = Math.min(windowHeight * 0.36, 280);

  // ✅ Градиент под тему (светлая → white, тёмная → background)
  const fadeColors: [string, string, string] =
    theme === 'dark'
      ? ['rgba(15, 17, 21, 0)', 'rgba(15, 17, 21, 0.5)', '#0F1115']
      : ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.5)', '#FFFFFF'];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 16 }]}
      >
        <View style={[styles.imageContainer, { height: imageHeight }]}>
          <Image
            source={require('../../assets/images/onboarding-sports.png')}
            style={styles.image}
            resizeMode="cover"
          />
          <LinearGradient colors={fadeColors} style={styles.imageFadeGradient} />
        </View>

        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            {t('auth.welcome.title')}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {t('auth.welcome.subtitle')}
          </Text>

          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <View
                style={[
                  styles.bulletIconContainer,
                  { backgroundColor: colors.primaryBg },
                ]}
              >
                <Ionicons name="calendar" size={16} color={colors.primary} />
              </View>
              <Text style={[styles.bulletText, { color: colors.textPrimary }]} numberOfLines={2}>
                {t('auth.welcome.bullet1')}
              </Text>
            </View>

            <View style={styles.bulletItem}>
              <View
                style={[
                  styles.bulletIconContainer,
                  { backgroundColor: colors.accentBg },
                ]}
              >
                <Ionicons name="heart-outline" size={16} color={colors.accent} />
              </View>
              <Text style={[styles.bulletText, { color: colors.textPrimary }]} numberOfLines={2}>
                {t('auth.welcome.bullet2')}
              </Text>
            </View>

            <View style={styles.bulletItem}>
              <View
                style={[
                  styles.bulletIconContainer,
                  { backgroundColor: colors.warningBg },
                ]}
              >
                <Ionicons name="trophy-outline" size={16} color={colors.warning} />
              </View>
              <Text style={[styles.bulletText, { color: colors.textPrimary }]} numberOfLines={2}>
                {t('auth.welcome.bullet3')}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: colors.background,
            borderTopColor: colors.borderSubtle,
            paddingBottom: bottomInset,
          },
        ]}
      >
        <Pressable
          style={[styles.primaryButton, { backgroundColor: colors.primaryDark }]}
          onPress={onGetStarted}
        >
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
  container: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  imageContainer: { width: '100%', position: 'relative' },
  image: { width: '100%', height: '100%' },
  imageFadeGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 140,
  },
  content: { paddingHorizontal: 24, paddingTop: 4 },
  title: { fontSize: 22, fontWeight: '800', letterSpacing: -0.5 },
  subtitle: { fontSize: 14, lineHeight: 21, marginTop: 10 },
  bulletList: { gap: 14, marginTop: 22 },
  bulletItem: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  bulletIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bulletText: { flex: 1, fontSize: 16, fontWeight: '600', lineHeight: 19 },
  bottomBar: {
    paddingHorizontal: 24,
    paddingTop: 12,
    // borderTopWidth: 1,
  },
  primaryButton: {
    width: '100%',
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  iconMargin: { marginRight: 6 },
});