// src/components/ui/GroundMarker.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ACTIVITY_COLORS, GroundActivityLevel } from '@/utils/groundActivity';
import { getSportIcon } from '@/constants/sports';

interface GroundMarkerProps {
  level: GroundActivityLevel;
  sportId: string;
}

export default function GroundMarker({ level, sportId }: GroundMarkerProps) {
  const colors = ACTIVITY_COLORS[level];
  const iconName = getSportIcon(sportId);

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.pin,
          { backgroundColor: colors.bg, borderColor: colors.border },
        ]}
      >
        <Ionicons name={iconName as any} size={16} color={colors.text} />
      </View>
      <View style={[styles.tail, { backgroundColor: colors.border }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center', justifyContent: 'center' },
  pin: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  tail: {
    width: 2,
    height: 8,
    borderRadius: 1,
    marginTop: -1,
  },
});
