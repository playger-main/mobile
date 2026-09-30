// src/constants/surface.ts

/**
 * Возможные типы покрытия спортивных площадок.
 * Используется в:
 *  - src/app/ground/create.tsx (выбор при создании)
 *  - src/app/ground/edit.tsx (редактирование)
 *  - src/app/ground/[id].tsx (отображение)
 *
 * ⚠️ Значения совпадают с полем `coverage` в GroundEntity (массив строк).
 */
export const SURFACE_OPTIONS = [
  { id: 'asphalt', label: 'Asphalt', icon: 'square-outline' },
  { id: 'concrete', label: 'Concrete', icon: 'grid-outline' },
  { id: 'artificial_grass', label: 'Artificial grass', icon: 'leaf-outline' },
  { id: 'natural_grass', label: 'Natural grass', icon: 'leaf' },
  { id: 'clay', label: 'Clay', icon: 'ellipse-outline' },
  { id: 'hard_court', label: 'Hard court', icon: 'square' },
  { id: 'rubber', label: 'Rubber', icon: 'layers-outline' },
  { id: 'tartan', label: 'Tartan', icon: 'apps-outline' },
  { id: 'polyurethane', label: 'Polyurethane', icon: 'water-outline' },
  { id: 'wooden', label: 'Wooden (parquet)', icon: 'grid' },
  { id: 'sand', label: 'Sand', icon: 'sunny-outline' },
  { id: 'gravel', label: 'Gravel', icon: 'ellipsis-horizontal' },
  { id: 'indoor_parquet', label: 'Indoor parquet', icon: 'business-outline' },
] as const;

export type SurfaceOption = {
  id: string;
  label: string;
  icon: string;
};

/**
 * Найти опцию покрытия по id (без учёта регистра).
 */
export const getSurfaceOption = (surfaceId: string | null | undefined): SurfaceOption => {
  if (!surfaceId) {
    return { id: '', label: 'Unknown', icon: 'help-circle-outline' };
  }

  const normalized = surfaceId.toLowerCase().trim().replace(/\s+/g, '_');

  const found = SURFACE_OPTIONS.find(
    (s) => s.id === normalized || s.label.toLowerCase().replace(/\s+/g, '_') === normalized,
  );

  if (found) return found;

  // Fallback: prettify строку
  return {
    id: normalized,
    label: surfaceId.charAt(0).toUpperCase() + surfaceId.slice(1),
    icon: 'help-circle-outline',
  };
};

/**
 * Возвращает label покрытия для отображения.
 */
export const getSurfaceLabel = (surfaceId: string | null | undefined): string =>
  getSurfaceOption(surfaceId).label;

/**
 * Возвращает иконку для покрытия.
 */
export const getSurfaceIcon = (surfaceId: string | null | undefined): string =>
  getSurfaceOption(surfaceId).icon;