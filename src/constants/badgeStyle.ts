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
      return { bg: '#d7e9fc', text: '#116cc7' };
    case 'football':
      return { bg: '#d7e9fc', text: '#116cc7' };
    case 'tennis':
      return { bg: '#d7e9fc', text: '#116cc7' };
    case 'volleyball':
      return { bg: '#d7e9fc', text: '#116cc7' };
    case 'pickleball':
      return { bg: '#d7e9fc', text: '#116cc7' };
    case 'skateboarding':
      return { bg: '#d7e9fc', text: '#116cc7' };
    case 'running':
      return { bg: '#d7e9fc', text: '#116cc7' };
    default:
      return { bg: '#d7e9fc', text: '#116cc7' };
  }
};