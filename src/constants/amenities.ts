// src/constants/amenities.ts

/**
 * Список удобств (amenities), доступных для площадок.
 * Используется в:
 *  - src/app/ground/create.tsx (выбор при создании)
 *  - src/app/ground/[id].tsx (отображение на детальной странице)
 *  - src/app/ground/moderation.tsx (модерация)
 *  - src/components/ui/CardGround.tsx (превью)
 *
 * ⚠️ Важно: значения должны совпадать с тем, что хранится в БД (поле `amenities` в GroundEntity).
 * Если добавляете новые — обновляйте и бэкенд (seed / миграции), если нужен строгий контроль.
 */
export const AMENITIES_OPTIONS = [
  'Floodlights',
  'Benches',
  'Free entry',
  'Parking',
  'Changing rooms',
  'Water fountain',
  'Showers',
  'Lockers',
  'Restrooms',
  'Wi-Fi',
  'Cafeteria',
  'First aid kit',
  'Equipment rental',
  'Wheelchair accessible',
] as const;

export type Amenity = (typeof AMENITIES_OPTIONS)[number];

/**
 * Проверяет, является ли строка допустимым удобством.
 */
export const isValidAmenity = (value: string): value is Amenity =>
  (AMENITIES_OPTIONS as readonly string[]).includes(value);

/**
 * Возвращает иконку Ionicons для удобства.
 * Если соответствие не найдено — возвращает дефолтную иконку.
 */
export const getAmenityIcon = (
  amenity: string,
): keyof typeof import('@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/Ionicons.json') => {
  const map: Record<string, any> = {
    Floodlights: 'flashlight-outline',
    Benches: 'bed-outline',
    'Free entry': 'pricetag-outline',
    Parking: 'car-outline',
    'Changing rooms': 'shirt-outline',
    'Water fountain': 'water-outline',
    Showers: 'water-outline',
    Lockers: 'lock-closed-outline',
    Restrooms: 'man-outline',
    'Wi-Fi': 'wifi-outline',
    Cafeteria: 'restaurant-outline',
    'First aid kit': 'medkit-outline',
    'Equipment rental': 'construct-outline',
    'Wheelchair accessible': 'accessibility-outline',
  };

  return map[amenity] ?? 'checkmark-circle-outline';
};

/**
 * Группирует amenities по категориям — удобно для UI (секции, фильтры).
 */
export const AMENITY_CATEGORIES = {
  Essentials: ['Free entry', 'Restrooms', 'Water fountain'],
  Comfort: ['Benches', 'Showers', 'Changing rooms', 'Lockers'],
  Convenience: ['Parking', 'Wi-Fi', 'Cafeteria', 'Equipment rental'],
  Safety: ['Floodlights', 'First aid kit', 'Wheelchair accessible'],
} as const;