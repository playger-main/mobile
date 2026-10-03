// src/constants/skillLevels.ts

export const SKILL_LEVELS = [
  'all',
  'beginner',
  'intermediate',
  'advanced',
] as const;

export type SkillLevel = (typeof SKILL_LEVELS)[number];

/**
 * Ключ перевода для уровня: `events.level.all` и т.д.
 */
export const getSkillLevelKey = (level: string): string =>
  `events.level.${level.toLowerCase()}`;