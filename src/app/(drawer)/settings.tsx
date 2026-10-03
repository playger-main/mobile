// src/app/(drawer)/settings.tsx
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  Switch,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUnit } from 'effector-react';

import LanguagePickerModal from '@/components/ui/LanguagePickerModal';
import ThemePickerModal from '@/components/ui/ThemePickerModal';
import { useTranslation } from '@/i18n';
import { useTheme } from '@/hooks/useTheme';

import {
  $eventReminders,
  $useLocation,
  $appLanguage,
  $themeMode,
  toggleEventReminders,
  toggleUseLocation,
} from '@/effector/store';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useTheme();

  const {
    eventReminders,
    useLocation,
    language,
    themeMode,
    changeReminders,
    changeLocation,
  } = useUnit({
    eventReminders: $eventReminders,
    useLocation: $useLocation,
    language: $appLanguage,
    themeMode: $themeMode,
    changeReminders: toggleEventReminders,
    changeLocation: toggleUseLocation,
  });

  const [languagePickerVisible, setLanguagePickerVisible] = useState(false);
  const [themePickerVisible, setThemePickerVisible] = useState(false);

  const handleBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/(drawer)/(tabs)/profile');
  };

  const currentLanguageLabel = (() => {
    switch (language) {
      case 'ru':
        return 'Русский';
      case 'be':
        return 'Беларуская';
      case 'lt':
        return 'Lietuvių';
      case 'pl':
        return 'Polski';
      case 'uk':
        return 'Українська';
      default:
        return 'English';
    }
  })();

  const currentThemeLabel = (() => {
    switch (themeMode) {
      case 'light':
        return t('settings.themeLight');
      case 'dark':
        return t('settings.themeDark');
      default:
        return t('settings.themeSystem');
    }
  })();

  return (
    <View style={[styles.container, { backgroundColor: colors.listBackground }]}>
      {/* HEADER */}
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
          {t('settings.title')}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ===== APPEARANCE ===== */}
        <Text style={[styles.sectionHeader, { color: colors.textTertiary }]}>
          {t('settings.appearance')}
        </Text>
        <View
          style={[
            styles.blockContainer,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Pressable
            style={[styles.rowItem, styles.noBorder, { borderColor: colors.borderSubtle }]}
            onPress={() => setThemePickerVisible(true)}
          >
            <View style={styles.rowLeft}>
              <Ionicons
                name="color-palette-outline"
                size={20}
                color={colors.textSecondary}
                style={styles.rowIcon}
              />
              <Text style={[styles.rowText, { color: colors.textPrimary }]}>
                {t('settings.theme')}
              </Text>
            </View>
            <View style={styles.rowRight}>
              <Text style={[styles.rowValueText, { color: colors.textTertiary }]}>
                {currentThemeLabel}
              </Text>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={colors.textTertiary}
              />
            </View>
          </Pressable>
        </View>

        {/* ===== PREFERENCES ===== */}
        <Text style={[styles.sectionHeader, { color: colors.textTertiary }]}>
          {t('settings.preferences')}
        </Text>
        <View
          style={[
            styles.blockContainer,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <View style={[styles.rowItem, { borderColor: colors.borderSubtle }]}>
            <View style={styles.rowLeft}>
              <Ionicons
                name="notifications-outline"
                size={20}
                color={colors.textSecondary}
                style={styles.rowIcon}
              />
              <Text style={[styles.rowText, { color: colors.textPrimary }]}>
                {t('settings.eventReminders')}
              </Text>
            </View>
            <Switch
              value={eventReminders}
              onValueChange={(value) => {
                changeReminders(value);
              }}
              trackColor={{ false: colors.textTertiary, true: colors.accent }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View
            style={[
              styles.rowItem,
              styles.noBorder,
              { borderColor: colors.borderSubtle },
            ]}
          >
            <View style={styles.rowLeft}>
              <Ionicons
                name="location-outline"
                size={20}
                color={colors.textSecondary}
                style={styles.rowIcon}
              />
              <Text style={[styles.rowText, { color: colors.textPrimary }]}>
                {t('settings.useLocation')}
              </Text>
            </View>
            <Switch
              value={useLocation}
              onValueChange={(value) => {
                changeLocation(value);
              }}
              trackColor={{ false: colors.textTertiary, true: colors.accent }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* ===== GENERAL ===== */}
        <Text style={[styles.sectionHeader, { color: colors.textTertiary }]}>
          {t('settings.general')}
        </Text>
        <View
          style={[
            styles.blockContainer,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Pressable
            style={[styles.rowItem, { borderColor: colors.borderSubtle }]}
            onPress={() => setLanguagePickerVisible(true)}
          >
            <View style={styles.rowLeft}>
              <Ionicons
                name="globe-outline"
                size={20}
                color={colors.textSecondary}
                style={styles.rowIcon}
              />
              <Text style={[styles.rowText, { color: colors.textPrimary }]}>
                {t('settings.language')}
              </Text>
            </View>
            <View style={styles.rowRight}>
              <Text style={[styles.rowValueText, { color: colors.textTertiary }]}>
                {currentLanguageLabel}
              </Text>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={colors.textTertiary}
              />
            </View>
          </Pressable>

          <Pressable
            style={[
              styles.rowItem,
              styles.noBorder,
              { borderColor: colors.borderSubtle },
            ]}
            onPress={() => console.log('Privacy pressed')}
          >
            <View style={styles.rowLeft}>
              <Ionicons
                name="shield-checkmark-outline"
                size={20}
                color={colors.textSecondary}
                style={styles.rowIcon}
              />
              <Text style={[styles.rowText, { color: colors.textPrimary }]}>
                {t('settings.privacy')}
              </Text>
            </View>
            <View style={styles.rowRight}>
              <Text style={[styles.rowValueText, { color: colors.textTertiary }]}>
                {t('settings.manage')}
              </Text>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={colors.textTertiary}
              />
            </View>
          </Pressable>
        </View>

        <Text style={[styles.versionText, { color: colors.textTertiary }]}>
          {t('settings.version')}
        </Text>
      </ScrollView>

      <LanguagePickerModal
        visible={languagePickerVisible}
        onClose={() => setLanguagePickerVisible(false)}
      />

      <ThemePickerModal
        visible={themePickerVisible}
        onClose={() => setThemePickerVisible(false)}
      />
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
  headerTitle: { fontSize: 17, fontWeight: '700', lineHeight: 48 },
  headerSpacer: { width: 32 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 20 },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginLeft: 4,
  },
  blockContainer: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  noBorder: { borderBottomWidth: 0 },
  rowLeft: { flexDirection: 'row', alignItems: 'center' },
  rowIcon: { marginRight: 12 },
  rowText: { fontSize: 14, fontWeight: '600' },
  rowRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  rowValueText: { fontSize: 14, fontWeight: '500' },
  versionText: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 8,
  },
});