// src/components/ui/MapComponent.web.tsx
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { ExtendedGroundItem } from './CardGround';
import MapLegend from './MapLegend';
import { useTheme } from '@/hooks/useTheme';

interface MapComponentProps {
  region: any;
  grounds: ExtendedGroundItem[];
}

export default function MapComponentWeb({ grounds }: MapComponentProps) {
  const { colors } = useTheme();

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
          [ Карта для Web-версии: подключите Leaflet или Google Maps API.{'\n'}
          Найдено площадок: {grounds.length} ]
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