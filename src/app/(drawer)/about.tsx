// src/app/(drawer)/about.tsx
import React from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useTranslation } from '@/i18n';
import { useTheme } from '@/hooks/useTheme';

export default function AboutScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useTheme();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(drawer)/(tabs)/profile');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.listBackground }]}>
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top,
            // backgroundColor: colors.background,
            borderColor: colors.borderSubtle,
          },
        ]}
      >
        <Pressable onPress={handleBack} style={styles.backButton} hitSlop={12}>
          <Ionicons name="chevron-back" size={24} color={colors.primary} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          {t('about.title')}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 24 },
        ]}
      >
        <View style={styles.logoContainer}>
          <View
            style={[
              styles.logoBox,
              { backgroundColor: colors.primaryDark, shadowColor: colors.shadow },
            ]}
          >
            <Ionicons name="basketball-outline" size={36} color="#FFFFFF" />
          </View>
        </View>

        <Text style={[styles.title, { color: colors.textPrimary }]}>PlayG</Text>
        <Text style={[styles.tagline, { color: colors.textSecondary }]}>
          {t('about.tagline')}
        </Text>

        <Text style={[styles.description, { color: colors.textSecondary }]}>
          {t('about.description')}
        </Text>

        <View style={styles.featuresList}>
          {[
            { icon: 'location', titleKey: 'about.feature.discover.title', subKey: 'about.feature.discover.subtitle' },
            { icon: 'information-circle', titleKey: 'about.feature.join.title', subKey: 'about.feature.join.subtitle' },
            { icon: 'shield-checkmark', titleKey: 'about.feature.play.title', subKey: 'about.feature.play.subtitle' },
          ].map((item, idx) => (
            <View
              key={idx}
              style={[
                styles.featureCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <View
                style={[
                  styles.iconBadge,
                  { backgroundColor: colors.primaryBg },
                ]}
              >
                <Ionicons
                  name={item.icon as any}
                  size={22}
                  color={colors.primary}
                />
              </View>
              <View style={styles.featureInfo}>
                <Text
                  style={[styles.featureTitle, { color: colors.textPrimary }]}
                >
                  {t(item.titleKey)}
                </Text>
                <Text
                  style={[styles.featureSubtitle, { color: colors.textSecondary }]}
                >
                  {t(item.subKey)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <Text style={[styles.versionText, { color: colors.textTertiary }]}>
          {t('about.version')}
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingBottom: 6,
    borderBottomWidth: 1,
  },
  backButton: { padding: 4 },
  headerTitle: {
    fontSize: 17,
    lineHeight: 48,
    fontWeight: '700',
    textAlign: 'center',
  },
  headerSpacer: { width: 32 },
  scrollContent: { paddingHorizontal: 24, paddingTop: 32 },
  logoContainer: {
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  logoBox: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 15,
    fontWeight: '500',
    marginTop: 4,
    marginBottom: 20,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 28,
  },
  featuresList: { gap: 12, marginBottom: 40 },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureInfo: { flex: 1, marginLeft: 14 },
  featureTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  featureSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  versionText: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 10,
  },
});