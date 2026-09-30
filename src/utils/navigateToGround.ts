// src/utils/navigateToGround.ts
import { router } from 'expo-router';
import { setMapFocusTarget } from '@/effector/events/sync';

/**
 * Переход на вкладку Grounds с фокусировкой карты на координатах площадки.
 * Если координат нет — просто открывает карту.
 */
export const navigateToGroundOnMap = (
  latitude?: string | number | null,
  longitude?: string | number | null,
  zoom: number = 0.005,
) => {
  if (latitude != null && longitude != null) {
    const lat = Number(latitude);
    const lng = Number(longitude);

    // Защита от NaN
    if (!isNaN(lat) && !isNaN(lng)) {
      setMapFocusTarget({
        latitude: lat,
        longitude: lng,
        zoom,
      });
    }
  }

  // Переход на вкладку Grounds
  router.push('/(drawer)/(tabs)');
};