import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { GroundItem } from './MapComponent';

interface MapComponentProps {
  region: any;
  grounds: GroundItem[];
}

export default function MapComponentWeb({ grounds }: MapComponentProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        [ Карта для Web-версии: подключите Leaflet или Google Maps API. Найдено площадок: {grounds.length} ]
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 300,
    backgroundColor: '#EEF2F6',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D0DBEA',
    borderStyle: 'dashed',
  },
  text: { color: '#6080A8', fontSize: 14, textAlign: 'center', padding: 16 }
});
