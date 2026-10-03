// src/constants/surface.ts

/**
 * Типы покрытия.
 * ✅ ID хранится в БД (поле `coverage`).
 * ✅ Label для UI — через t(`surface.${id}`)
 */
export const SURFACE_OPTIONS = [
  { id: 'asphalt', icon: 'square-outline' },
  { id: 'concrete', icon: 'grid-outline' },
  { id: 'artificial_grass', icon: 'leaf-outline' },
  { id: 'natural_grass', icon: 'leaf' },
  { id: 'clay', icon: 'ellipse-outline' },
  { id: 'hard_court', icon: 'square' },
  { id: 'rubber', icon: 'layers-outline' },
  { id: 'tartan', icon: 'apps-outline' },
  { id: 'polyurethane', icon: 'water-outline' },
  { id: 'wooden', icon: 'grid' },
  { id: 'sand', icon: 'sunny-outline' },
  { id: 'gravel', icon: 'ellipsis-horizontal' },
  { id: 'indoor_parquet', icon: 'business-outline' },
] as const;

export type SurfaceOption = {
  id: string;
  icon: string;
};

/**
 * Ключ перевода: `surface.asphalt` и т.д.
 */
export const getSurfaceKey = (surfaceId: string): string =>
  `surface.${surfaceId.toLowerCase().trim()}`;

/**
 * Найти опцию покрытия по id.
 */
export const getSurfaceOption = (
  surfaceId: string | null | undefined,
): SurfaceOption => {
  if (!surfaceId) {
    return { id: 'unknown', icon: 'help-circle-outline' };
  }
  const normalized = surfaceId.toLowerCase().trim().replace(/\s+/g, '_');
  const found = SURFACE_OPTIONS.find((s) => s.id === normalized);
  if (found) return found;
  return { id: normalized, icon: 'help-circle-outline' };
};

/**
 * Возвращает иконку.
 */
export const getSurfaceIcon = (surfaceId: string | null | undefined): string =>
  getSurfaceOption(surfaceId).icon;