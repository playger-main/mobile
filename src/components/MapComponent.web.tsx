import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { GroundItem } from './MapComponent'; // Импортируем интерфейс из основного файла

interface MapComponentProps {
  region: {
    latitude: number;
    longitude: number;
  };
  grounds: GroundItem[];
  onMarkerPress?: (ground: GroundItem) => void;
}

export default function MapComponent({ region, grounds }: MapComponentProps) {
  return (
    <View style={styles.container}>
      <View style={styles.webMapPlaceholder}>
        <Text style={styles.title}>🗺️ Нативная карта (Режим Web)</Text>
        <Text style={styles.subtitle}>
          Координаты центра: {region.latitude.toFixed(4)}, {region.longitude.toFixed(4)}
        </Text>
        <Text style={styles.info}>
          Найдено площадок в этой зоне: {grounds.length}
        </Text>
        <View style={styles.list}>
          {grounds.map(g => (
            <Text key={g.id} style={styles.listItem}>📍 {g.title}</Text>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  webMapPlaceholder: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    maxWidth: 400,
    width: '100%',
  },
  title: { fontSize: 18, fontWeight: 'bold', color: '#334A77', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 13, color: '#6080A8', marginBottom: 12, textAlign: 'center' },
  info: { fontSize: 14, fontWeight: '600', color: '#208AEF', marginBottom: 8 },
  list: { borderTopWidth: 1, borderTopColor: '#E6F4FE', paddingTop: 8 },
  listItem: { fontSize: 14, color: '#4A5568', marginVertical: 4 },
});
