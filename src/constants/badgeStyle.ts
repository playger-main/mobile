// src/constants/badgeStyle.ts

/**
 * Возвращает пару { bg, text } — фоновый цвет и цвет текста
 * для бейджа/точки вида спорта.
 *
 * Используется в:
 *  - src/components/ui/CardGround.tsx
 *  - src/components/ui/ListEvents.tsx
 *  - src/app/ground/[id].tsx
 *  - src/app/event/[id].tsx
 */
export const getBadgeStyle = (sport: string): { bg: string; text: string } => {
  switch (sport.toLowerCase()) {
    case 'basketball':
      return { bg: '#FFF0E6', text: '#FF8000' };
    case 'football':
      return { bg: '#FFF0E6', text: '#FF8000' };
    case 'tennis':
      return { bg: '#FFF0E6', text: '#FF8000' };
    case 'volleyball':
      return { bg: '#FFF0E6', text: '#FF8000' };
    case 'pickleball':
      return { bg: '#FFF0E6', text: '#FF8000' };
    case 'skateboarding':
      return { bg: '#FFF0E6', text: '#FF8000' };
    case 'running':
      return { bg: '#FFF0E6', text: '#FF8000' };
    default:
      return { bg: '#FFF0E6', text: '#FF8000' };
  }
};