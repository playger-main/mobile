// src/components/ui/MapLegend.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ACTIVITY_COLORS } from '@/utils/groundActivity';
import { useTranslation } from '@/i18n';

export default function MapLegend() {
  const { t } = useTranslation();

  const items: Array<{
    key: 'active' | 'upcoming' | 'none';
    labelKey: string;
  }> = [
    { key: 'active', labelKey: 'status.ground.active' },
    { key: 'upcoming', labelKey: 'status.ground.upcoming' },
    { key: 'none', labelKey: 'status.ground.none' },
  ];

  return (
    <View style={styles.container} pointerEvents="none">
      {items.map(({ key, labelKey }) => (
        <View key={key} style={styles.row}>
          <View
            style={[
              styles.dot,
              { backgroundColor: ACTIVITY_COLORS[key].bg },
            ]}
          />
          <Text style={styles.label}>{t(labelKey)}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    shadowColor: '#000',
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
    color: '#334A77',
    fontWeight: '500',
  },
});