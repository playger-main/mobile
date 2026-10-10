// src/constants/surface.ts

/**
 * Типы покрытия.
 * ✅ ID хранится в БД (поле `coverage`).
 * ✅ Иконки — MaterialDesignIcons.
 */
export const SURFACE_OPTIONS = [
  { id: 'asphalt', icon: 'road-variant' },
  { id: 'concrete', icon: 'wall' },
  { id: 'artificial_grass', icon: 'grass' },
  { id: 'natural_grass', icon: 'sprout' },
  { id: 'clay', icon: 'circle-outline' },
  { id: 'hard_court', icon: 'tennis-court' },
  { id: 'rubber', icon: 'texture-box' },
  { id: 'tartan', icon: 'run-fast' },
  { id: 'polyurethane', icon: 'layers-triple-outline' },
  { id: 'wooden', icon: 'home-floor-1' },
  { id: 'sand', icon: 'beach' },
  { id: 'ice', icon: 'snowflake' },
  { id: 'snow', icon: 'weather-snowy' },
] as const;

export type SurfaceOption = {
  id: string;
  icon: string;
};

export const getSurfaceKey = (surfaceId: string): string =>
  `surface.${surfaceId.toLowerCase().trim()}`;

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

export const getSurfaceIcon = (surfaceId: string | null | undefined): string =>
  getSurfaceOption(surfaceId).icon;