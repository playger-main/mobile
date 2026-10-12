// src/app/(drawer)/terms.tsx
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useTranslation } from '@/i18n';
import { useTheme } from '@/hooks/useTheme';

export default function TermsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useTheme();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(drawer)/(tabs)');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.listBackground }]}>
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + 6,
            backgroundColor: colors.background,
            borderColor: colors.borderSubtle,
          },
        ]}
      >
        <Pressable onPress={handleBack} style={styles.backButton} hitSlop={12}>
          <Ionicons name="chevron-back" size={24} color={colors.primary} />
        </Pressable>
        <Text
          style={[styles.headerTitle, { color: colors.textPrimary }]}
          numberOfLines={1}
        >
          {t('legal.terms.title')}
        </Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 40 },
        ]}
      >
        <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
          {t('legal.terms.body')}
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
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 17, fontWeight: '700', flex: 1, textAlign: 'center' },
  scrollContent: { paddingHorizontal: 24, paddingTop: 20 },
  paragraph: { fontSize: 14, lineHeight: 22 },
});