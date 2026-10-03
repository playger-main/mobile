// src/utils/distance.ts

export const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number => {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
};

/**
 * Форматирует расстояние.
 * - undefined / null → null (сигнал: "покажи t('distance.nearby')")
 * - < 1000 м → "450 m" / "450 м"
 * - ≥ 1000 м → "1.2 km" / "1.2 км"
 *
 * Для локализации вернуть строку, а не число, проще:
 * единицы m/km одинаковы во всех языках. Если понадобится
 * переводить "м"/"км" — заменим на хук useFormatDistance.
 */
export const formatDistance = (meters: number | undefined): string | null => {
  if (meters === undefined || meters === null) return null;
  if (meters < 1000) return `${meters} m`;
  return `${(meters / 1000).toFixed(1)} km`;
};