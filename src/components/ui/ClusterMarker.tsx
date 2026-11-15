// src/components/ui/ClusterMarker.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  ACTIVITY_COLORS,
  GroundActivityLevel,
} from '@/utils/groundActivity';
import { useTheme } from '@/hooks/useTheme';

interface ClusterMarkerProps {
  count: number;
  /**
   * ✅ Самый «важный» статус среди площадок кластера:
   *   active   — есть площадка с идущим событием → зелёная рамка;
   *   upcoming — только предстоящие события       → оранжевая рамка;
   *   none     — событий нет                      → синяя рамка (как раньше).
   */
  level?: GroundActivityLevel;
}

export default function ClusterMarker({
  count,
  level = 'none',
}: ClusterMarkerProps) {
  const { colors } = useTheme();

  // Размер кластера зависит от количества
  const size = count < 10 ? 40 : count < 100 ? 48 : 56;
  // ✅ Рамка тем же цветом, что и заливка маркеров с событиями
  //    (зелёный / оранжевый), чтобы связь читалась без подписей.
  const borderColor =
    level === 'none' ? colors.primaryDark : ACTIVITY_COLORS[level].bg;

  return (
    <View
      style={[
        styles.cluster,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: colors.primary,
          borderColor,
          shadowColor: colors.shadow,
        },
      ]}
      accessibilityLabel={`${count}${level !== 'none' ? ` · ${level}` : ''}`}
    >
      <Text style={styles.clusterText}>{count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  cluster: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  clusterText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
