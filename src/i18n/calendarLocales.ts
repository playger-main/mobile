// src/i18n/calendarLocales.ts
import { LocaleConfig } from 'react-native-calendars';
import { translations, type Language } from '.';

const LANGS: Language[] = ['en', 'ru', 'be', 'lt', 'pl', 'uk'];

const pick = (key: string, lang: Language): string =>
  translations[key]?.[lang] ?? translations[key]?.en ?? key;

/**
 * Регистрирует локали календаря из наших переводов.
 * Вызвать ОДИН РАЗ при старте приложения (в корневом _layout.tsx).
 */
export function registerCalendarLocales() {
  for (const lang of LANGS) {
    const monthNames = Array.from({ length: 12 }, (_, i) =>
      pick(`calendar.month.${i}`, lang),
    );
    const monthNamesShort = Array.from({ length: 12 }, (_, i) =>
      pick(`calendar.monthShort.${i}`, lang),
    );
    const dayNames = Array.from({ length: 7 }, (_, i) =>
      pick(`calendar.day.${i}`, lang),
    );
    const dayNamesShort = Array.from({ length: 7 }, (_, i) =>
      pick(`calendar.dayShort.${i}`, lang),
    );

    LocaleConfig.locales[lang] = {
      monthNames,
      monthNamesShort,
      dayNames,
      dayNamesShort,
      today: pick('calendar.today', lang),
    };
  }

  // Дефолтная локаль — английская. Реальная будет
  // переключаться через changeLanguage (см. _layout.tsx).
  LocaleConfig.defaultLocale = 'en';
}

/**
 * Сменить активную локаль календаря.
 * Вызывать при каждом изменении $appLanguage.
 */
export function setCalendarLocale(lang: Language) {
  LocaleConfig.defaultLocale = lang;
}