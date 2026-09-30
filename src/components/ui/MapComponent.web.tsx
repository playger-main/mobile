// src/components/ui/MapComponent.web.tsx
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { ExtendedGroundItem } from './CardGround';
import MapLegend from './MapLegend';

interface MapComponentProps {
  region: any;
  grounds: ExtendedGroundItem[];
}

export default function MapComponentWeb({ grounds }: MapComponentProps) {
  return (
    <View style={styles.container}>
      <View style={styles.placeholder}>
        <Text style={styles.text}>
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
    backgroundColor: '#EEF2F6',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D0DBEA',
    borderStyle: 'dashed',
  },
  text: {
    color: '#6080A8',
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
