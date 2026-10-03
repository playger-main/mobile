// src/i18n/useRelativeDate.ts
import { useTranslation } from './useTranslation';
import type { Language } from './types';

/**
 * Хук для форматирования относительного времени.
 * Возвращает функцию: (ts: number) => string
 *
 * Пример:
 *   const fmt = useRelativeDate();
 *   fmt(Date.now() - 5 * 60 * 1000);  // "5 мин назад" (ru)
 */
export function useRelativeDate() {
  const { t, lang } = useTranslation();

  const localeMap: Record<Language, string> = {
    en: 'en-US',
    ru: 'ru-RU',
    be: 'be-BY',
    lt: 'lt-LT',
    pl: 'pl-PL',
    uk: 'uk-UA',
  };

  return (ts: number): string => {
    const diff = Date.now() - ts;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return t('relativeDate.justNow');
    if (minutes < 60) return t('relativeDate.minutesAgo', { count: minutes });
    if (hours < 24) return t('relativeDate.hoursAgo', { count: hours });
    if (days < 30) return t('relativeDate.daysAgo', { count: days });

    return new Date(ts).toLocaleDateString(localeMap[lang] ?? 'en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };
}