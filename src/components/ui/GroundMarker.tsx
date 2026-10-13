// src/components/ui/GroundMarker.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { ACTIVITY_COLORS, GroundActivityLevel } from '@/utils/groundActivity';
import { getSportIcon } from '@/constants/sports';
import { useTheme } from '@/hooks/useTheme';

interface GroundMarkerProps {
  level: GroundActivityLevel;
  sportId: string;
  sportsCount?: number;
  selected?: boolean;   // ✅ NEW
}

export default function GroundMarker({
  level,
  sportId,
  sportsCount = 1,
  selected = false,
}: GroundMarkerProps) {
  const { colors } = useTheme();
  const activityColors = ACTIVITY_COLORS[level];
  const iconName = getSportIcon(sportId);
  const hasMultiple = sportsCount > 1;

  // ✅ если выбран — accent-цвет, увеличенный
  const pinBg = selected ? colors.accent : activityColors.bg;
  const pinBorder = selected ? colors.accent : activityColors.border;
  const pinSize = selected ? 40 : 32;
  const iconSize = selected ? 20 : 16;

  return (
    <View style={styles.outer}>
      <View style={styles.wrapper}>
        <View
          style={[
            styles.pin,
            {
              width: pinSize,
              height: pinSize,
              borderRadius: pinSize / 2,
              backgroundColor: pinBg,
              borderColor: pinBorder,
              borderWidth: selected ? 3 : 2,
              shadowColor: selected ? colors.accent : colors.shadow,
              shadowOpacity: selected ? 0.4 : 0.25,
              elevation: selected ? 8 : 4,
            },
          ]}
        >
          <MaterialDesignIcons
            name={iconName as any}
            size={iconSize}
            color={selected ? '#FFFFFF' : activityColors.text}
          />
        </View>

        {hasMultiple && (
          <View
            style={[
              styles.multiBadge,
              {
                backgroundColor: colors.surface,
                borderColor: selected ? colors.accent : colors.primary,
                shadowColor: colors.shadow,
              },
            ]}
            pointerEvents="none"
          >
            <Text
              style={[
                styles.multiBadgeText,
                { color: selected ? colors.accent : colors.primary },
              ]}
            >
              +{sportsCount - 1}
            </Text>
          </View>
        )}

        <View
          style={[
            styles.tail,
            {
              backgroundColor: selected ? colors.accent : activityColors.border,
              height: selected ? 10 : 8,
              width: selected ? 3 : 2,
            },
          ]}
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
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  tail: {
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
