// src/components/ui/MapLegend.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ACTIVITY_COLORS, ACTIVITY_LABELS } from '@/utils/groundActivity';

export default function MapLegend() {
  const items: Array<{ key: 'active' | 'upcoming' | 'none' }> = [
    { key: 'active' },
    { key: 'upcoming' },
    { key: 'none' },
  ];

  return (
    <View style={styles.container} pointerEvents="none">
      {items.map(({ key }) => (
        <View key={key} style={styles.row}>
          <View
            style={[
              styles.dot,
              { backgroundColor: ACTIVITY_COLORS[key].bg },
            ]}
          />
          <Text style={styles.label}>{ACTIVITY_LABELS[key]}</Text>
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
