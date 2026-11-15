// src/components/forms/ScreenHeader.tsx
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Ionicons from '@react-native-vector-icons/ionicons';

import { useTranslation } from '@/i18n';
import { useTheme } from '@/hooks/useTheme';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  /** По умолчанию — router.back() */
  onBack?: () => void;
  /** Правый слот вместо пустой заглушки (например, кнопка «Сохранить») */
  rightSlot?: React.ReactNode;
}

/**
 * ✅ P2: единый заголовок экранов-форм.
 * Раньше этот блок (JSX + 5 правил StyleSheet) копировался в каждый экран.
 */
export default function ScreenHeader({
  title,
  subtitle,
  onBack,
  rightSlot,
}: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
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
      <Pressable
        onPress={onBack ?? (() => router.back())}
        style={styles.backButton}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel={t('common.back')}
      >
        <Ionicons name="chevron-back" size={24} color={colors.primary} />
      </Pressable>

      <View style={styles.titleContainer}>
        <Text
          style={[styles.title, { color: colors.textPrimary }]}
          numberOfLines={1}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text
            style={[styles.subtitle, { color: colors.textTertiary }]}
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>

      <View style={styles.rightSlot}>{rightSlot}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  backButton: { padding: 4 },
  // ✅ 10px отступ от кнопок, чтобы длинный заголовок не наезжал на них
  titleContainer: { flex: 1, alignItems: 'center', paddingHorizontal: 10 },
  title: { fontSize: 17, fontWeight: '700' },
  subtitle: { fontSize: 12, fontWeight: '500', marginTop: 1 },
  // ширина фиксирована, чтобы заголовок оставался по центру
  rightSlot: { width: 32, alignItems: 'flex-end' },
});
