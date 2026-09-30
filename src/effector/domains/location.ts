// src/effector/domains/location.ts
import { createDomain, createEffect } from 'effector';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  setUserLocation,
  setLocationPermission,
  clearUserLocation,
  setMapFocusTarget,
  clearMapFocusTarget,
  setClusterSheetVisible,
} from '../events/sync';
import { DEFAULT_CITY_CENTER, getCityCenter } from '@/constants/location';

const locationDomain = createDomain('location');

const CITY_CACHE_KEY = 'pg_current_city';

interface CityInfo {
  city: string | null;
  country: string | null;
  center: { latitude: number; longitude: number };
}

/**
 * Проверяет текущий статус разрешения БЕЗ вызова системного диалога.
 */
export const checkLocationPermissionFx = createEffect(async () => {
  const { status } = await Location.getForegroundPermissionsAsync();
  return status as 'granted' | 'denied' | 'undetermined';
});

/**
 * Запрашивает разрешение и, если granted, возвращает координаты.
 */
export const requestUserLocationFx = createEffect(async () => {
  const { status: currentStatus } = await Location.getForegroundPermissionsAsync();

  if (currentStatus === 'denied') {
    return { status: 'denied' as const, location: null };
  }

  if (currentStatus === 'undetermined') {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return { status: 'denied' as const, location: null };
    }
  }

  try {
    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    return {
      status: 'granted' as const,
      location: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
    };
  } catch {
    return { status: 'denied' as const, location: null };
  }
});

/**
 * Определяет город по координатам + его центр.
 */
export const detectCityFx = createEffect(
  async (coords: { latitude: number; longitude: number }): Promise<CityInfo> => {
    try {
      const cached = await AsyncStorage.getItem(CITY_CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached) as CityInfo;
        const R = 6371000;
        const dLat = ((coords.latitude - parsed.center.latitude) * Math.PI) / 180;
        const dLng = ((coords.longitude - parsed.center.longitude) * Math.PI) / 180;
        const a =
          Math.sin(dLat / 2) ** 2 +
          Math.cos((coords.latitude * Math.PI) / 180) *
            Math.cos((parsed.center.latitude * Math.PI) / 180) *
            Math.sin(dLng / 2) ** 2;
        const distance = 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        if (distance < 30000) return parsed;
      }

      const addresses = await Location.reverseGeocodeAsync({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });

      const first = addresses?.[0];
      const cityName = first?.city || first?.subregion || first?.region || null;
      const countryName = first?.country || null;
      const knownCenter = getCityCenter(cityName);

      const result: CityInfo = {
        city: cityName,
        country: countryName,
        center: knownCenter ?? {
          latitude: coords.latitude,
          longitude: coords.longitude,
        },
      };

      await AsyncStorage.setItem(CITY_CACHE_KEY, JSON.stringify(result));
      return result;
    } catch {
      return { city: null, country: null, center: DEFAULT_CITY_CENTER };
    }
  },
);

// ==========================================
// СТОРЫ
// ==========================================

export const $userLocation = locationDomain
  .createStore<{ latitude: number; longitude: number } | null>(null)
  .on(requestUserLocationFx.doneData, (_, result) => result.location)
  .on(setUserLocation, (_, loc) => loc)
  .on(clearUserLocation, () => null);

export const $locationPermission = locationDomain
  .createStore<'granted' | 'denied' | 'undetermined'>('undetermined')
  .on(checkLocationPermissionFx.doneData, (_, status) => status)
  .on(requestUserLocationFx.doneData, (_, result) => result.status)
  .on(setLocationPermission, (_, status) => status);

export const $currentCity = locationDomain
  .createStore<string | null>(null)
  .on(detectCityFx.doneData, (_, info) => info.city);

export const $cityCenter = locationDomain
  .createStore<{ latitude: number; longitude: number }>(DEFAULT_CITY_CENTER)
  .on(detectCityFx.doneData, (_, info) => info.center);

export const $isDetectingCity = locationDomain
  .createStore<boolean>(false)
  .on(detectCityFx, () => true)
  .on(detectCityFx.finally, () => false);

export const $mapCenter = $userLocation.map((loc) => loc ?? DEFAULT_CITY_CENTER);

// ✅ Стор: цель фокуса карты (координаты площадки для центрирования)
export const $mapFocusTarget = locationDomain
  .createStore<{ latitude: number; longitude: number; zoom?: number } | null>(null)
  .on(setMapFocusTarget, (_, target) => target)
  .on(clearMapFocusTarget, () => null);

// ✅ Стор: открыт ли список кластера
export const $clusterSheetVisible = locationDomain
  .createStore<boolean>(false)
  .on(setClusterSheetVisible, (_, visible) => visible);
