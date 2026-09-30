// src/constants/location.ts

/**
 * Центры крупных городов Литвы.
 * Используется как fallback, когда reverseGeocode вернул название города.
 * Если города нет в словаре — используем координаты пользователя.
 */
export const CITY_CENTERS: Record<string, { latitude: number; longitude: number }> = {
  vilnius: { latitude: 54.6872, longitude: 25.2797 },
  kaunas: { latitude: 54.8985, longitude: 23.9036 },
  klaipeda: { latitude: 55.7033, longitude: 21.1443 },
  'klaipėda': { latitude: 55.7033, longitude: 21.1443 },
  siauliai: { latitude: 55.9333, longitude: 23.3167 },
  'šiauliai': { latitude: 55.9333, longitude: 23.3167 },
  panevezys: { latitude: 55.7333, longitude: 24.35 },
  'panevėžys': { latitude: 55.7333, longitude: 24.35 },
  alytus: { latitude: 54.3964, longitude: 24.0414 },
  marijampole: { latitude: 54.5597, longitude: 23.3544 },
  'marijampolė': { latitude: 54.5597, longitude: 23.3544 },
  utena: { latitude: 55.4986, longitude: 25.6019 },
  'utenà': { latitude: 55.4986, longitude: 25.6019 },
  taurage: { latitude: 55.2503, longitude: 22.2894 },
  'tauragė': { latitude: 55.2503, longitude: 22.2894 },
  telsiai: { latitude: 55.9842, longitude: 22.2456 },
  'telšiai': { latitude: 55.9842, longitude: 22.2456 },
};

/**
 * Дефолтный центр (Вильнюс) — если ничего не удалось определить.
 */
export const DEFAULT_CITY_CENTER = CITY_CENTERS.vilnius;

/**
 * Дефолтный зум для карты (в градусах).
 */
export const DEFAULT_LAT_DELTA = 0.02;
export const DEFAULT_LNG_DELTA = 0.02;

/**
 * Зум при центрировании на пользователя.
 */
export const USER_ZOOM_LAT_DELTA = 0.01;
export const USER_ZOOM_LNG_DELTA = 0.01;

/**
 * Хелпер: получить центр города по названию (регистронезависимо).
 */
export const getCityCenter = (
  cityName: string | null | undefined,
): { latitude: number; longitude: number } | null => {
  if (!cityName) return null;
  const key = cityName.toLowerCase().trim();
  return CITY_CENTERS[key] ?? null;
};