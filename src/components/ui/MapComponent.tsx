// src/components/ui/MapComponent.tsx
import React, { useState, useMemo, useRef, useCallback } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import MapView, { PROVIDER_DEFAULT, Marker, Region } from 'react-native-maps';
import Supercluster from 'supercluster';
import { useRouter } from 'expo-router';
import { useUnit } from 'effector-react';

import { ExtendedGroundItem } from './CardGround';
import GroundMarker from './GroundMarker';
import ClusterMarker from './ClusterMarker';
import MapLegend from './MapLegend';
import ClusterGroundsSheet from './ClusterGroundsSheet';

import { $events } from '@/effector/store';
import { getGroundActivityLevel } from '@/utils/groundActivity';
import { GroundMapMarker } from '@/types/map';

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

interface ClusterPoint {
  type: 'Feature';
  properties: {
    cluster: false;
    markerId: string;
    marker: GroundMapMarker & { raw: ExtendedGroundItem };
  };
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
}

/**
 * ✅ Рекурсивно находит максимальный зум, при котором кластер полностью
 * разбивается на одиночные точки (включая вложенные кластеры).
 */
const getFullExpansionZoom = (
  index: Supercluster,
  clusterId: number,
): number => {
  // Базовый зум разбиения этого кластера
  let zoom = index.getClusterExpansionZoom(clusterId);

  // Смотрим детей этого кластера
  const children = index.getChildren(clusterId) as any[];

  for (const child of children) {
    // Если ребёнок — вложенный кластер, рекурсивно ищем его зум
    if (child.properties?.cluster) {
      const deeperZoom = getFullExpansionZoom(
        index,
        child.properties.cluster_id,
      );
      if (deeperZoom > zoom) {
        zoom = deeperZoom;
      }
    }
  }

  return zoom;
};

/**
 * ✅ Конвертирует зум (уровень) в deltas для animateToRegion.
 * Стандартная формула Web Mercator для мобильных карт.
 */
const zoomToRegionDeltas = (
  zoom: number,
  latitude: number,
  screenWidth: number,
  screenHeight: number,
): { latitudeDelta: number; longitudeDelta: number } => {
  // 360° делим на 2^zoom — это видимая долгота на весь экран
  const longitudeDelta = 360 / Math.pow(2, zoom);
  // Широта зависит от текущей параллели
  const latitudeDelta =
    longitudeDelta * (screenHeight / screenWidth) *
    Math.max(Math.cos((latitude * Math.PI) / 180), 0.1);

  return { latitudeDelta, longitudeDelta };
};

export default function MapComponent({
  region,
  grounds,
  onMarkerPress,
}: MapComponentProps) {
  const router = useRouter();
  const events = useUnit($events);
  const mapRef = useRef<MapView | null>(null);
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const [clusterSheetVisible, setClusterSheetVisible] = useState(false);
  const [clusterGrounds, setClusterGrounds] = useState<GroundMapMarker[]>([]);
  const [currentRegion, setCurrentRegion] = useState<Region>(region);

  // 1. Готовим "сырые" маркеры
  const rawMarkers: (GroundMapMarker & { raw: ExtendedGroundItem })[] = useMemo(() => {
    return grounds
      .filter((g) => g.geolocation?.lat && g.geolocation?.lng)
      .map((g) => {
        const groundEvents = events.filter((e) => e.ground?.id === g.id);
        const activityLevel = getGroundActivityLevel(groundEvents);
        const sportId =
          g.kindofsport && g.kindofsport.length > 0 ? g.kindofsport[0] : 'Sport';

        return {
          id: g.id,
          name: g.name,
          latitude: Number(g.geolocation!.lat),
          longitude: Number(g.geolocation!.lng),
          address: g.address || undefined,
          activityLevel,
          sportId,
          avatar: g.avatar,   
          raw: g,
        };
      });
  }, [grounds, events]);

  // 2. Supercluster
  const supercluster = useMemo(() => {
    const index = new Supercluster({
      radius: 60,
      maxZoom: 16,
      minPoints: 2,
    });

    const points: ClusterPoint[] = rawMarkers.map((m) => ({
      type: 'Feature',
      properties: {
        cluster: false,
        markerId: m.id,
        marker: m,
      },
      geometry: {
        type: 'Point',
        coordinates: [m.longitude, m.latitude],
      },
    }));

    index.load(points);
    return index;
  }, [rawMarkers]);

  // 3. Кластеры для текущего региона
  const clusters = useMemo(() => {
    const zoom = Math.round(
      Math.log2(360 / Math.max(currentRegion.latitudeDelta, 0.0001)),
    );
    const bbox: [number, number, number, number] = [
      currentRegion.longitude - currentRegion.longitudeDelta,
      currentRegion.latitude - currentRegion.latitudeDelta,
      currentRegion.longitude + currentRegion.longitudeDelta,
      currentRegion.latitude + currentRegion.latitudeDelta,
    ];

    return supercluster.getClusters(bbox, zoom);
  }, [supercluster, currentRegion]);

  // 4. Клик по одиночному маркеру
  const handleMarkerPress = useCallback(
    (marker: GroundMapMarker & { raw: ExtendedGroundItem }) => {
      if (onMarkerPress) {
        onMarkerPress(marker.raw);
      } else {
        router.push(`/ground/${marker.id}`);
      }
    },
    [onMarkerPress, router],
  );

  // 5. ✅ Клик по кластеру: рекурсивный зум до полного раскрытия + список
  const handleClusterPress = useCallback(
    (clusterId: number) => {
      const leaves = supercluster.getLeaves(clusterId, Infinity) as ClusterPoint[];

      const items: GroundMapMarker[] = leaves
        .map((l) => l.properties?.marker)
        .filter(Boolean)
        .map((m) => ({
          id: m.id,
          name: m.name,
          latitude: m.latitude,
          longitude: m.longitude,
          activityLevel: m.activityLevel,
          sportId: m.sportId,
          address: m.address,
          avatar: m.avatar, 
        }));

      if (items.length === 0) return;

      // Одиночный leaf — сразу открываем
      if (items.length === 1) {
        const raw = leaves[0].properties.marker.raw;
        handleMarkerPress({ ...items[0], raw } as any);
        return;
      }

      // Центр кластера
      const lats = items.map((m) => m.latitude);
      const lngs = items.map((m) => m.longitude);
      const minLat = Math.min(...lats);
      const maxLat = Math.max(...lats);
      const minLng = Math.min(...lngs);
      const maxLng = Math.max(...lngs);

      const centerLat = (minLat + maxLat) / 2;
      const centerLng = (minLng + maxLng) / 2;

      // ✅ Рекурсивно ищем максимальный зум, при котором все точки разбиваются
      const expansionZoom = getFullExpansionZoom(supercluster, clusterId);

      // ✅ +1 для запаса, чтобы точки не склеились на границе
      // и ограничиваем maxZoom, чтобы не улететь в космос
      const targetZoom = Math.min(expansionZoom + 1, 18);

      // Конвертируем в deltas
      const { latitudeDelta, longitudeDelta } = zoomToRegionDeltas(
        targetZoom,
        centerLat,
        screenWidth,
        screenHeight,
      );

      // Плавный зум к центру с нужным масштабом
      mapRef.current?.animateToRegion(
        {
          latitude: centerLat,
          longitude: centerLng,
          latitudeDelta,
          longitudeDelta,
        },
        600,
      );

      // Открываем список
      setClusterGrounds(items);
      setClusterSheetVisible(true);
    },
    [supercluster, handleMarkerPress, screenWidth, screenHeight],
  );

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_DEFAULT}
        style={styles.map}
        initialRegion={region}
        onRegionChangeComplete={(r) => setCurrentRegion(r)}
        showsUserLocation={true}
        showsMyLocationButton={true}
        toolbarEnabled={false}
      >
        {clusters.map((feature: any) => {
          const [longitude, latitude] = feature.geometry.coordinates;
          const { cluster, cluster_id, point_count } = feature.properties;

          if (cluster) {
            return (
              <Marker
                key={`cluster-${cluster_id}`}
                coordinate={{ latitude, longitude }}
                onPress={() => handleClusterPress(cluster_id)}
                tracksViewChanges={false}
              >
                <ClusterMarker count={point_count} />
              </Marker>
            );
          }

          const marker = feature.properties.marker as GroundMapMarker & {
            raw: ExtendedGroundItem;
          };

          return (
            <Marker
              key={marker.id}
              coordinate={{ latitude, longitude }}
              onPress={() => handleMarkerPress(marker)}
              tracksViewChanges={false}
            >
              <GroundMarker level={marker.activityLevel} sportId={marker.sportId} />
            </Marker>
          );
        })}
      </MapView>

      <View style={styles.legendWrapper} pointerEvents="box-none">
        <MapLegend />
      </View>

      <ClusterGroundsSheet
        visible={clusterSheetVisible}
        grounds={clusterGrounds}
        onClose={() => setClusterSheetVisible(false)}
        onSelect={(g) => {
          setClusterSheetVisible(false);
          router.push(`/ground/${g.id}`);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: '100%', height: '100%' },
  legendWrapper: {
    position: 'absolute',
    left: 16,
    bottom: 24,
    zIndex: 5,
  },
});