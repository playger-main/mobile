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
import Ionicons from "@react-native-vector-icons/ionicons";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";

import { ExtendedGroundItem } from './CardGround';
import GroundMarker from './GroundMarker';
import ClusterMarker from './ClusterMarker';
import ClusterGroundsSheet from './ClusterGroundsSheet';

import {
  $groundActivityLevels,
  $groundEventFlags,
  $useLocation as $useLocationSetting,
  $mapType,
  setMapType,
  $eventFilter,
  $userLocation,
  $cityCenter,
  $mapFocusTarget,
  $clusterSheetVisible,
  $selectedMapGround,   // ✅ NEW
  setClusterSheetVisible as setClusterSheetVisibleEv,
  setMapVisibleBounds,
  setSelectedMapGround,
  requestUserLocationFx,
  checkLocationPermissionFx,
  detectCityFx,
  clearMapFocusTarget,
} from '@/effector/store';
import { GroundMapMarker } from '@/types/map';
import {
  USER_ZOOM_LAT_DELTA,
  USER_ZOOM_LNG_DELTA,
  DEFAULT_CITY_CENTER,
} from '@/constants/location';
import { useTranslation } from '@/i18n';
import { useTheme } from '@/hooks/useTheme';

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

export default function MapComponent({
  region,
  grounds,
  onMarkerPress,
  topOffset = 76,
}: MapComponentProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { theme, colors } = useTheme();
  const activityLevels = useUnit($groundActivityLevels);
  const eventFlags = useUnit($groundEventFlags);
  const eventFilter = useUnit($eventFilter);
  // ✅ настройка «использовать геолокацию»: без неё карта не показывает точку и не просит GPS
  const useLocationSetting = useUnit($useLocationSetting);
  // ✅ стиль карты: обычная / спутник
  const mapType = useUnit($mapType);
  const changeMapType = useUnit(setMapType);
  const userLocation = useUnit($userLocation);
  const cityCenter = useUnit($cityCenter);
  const mapFocusTarget = useUnit($mapFocusTarget);
  const clusterSheetVisible = useUnit($clusterSheetVisible);
  const setClusterSheetVisible = useUnit(setClusterSheetVisibleEv);
  const setMapBounds = useUnit(setMapVisibleBounds);
  const setSelected = useUnit(setSelectedMapGround);
  // ✅ №fix: считываем выбранный маркер для выделения
  const selectedMapGround = useUnit($selectedMapGround);

  const mapRef = useRef<MapView | null>(null);
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  // ✅ Флаг: тап по маркеру → временно игнорируем MapView.onPress
  const markerPressedRef = useRef(false);

  const [clusterGrounds, setClusterGrounds] = useState<GroundMapMarker[]>([]);
  const [currentRegion, setCurrentRegion] = useState<Region>(region);
  const [isLocating, setIsLocating] = useState(false);

  const initialCenteringDoneRef = useRef(false);

  useEffect(() => {
    (async () => {
      try {
        // ✅ Если геолокация выключена в настройках — не просим её сами
        if (!$useLocationSetting.getState()) return;

        const status = await checkLocationPermissionFx();
        if (status === 'denied') {
          Alert.alert(
            t('location.accessTitle'),
            t('location.enableHint'),
            [
              { text: t('location.notNow'), style: 'cancel' },
              {
                text: t('location.openSettings'),
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
      } catch {}
    })();
  }, []);

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

  // ✅ быстрое переключение стиля карты прямо с карты
  const handleToggleMapType = useCallback(() => {
    changeMapType(mapType === 'standard' ? 'hybrid' : 'standard');
  }, [mapType, changeMapType]);

  const handleLocatePress = useCallback(async () => {
    // ✅ если геолокация выключена в настройках — не запрашиваем координаты
    if (!$useLocationSetting.getState()) return;
    setIsLocating(true);
    try {
      const status = await checkLocationPermissionFx();

      if (status === 'denied') {
        Alert.alert(
          t('location.accessTitle'),
          t('location.enableHintShort'),
          [
            { text: t('location.notNow'), style: 'cancel' },
            {
              text: t('location.openSettings'),
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

  const rawMarkers: (GroundMapMarker & { raw: ExtendedGroundItem })[] = useMemo(() => {
    return grounds
      .filter((g) => g.geolocation?.lat && g.geolocation?.lng)
      .map((g) => {
        const activityLevel = activityLevels[g.id] ?? 'none';
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
          sportsCount: sports.length,
          avatar: g.avatar ?? undefined,
          raw: g,
        };
      })
      // ✅ Фильтр по событиям (та же настройка, что и в списке площадок)
      .filter((m) =>
        eventFilter === 'all'
          ? true
          : eventFilter === 'today'
            ? !!eventFlags[m.id]?.today
            : !!(eventFlags[m.id]?.today || eventFlags[m.id]?.upcoming),
      );
  }, [grounds, activityLevels, eventFlags, eventFilter]);

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

  const clusters = useMemo(() => {
    // ✅ P2-fix: supercluster считает zoom от longitudeDelta (а не latitude),
    // а bbox — это половинные дельты вокруг центра. Раньше окно было в 2 раза
    // больше экрана и zoom завышался → фантомные кластеры за пределами карты.
    const zoom = Math.max(
      0,
      Math.min(
        16,
        Math.round(
          Math.log2(360 / Math.max(currentRegion.longitudeDelta, 0.0001)),
        ),
      ),
    );

    const halfLng = currentRegion.longitudeDelta / 2;
    const halfLat = currentRegion.latitudeDelta / 2;

    const bbox: [number, number, number, number] = [
      currentRegion.longitude - halfLng,
      currentRegion.latitude - halfLat,
      currentRegion.longitude + halfLng,
      currentRegion.latitude + halfLat,
    ];

    return supercluster.getClusters(bbox, zoom);
  }, [supercluster, currentRegion]);

  /**
   * ✅ Статус кластера: самый «важный» среди его площадок.
   *    active (есть идущее событие) > upcoming (только предстоящие) > none.
   * Считаем один раз на набор кластеров (не на каждый рендер: выделение
   * маркера перерисовывает карту).
   */
  const clusterLevels = useMemo(() => {
    const levels = new Map<number, 'active' | 'upcoming' | 'none'>();

    for (const feature of clusters as any[]) {
      const props = feature.properties;
      if (!props?.cluster) continue;

      const leaves = supercluster.getLeaves(props.cluster_id, Infinity) as any[];
      let level: 'active' | 'upcoming' | 'none' = 'none';

      for (const leaf of leaves) {
        const leafLevel = leaf?.properties?.marker?.activityLevel;
        if (leafLevel === 'active') {
          level = 'active';
          break;
        }
        if (leafLevel === 'upcoming') level = 'upcoming';
      }

      levels.set(props.cluster_id, level);
    }

    return levels;
  }, [clusters, supercluster]);

  // ✅ №16: тап по маркеру → показать превью
  const handleMarkerPress = useCallback(
    (marker: GroundMapMarker & { raw: ExtendedGroundItem }) => {
      markerPressedRef.current = true;
      setTimeout(() => {
        markerPressedRef.current = false;
      }, 150);

      // ✅ Закрываем список кластера (если открыт)
      setClusterSheetVisible(false);

      if (onMarkerPress) {
        onMarkerPress(marker.raw);
      } else {
        setSelected(marker.raw);
      }
    },
    [onMarkerPress, setSelected, setClusterSheetVisible],
  );

  const handleClusterPress = useCallback(
    (clusterId: number) => {
      // ✅ Флаг: тап по кластеру → временно игнорируем MapView.onPress
      markerPressedRef.current = true;
      setTimeout(() => {
        markerPressedRef.current = false;
      }, 150);

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
          avatar: m.avatar ?? undefined,
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

      let latDelta = maxLat - minLat;
      let lngDelta = maxLng - minLng;

      const aspect = screenHeight / screenWidth;

      if (lngDelta * aspect > latDelta) {
        latDelta = lngDelta * aspect;
      } else {
        lngDelta = latDelta / aspect;
      }

      const PADDING = 1.4;
      latDelta *= PADDING;
      lngDelta *= PADDING;

      const MIN_DELTA = 0.003;
      latDelta = Math.max(latDelta, MIN_DELTA);
      lngDelta = Math.max(lngDelta, MIN_DELTA);

      mapRef.current?.animateToRegion(
        {
          latitude: centerLat,
          longitude: centerLng,
          latitudeDelta: latDelta,
          longitudeDelta: lngDelta,
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

  const handleRegionChangeComplete = useCallback(
    (r: Region) => {
      setCurrentRegion(r);
      setMapBounds({
        north: r.latitude + r.latitudeDelta / 2,
        south: r.latitude - r.latitudeDelta / 2,
        west: r.longitude - r.longitudeDelta / 2,
        east: r.longitude + r.longitudeDelta / 2,
      });
    },
    [setMapBounds],
  );

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_DEFAULT}
        style={styles.map}
        initialRegion={region}
        onRegionChangeComplete={handleRegionChangeComplete}
        mapType={mapType}
        showsUserLocation={useLocationSetting}
        showsMyLocationButton={false}
        toolbarEnabled={false}
        userInterfaceStyle={theme === 'dark' ? 'dark' : 'light'}
        onPress={() => {
          // ✅ если только что был тап по маркеру/кластеру — игнорируем
          if (markerPressedRef.current) return;
          setSelected(null);
          setClusterSheetVisible(false);
        }}
      >
        {clusters.map((feature: any) => {
          const [longitude, latitude] = feature.geometry.coordinates;
          const { cluster, cluster_id, point_count } = feature.properties;

          if (cluster) {
            const level = clusterLevels.get(cluster_id) ?? 'none';

            return (
              <Marker
                // ✅ уровень в key: при смене статуса маркер перемонтируется,
                // иначе Android может не перерисовать рамку при
                // tracksViewChanges={false}
                key={`cluster-${cluster_id}-${level}`}
                coordinate={{ latitude, longitude }}
                onPress={() => handleClusterPress(cluster_id)}
                tracksViewChanges={false}
              >
                <ClusterMarker count={point_count} level={level} />
              </Marker>
            );
          }

          const marker = feature.properties.marker as GroundMapMarker & {
            raw: ExtendedGroundItem;
          };

          // ✅ выбран ли этот маркер
          const isSelected = selectedMapGround?.id === marker.id;

          return (
            <Marker
              key={marker.id}
              coordinate={{ latitude, longitude }}
              onPress={() => handleMarkerPress(marker)}
              // ✅ для выбранного — обновляем вид (чтобы размер/цвет поменялся)
              tracksViewChanges={
                (marker.sportsCount ?? 1) > 1 || isSelected
              }
              // ✅ выбранный — поверх остальных
              zIndex={isSelected ? 100 : 1}
            >
              <GroundMarker
                level={marker.activityLevel}
                sportId={marker.sportId}
                sportsCount={marker.sportsCount}
                selected={isSelected}
              />
            </Marker>
          );
        })}
      </MapView>

      <Pressable
        style={({ pressed }) => [
          styles.locateButton,
          {
            top: useLocationSetting ? topOffset + 56 : topOffset,
            opacity: pressed ? 0.7 : 1,
            backgroundColor: colors.surface,
            shadowColor: colors.shadow,
          },
        ]}
        onPress={handleToggleMapType}
        accessibilityRole="button"
        accessibilityLabel={t('settings.mapType')}
      >
        <MaterialDesignIcons name="layers-outline" size={22} color={colors.primary} />
      </Pressable>

      {useLocationSetting && (
      <Pressable
        style={({ pressed }) => [
          styles.locateButton,
          {
            top: topOffset,
            opacity: pressed ? 0.7 : 1,
            backgroundColor: colors.surface,
            shadowColor: colors.shadow,
          },
        ]}
        onPress={handleLocatePress}
        disabled={isLocating}
        accessibilityRole="button"
        accessibilityLabel={t('common.myLocation')}
        accessibilityState={{ disabled: isLocating, busy: isLocating }}
      >
        <Ionicons
          name={isLocating ? 'hourglass-outline' : 'locate'}
          size={22}
          color={colors.primary}
        />
      </Pressable>
      )}

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
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    zIndex: 10,
  },
});