// src/components/ui/MapComponent.web.tsx
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { ExtendedGroundItem } from './CardGround';
import MapLegend from './MapLegend';
import { useTranslation } from '@/i18n';
import { useTheme } from '@/hooks/useTheme';

/**
 * ✅ P2: интерфейс совпадает с нативным MapComponent, чтобы экраны
 * не расходились по типам между платформами.
 */
interface MapComponentProps {
  region: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  grounds: ExtendedGroundItem[];
  onMarkerPress?: (ground: ExtendedGroundItem) => void;
  topOffset?: number;
}

export default function MapComponentWeb({ grounds }: MapComponentProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.placeholder,
          {
            backgroundColor: colors.surfaceSecondary,
            borderColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.text, { color: colors.textSecondary }]}>
          {t('map.webPlaceholder', { count: grounds.length })}
        </Text>
      </View>

      <View style={styles.legendWrapper}>
        <MapLegend />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 300,
    position: 'relative',
  },
  placeholder: {
    flex: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  text: {
    fontSize: 14,
    textAlign: 'center',
    padding: 16,
  },
  legendWrapper: {
    position: 'absolute',
    left: 12,
    bottom: 12,
    zIndex: 5,
  },
});
