// src/components/ui/MapComponent.tsx
import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import {
  StyleSheet,
  View,
  useWindowDimensions,
  Pressable,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import MapView, { PROVIDER_DEFAULT, Marker, Region } from 'react-native-maps';
import Supercluster from 'supercluster';
import { useRouter } from 'expo-router';
import { useUnit } from 'effector-react';
import { Ionicons } from '@expo/vector-icons';

import { ExtendedGroundItem } from './CardGround';
import GroundMarker from './GroundMarker';
import ClusterMarker from './ClusterMarker';
import ClusterGroundsSheet from './ClusterGroundsSheet';

import {
  $events,
  $userLocation,
  $cityCenter,
  $mapFocusTarget,
  $clusterSheetVisible,
  setClusterSheetVisible as setClusterSheetVisibleEv,
  requestUserLocationFx,
  checkLocationPermissionFx,
  detectCityFx,
  clearMapFocusTarget,
} from '@/effector/store';
import { getGroundActivityLevel } from '@/utils/groundActivity';
import { GroundMapMarker } from '@/types/map';
import {
  USER_ZOOM_LAT_DELTA,
  USER_ZOOM_LNG_DELTA,
  DEFAULT_CITY_CENTER,
} from '@/constants/location';

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
 * Рекурсивно находит максимальный зум, при котором кластер полностью
 * разбивается на одиночные точки (включая вложенные кластеры).
 */
const getFullExpansionZoom = (
  index: Supercluster,
  clusterId: number,
): number => {
  let zoom = index.getClusterExpansionZoom(clusterId);
  const children = index.getChildren(clusterId) as any[];

  for (const child of children) {
    if (child.properties?.cluster) {
      const deeperZoom = getFullExpansionZoom(
        index,
        child.properties.cluster_id,
      );
      if (deeperZoom > zoom) zoom = deeperZoom;
    }
  }

  return zoom;
};

/**
 * Конвертирует зум (уровень) в deltas для animateToRegion.
 */
const zoomToRegionDeltas = (
  zoom: number,
  latitude: number,
  screenWidth: number,
  screenHeight: number,
): { latitudeDelta: number; longitudeDelta: number } => {
  const longitudeDelta = 360 / Math.pow(2, zoom);
  const latitudeDelta =
    longitudeDelta *
    (screenHeight / screenWidth) *
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
  const userLocation = useUnit($userLocation);
  const cityCenter = useUnit($cityCenter);
  const mapFocusTarget = useUnit($mapFocusTarget);
  const clusterSheetVisible = useUnit($clusterSheetVisible);
  const setClusterSheetVisible = useUnit(setClusterSheetVisibleEv);

  const mapRef = useRef<MapView | null>(null);
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const [clusterGrounds, setClusterGrounds] = useState<GroundMapMarker[]>([]);
  const [currentRegion, setCurrentRegion] = useState<Region>(region);
  const [isLocating, setIsLocating] = useState(false);

  // ✅ Флаг: стартовое центрирование уже сделано
  const initialCenteringDoneRef = useRef(false);

  // ✅ Автозапрос локации при монтировании + обработка denied
  useEffect(() => {
    (async () => {
      try {
        const status = await checkLocationPermissionFx();

        if (status === 'denied') {
          Alert.alert(
            'Location Access',
            'PlayG works best with your location to show nearby grounds and events. Enable it in Settings?',
            [
              { text: 'Not now', style: 'cancel' },
              {
                text: 'Open Settings',
                onPress: () => {
                  if (Platform.OS === 'ios') {
                    Linking.openURL('app-settings:');
                  } else {
                    Linking.openSettings();
                  }
                },
              },
            ],
          );
          return;
        }

        const result = await requestUserLocationFx();
        if (result?.location) {
          detectCityFx(result.location);
        }
      } catch {
        // Игнорируем
      }
    })();
  }, []);

  // ✅ Стартовое центрирование: userLocation → cityCenter
  useEffect(() => {
    if (initialCenteringDoneRef.current) return;

    const target = userLocation ?? null;

    if (target) {
      initialCenteringDoneRef.current = true;

      const timer = setTimeout(() => {
        mapRef.current?.animateToRegion(
          {
            latitude: target.latitude,
            longitude: target.longitude,
            latitudeDelta: USER_ZOOM_LAT_DELTA,
            longitudeDelta: USER_ZOOM_LNG_DELTA,
          },
          600,
        );
      }, 300);

      return () => clearTimeout(timer);
    }

    // Fallback через 2 секунды, если userLocation не появился
    const fallbackTimer = setTimeout(() => {
      if (initialCenteringDoneRef.current) return;
      if (!userLocation && cityCenter) {
        initialCenteringDoneRef.current = true;
        mapRef.current?.animateToRegion(
          {
            latitude: cityCenter.latitude,
            longitude: cityCenter.longitude,
            latitudeDelta: USER_ZOOM_LAT_DELTA,
            longitudeDelta: USER_ZOOM_LNG_DELTA,
          },
          600,
        );
      }
    }, 2000);

    return () => clearTimeout(fallbackTimer);
  }, [userLocation, cityCenter]);

  // ✅ Реакция на запрос фокуса (переход с другого экрана)
  useEffect(() => {
    if (!mapFocusTarget) return;

    const zoom = mapFocusTarget.zoom ?? 0.005;

    const timer = setTimeout(() => {
      mapRef.current?.animateToRegion(
        {
          latitude: mapFocusTarget.latitude,
          longitude: mapFocusTarget.longitude,
          latitudeDelta: zoom,
          longitudeDelta: zoom,
        },
        600,
      );

      setTimeout(() => clearMapFocusTarget(), 700);
    }, 100);

    return () => clearTimeout(timer);
  }, [mapFocusTarget]);

  // ✅ Центрирование по кнопке
  const handleLocatePress = useCallback(async () => {
    setIsLocating(true);
    try {
      const status = await checkLocationPermissionFx();

      if (status === 'denied') {
        Alert.alert(
          'Location Access',
          'Enable location to center the map on your position.',
          [
            { text: 'Not now', style: 'cancel' },
            {
              text: 'Open Settings',
              onPress: () => {
                if (Platform.OS === 'ios') {
                  Linking.openURL('app-settings:');
                } else {
                  Linking.openSettings();
                }
              },
            },
          ],
        );
        return;
      }

      const result = await requestUserLocationFx();
      let target = cityCenter ?? DEFAULT_CITY_CENTER;

      if (result?.location) {
        target = result.location;
        detectCityFx(result.location);
      }

      mapRef.current?.animateToRegion(
        {
          latitude: target.latitude,
          longitude: target.longitude,
          latitudeDelta: USER_ZOOM_LAT_DELTA,
          longitudeDelta: USER_ZOOM_LNG_DELTA,
        },
        600,
      );
    } catch {
      const target = cityCenter ?? DEFAULT_CITY_CENTER;
      mapRef.current?.animateToRegion(
        {
          latitude: target.latitude,
          longitude: target.longitude,
          latitudeDelta: USER_ZOOM_LAT_DELTA,
          longitudeDelta: USER_ZOOM_LNG_DELTA,
        },
        600,
      );
    } finally {
      setIsLocating(false);
    }
  }, [cityCenter]);

  // 1. Готовим "сырые" маркеры
  const rawMarkers: (GroundMapMarker & { raw: ExtendedGroundItem })[] = useMemo(() => {
    return grounds
      .filter((g) => g.geolocation?.lat && g.geolocation?.lng)
      .map((g) => {
        const groundEvents = events.filter((e) => e.ground?.id === g.id);
        const activityLevel = getGroundActivityLevel(groundEvents);
        const sports = Array.isArray(g.kindofsport) ? g.kindofsport : [];
        const sportId = sports.length > 0 ? sports[0] : 'Sport';

        return {
          id: g.id,
          name: g.name,
          latitude: Number(g.geolocation!.lat),
          longitude: Number(g.geolocation!.lng),
          address: g.address || undefined,
          activityLevel,
          sportId,
          sportsCount: sports.length,   // ✅ количество спортов
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

  // 5. Клик по кластеру: рекурсивный зум + список
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
          sportsCount: m.sportsCount,
          address: m.address,
          avatar: m.avatar,
        }));

      if (items.length === 0) return;

      if (items.length === 1) {
        const raw = leaves[0].properties.marker.raw;
        handleMarkerPress({ ...items[0], raw } as any);
        return;
      }

      const lats = items.map((m) => m.latitude);
      const lngs = items.map((m) => m.longitude);
      const minLat = Math.min(...lats);
      const maxLat = Math.max(...lats);
      const minLng = Math.min(...lngs);
      const maxLng = Math.max(...lngs);

      const centerLat = (minLat + maxLat) / 2;
      const centerLng = (minLng + maxLng) / 2;

      const expansionZoom = getFullExpansionZoom(supercluster, clusterId);
      const targetZoom = Math.min(expansionZoom + 1, 18);

      const { latitudeDelta, longitudeDelta } = zoomToRegionDeltas(
        targetZoom,
        centerLat,
        screenWidth,
        screenHeight,
      );

      mapRef.current?.animateToRegion(
        {
          latitude: centerLat,
          longitude: centerLng,
          latitudeDelta,
          longitudeDelta,
        },
        600,
      );

      setClusterGrounds(items);
      setClusterSheetVisible(true);
    },
    [supercluster, handleMarkerPress, screenWidth, screenHeight, setClusterSheetVisible],
  );

  const handleClusterSheetClose = useCallback(() => {
    setClusterSheetVisible(false);
  }, [setClusterSheetVisible]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_DEFAULT}
        style={styles.map}
        initialRegion={region}
        onRegionChangeComplete={(r) => setCurrentRegion(r)}
        showsUserLocation={true}
        showsMyLocationButton={false}
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
              // ✅ Для мультиспорта включаем перерисовку — иначе бейдж "+N" не появится на Android
              tracksViewChanges={(marker.sportsCount ?? 1) > 1}
            >
              <GroundMarker
                level={marker.activityLevel}
                sportId={marker.sportId}
                sportsCount={marker.sportsCount}
              />
            </Marker>
          );
        })}
      </MapView>

      <Pressable
        style={({ pressed }) => [
          styles.locateButton,
          { opacity: pressed ? 0.7 : 1 },
        ]}
        onPress={handleLocatePress}
        disabled={isLocating}
      >
        <Ionicons
          name={isLocating ? 'hourglass-outline' : 'locate'}
          size={22}
          color="#208AEF"
        />
      </Pressable>

      <ClusterGroundsSheet
        visible={clusterSheetVisible}
        grounds={clusterGrounds}
        onClose={handleClusterSheetClose}
        onSelect={(g) => {
          handleClusterSheetClose();
          router.push(`/ground/${g.id}`);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: '100%', height: '100%' },
  locateButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#334A77',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    zIndex: 10,
  },
});