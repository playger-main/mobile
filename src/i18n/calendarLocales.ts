// src/i18n/calendarLocales.ts
import { LocaleConfig } from 'react-native-calendars';
import { translations } from './translations';
import type { Language } from './types';
import { changeLanguage } from '@/effector/domains/settings';

const LANGS: Language[] = ['en', 'ru', 'be', 'lt', 'pl', 'uk'];

const pick = (key: string, lang: Language): string =>
  translations[key]?.[lang] ?? translations[key]?.en ?? key;

export function registerCalendarLocales() {
  for (const lang of LANGS) {
    LocaleConfig.locales[lang] = {
      monthNames: Array.from({ length: 12 }, (_, i) =>
        pick(`calendar.month.${i}`, lang),
      ),
      monthNamesShort: Array.from({ length: 12 }, (_, i) =>
        pick(`calendar.monthShort.${i}`, lang),
      ),
      dayNames: Array.from({ length: 7 }, (_, i) =>
        pick(`calendar.day.${i}`, lang),
      ),
      dayNamesShort: Array.from({ length: 7 }, (_, i) =>
        pick(`calendar.dayShort.${i}`, lang),
      ),
      today: pick('calendar.today', lang),
    };
  }

  LocaleConfig.defaultLocale = 'en';

  // ✅ Мгновенно синхронизируем локаль календаря с языком приложения
  changeLanguage.watch((lang) => {
    LocaleConfig.defaultLocale = lang;
  });
}

export function setCalendarLocale(lang: Language) {
  LocaleConfig.defaultLocale = lang;
}