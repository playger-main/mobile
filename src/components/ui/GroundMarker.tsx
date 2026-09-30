// src/components/ui/GroundMarker.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ACTIVITY_COLORS, GroundActivityLevel } from '@/utils/groundActivity';
import { getSportIcon } from '@/constants/sports';

interface GroundMarkerProps {
  level: GroundActivityLevel;
  sportId: string;
  sportsCount?: number;
}

export default function GroundMarker({
  level,
  sportId,
  sportsCount = 1,
}: GroundMarkerProps) {
  const colors = ACTIVITY_COLORS[level];
  const iconName = getSportIcon(sportId);
  const hasMultiple = sportsCount > 1;

  return (
    // ✅ Внешний контейнер с padding — чтобы бейдж НЕ выходил за границы
    <View style={styles.outer}>
      <View style={styles.wrapper}>
        <View
          style={[
            styles.pin,
            { backgroundColor: colors.bg, borderColor: colors.border },
          ]}
        >
          <Ionicons name={iconName as any} size={16} color={colors.text} />
        </View>

        {hasMultiple && (
          <View style={styles.multiBadge} pointerEvents="none">
            <Text style={styles.multiBadgeText}>+{sportsCount - 1}</Text>
          </View>
        )}

        <View style={[styles.tail, { backgroundColor: colors.border }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // ✅ Внешний контейнер — даёт место для бейджа
  outer: {
    paddingTop: 8,   // место сверху для бейджа
    paddingRight: 8, // место справа для бейджа
    paddingLeft: 2,  // визуальная симметрия
  },
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
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
  multiBadge: {
    position: 'absolute',
    // ✅ Бейдж теперь внутри padding'а — не выходит за границы
    top: -6,
    right: -10,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#208AEF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  multiBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#208AEF',
    lineHeight: 11,
  },
});