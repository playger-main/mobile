// src/constants/amenities.ts

/**
 * Список удобств.
 * ✅ ID (camelCase) хранится в БД (поле `amenities`).
 * ✅ Label для UI — через t(`amenity.${id}`)
 */
export const AMENITIES_OPTIONS = [
  'floodlights',
  'benches',
  'freeEntry',
  'parking',
  'changingRooms',
  'waterFountain',
  'showers',
  'lockers',
  'restrooms',
  'wifi',
  'cafeteria',
  'firstAidKit',
  'equipmentRental',
  'wheelchairAccessible',
] as const;

export type Amenity = (typeof AMENITIES_OPTIONS)[number];

export const isValidAmenity = (value: string): value is Amenity =>
  (AMENITIES_OPTIONS as readonly string[]).includes(value);

/**
 * Ключ перевода: `amenity.floodlights`, `amenity.freeEntry` и т.д.
 */
export const getAmenityKey = (amenity: string): string => `amenity.${amenity}`;

/**
 * Возвращает иконку Ionicons для удобства.
 * Работает и по camelCase-ключу, и по старому значению (для совместимости).
 */
export const getAmenityIcon = (
  amenity: string,
): keyof typeof import('@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/Ionicons.json') => {
  const map: Record<string, any> = {
    // ✅ ключи
    floodlights: 'flashlight-outline',
    benches: 'bed-outline',
    freeEntry: 'pricetag-outline',
    parking: 'car-outline',
    changingRooms: 'shirt-outline',
    waterFountain: 'water-outline',
    showers: 'water-outline',
    lockers: 'lock-closed-outline',
    restrooms: 'man-outline',
    wifi: 'wifi-outline',
    cafeteria: 'restaurant-outline',
    firstAidKit: 'medkit-outline',
    equipmentRental: 'construct-outline',
    wheelchairAccessible: 'accessibility-outline',
    // legacy (на случай не-мигрированных данных)
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

export const AMENITY_CATEGORIES = {
  essentials: ['freeEntry', 'restrooms', 'waterFountain'],
  comfort: ['benches', 'showers', 'changingRooms', 'lockers'],
  convenience: ['parking', 'wifi', 'cafeteria', 'equipmentRental'],
  safety: ['floodlights', 'firstAidKit', 'wheelchairAccessible'],
} as const;