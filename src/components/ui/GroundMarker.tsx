// src/components/ui/GroundMarker.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ACTIVITY_COLORS, GroundActivityLevel } from '@/utils/groundActivity';
import { getSportIcon } from '@/constants/sports';
import { useTheme } from '@/hooks/useTheme';

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
  const { colors } = useTheme();
  const activityColors = ACTIVITY_COLORS[level];
  const iconName = getSportIcon(sportId);
  const hasMultiple = sportsCount > 1;

  return (
    <View style={styles.outer}>
      <View style={styles.wrapper}>
        <View
          style={[
            styles.pin,
            {
              backgroundColor: activityColors.bg,
              borderColor: activityColors.border,
              shadowColor: colors.shadow,
            },
          ]}
        >
          <Ionicons name={iconName as any} size={16} color={activityColors.text} />
        </View>

        {hasMultiple && (
          <View
            style={[
              styles.multiBadge,
              {
                backgroundColor: colors.surface,
                borderColor: colors.primary,
                shadowColor: colors.shadow,
              },
            ]}
            pointerEvents="none"
          >
            <Text
              style={[styles.multiBadgeText, { color: colors.primary }]}
            >
              +{sportsCount - 1}
            </Text>
          </View>
        )}

        <View
          style={[styles.tail, { backgroundColor: activityColors.border }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    paddingTop: 8,
    paddingRight: 8,
    paddingLeft: 2,
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
    top: -6,
    right: -10,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  multiBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    lineHeight: 11,
  },
});