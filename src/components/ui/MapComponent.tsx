import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, PROVIDER_DEFAULT } from 'react-native-maps';
import { ExtendedGroundItem } from './CardGround';

interface MapComponentProps {
  region: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  grounds: ExtendedGroundItem[];
  onMarkerPress?: (ground: ExtendedGroundItem) => void;
}

export default function MapComponent({ region, grounds, onMarkerPress }: MapComponentProps) {
  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_DEFAULT}
        style={styles.map}
        initialRegion={region} // Используем initialRegion во избежание сброса камеры при вводе в поиск
        showsUserLocation={true}
        showsMyLocationButton={true}
        toolbarEnabled={false}
      >
        {grounds.map((ground) => {
          // Защитная проверка: если на сервере кривые координаты или null — не рендерим маркер
          if (!ground.geolocation?.lat || !ground.geolocation?.lng) return null;

          return (
            <Marker
              key={ground.id}
              // Безопасно парсим строковые координаты из JSON NestJS в числа для карт
              coordinate={{ 
                latitude: Number(ground.geolocation.lat), 
                longitude: Number(ground.geolocation.lng) 
              }}
              title={ground.name}
              description={ground.description || undefined}
              onPress={() => onMarkerPress?.(ground)}
            />
          );
        })}
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
