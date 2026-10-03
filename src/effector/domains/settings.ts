// src/effector/domains/settings.ts
import { createDomain, createEffect, createEvent } from 'effector';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Language } from '@/i18n';

const settingsDomain = createDomain('settings');

export const toggleEventReminders = createEvent<boolean>();
export const toggleUseLocation = createEvent<boolean>();
export const changeLanguage = createEvent<Language>();

const STORAGE_KEYS = {
  REMINDERS: 'settings_event_reminders',
  LOCATION: 'settings_use_location',
  LANG: 'settings_language',
};

// ✅ Миграция: старые значения 'English' → 'en'
const LEGACY_LANGUAGE_MAP: Record<string, Language> = {
  English: 'en',
  Russian: 'ru',
  Belarusian: 'be',
  Lithuanian: 'lt',
  Polish: 'pl',
  Ukrainian: 'uk',
};

const VALID_LANGUAGES: Language[] = ['en', 'ru', 'be', 'lt', 'pl', 'uk'];

function normalizeLanguage(raw: string | null): Language {
  if (!raw) return 'en';
  if (VALID_LANGUAGES.includes(raw as Language)) return raw as Language;
  if (LEGACY_LANGUAGE_MAP[raw]) return LEGACY_LANGUAGE_MAP[raw];
  return 'en';
}

export const hydrateSettingsFx = createEffect(async () => {
  try {
    const reminders = await AsyncStorage.getItem(STORAGE_KEYS.REMINDERS);
    const location = await AsyncStorage.getItem(STORAGE_KEYS.LOCATION);
    const lang = await AsyncStorage.getItem(STORAGE_KEYS.LANG);

    return {
      eventReminders: reminders !== null ? reminders === 'true' : true,
      useLocation: location !== null ? location === 'true' : true,
      language: normalizeLanguage(lang),
    };
  } catch {
    return {
      eventReminders: true,
      useLocation: true,
      language: 'en' as Language,
    };
  }
});

export const $eventReminders = settingsDomain
  .createStore<boolean>(true)
  .on(toggleEventReminders, (_, value) => {
    AsyncStorage.setItem(STORAGE_KEYS.REMINDERS, String(value));
    return value;
  })
  .on(hydrateSettingsFx.doneData, (_, payload) => payload.eventReminders);

export const $useLocation = settingsDomain
  .createStore<boolean>(true)
  .on(toggleUseLocation, (_, value) => {
    AsyncStorage.setItem(STORAGE_KEYS.LOCATION, String(value));
    return value;
  })
  .on(hydrateSettingsFx.doneData, (_, payload) => payload.useLocation);

// ✅ Теперь типизирован как Language, а не string
export const $appLanguage = settingsDomain
  .createStore<Language>('en')
  .on(changeLanguage, (_, value) => {
    AsyncStorage.setItem(STORAGE_KEYS.LANG, value);
    return value;
  })
  .on(hydrateSettingsFx.doneData, (_, payload) => payload.language);