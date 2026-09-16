import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

// Описываем структуру данных для спортивной площадки
export interface GroundItem {
  id: string;
  title: string;
  description?: string;
  latitude: number;
  longitude: number;
}

interface MapComponentProps {
  region: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  grounds: GroundItem[];
  onMarkerPress?: (ground: GroundItem) => void;
}

export default function MapComponent({ region, grounds, onMarkerPress }: MapComponentProps) {
  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        showsUserLocation={true}
        showsMyLocationButton={true}
        toolbarEnabled={false}
      >
        {/* Рендерим переданный массив спортивных площадок в виде маркеров */}
        {grounds.map((ground) => (
          <Marker
            key={ground.id}
            coordinate={{ latitude: ground.latitude, longitude: ground.longitude }}
            title={ground.title}
            description={ground.description}
            onPress={() => onMarkerPress?.(ground)}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
