// src/components/ui/MapLegend.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ACTIVITY_COLORS } from '@/utils/groundActivity';
import { useTranslation } from '@/i18n';
import { useTheme } from '@/hooks/useTheme';

export default function MapLegend() {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const items: Array<{
    key: 'active' | 'upcoming' | 'none';
    labelKey: string;
  }> = [
    { key: 'active', labelKey: 'status.ground.active' },
    { key: 'upcoming', labelKey: 'status.ground.upcoming' },
    { key: 'none', labelKey: 'status.ground.none' },
  ];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          shadowColor: colors.shadow,
        },
      ]}
      pointerEvents="none"
    >
      {items.map(({ key, labelKey }) => (
        <View key={key} style={styles.row}>
          <View
            style={[
              styles.dot,
              { backgroundColor: ACTIVITY_COLORS[key].bg },
            ]}
          />
          <Text style={[styles.label, { color: colors.textPrimary }]}>
            {t(labelKey)}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
    gap: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
  },
});