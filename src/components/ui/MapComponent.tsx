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
  topOffset = 76,
}: MapComponentProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { theme, colors } = useTheme();
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

  const initialCenteringDoneRef = useRef(false);

  useEffect(() => {
    (async () => {
      try {
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

  const handleLocatePress = useCallback(async () => {
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
          sportsCount: sports.length,
          avatar: g.avatar ?? undefined,
          raw: g,
        };
      });
  }, [grounds, events]);

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
        userInterfaceStyle={theme === 'dark' ? 'dark' : 'light'}
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
          {
            top: topOffset,
            opacity: pressed ? 0.7 : 1,
            backgroundColor: colors.surface,
            shadowColor: colors.shadow,
          },
        ]}
        onPress={handleLocatePress}
        disabled={isLocating}
      >
        <Ionicons
          name={isLocating ? 'hourglass-outline' : 'locate'}
          size={22}
          color={colors.primary}
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