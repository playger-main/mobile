import { StyleSheet, Text, View } from "react-native";
import { GroundItem } from "./MapComponent"; // Импортируем интерфейс из основного файла

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
          Координаты центра: {region.latitude.toFixed(4)},{" "}
          {region.longitude.toFixed(4)}
        </Text>
        <Text style={styles.info}>
          Найдено площадок в этой зоне: {grounds.length}
        </Text>
        <View style={styles.list}>
          {grounds.map((g) => (
            <Text key={g.id} style={styles.listItem}>
              📍 {g.title}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
}

// Полностью замените объект styles в самом низу файла src/components/MapComponent.web.tsx:
const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#F0F4F8',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  webMapPlaceholder: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    width: '100%',
  },
  title: { fontSize: 16, fontWeight: 'bold', color: '#334A77', marginBottom: 4, textAlign: 'center' },
  subtitle: { fontSize: 12, color: '#6080A8', marginBottom: 8, textAlign: 'center' },
  info: { fontSize: 13, fontWeight: '600', color: '#208AEF', marginBottom: 6 },
  list: { borderTopWidth: 1, borderTopColor: '#E6F4FE', paddingTop: 6 },
  listItem: { fontSize: 13, color: '#4A5568', marginVertical: 2 },
});
