// src/utils/distance.ts

/**
 * Формула Haversine — расстояние между двумя точками на сфере.
 * Возвращает расстояние в метрах.
 */
export const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number => {
  const R = 6371000; // радиус Земли в метрах
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
 * Форматирует расстояние: < 1000м → "450 m", ≥ 1000м → "1.2 km".
 */
export const formatDistance = (meters: number | undefined): string => {
  if (meters === undefined || meters === null) return 'Nearby';
  if (meters < 1000) return `${meters} m`;
  return `${(meters / 1000).toFixed(1)} km`;
};