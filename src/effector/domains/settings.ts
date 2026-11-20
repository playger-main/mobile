// src/effector/domains/settings.ts
import { createDomain, createEffect, createEvent } from 'effector';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Language } from '@/i18n';

const settingsDomain = createDomain('settings');

// ============================================================
// EVENTS
// ============================================================

/** ✅ тип карты: обычная или спутник (hybrid — со спутника видны улицы) */
export type MapType = 'standard' | 'hybrid';

export const setMapType = createEvent<MapType>();
export const toggleUseLocation = createEvent<boolean>();
export const changeLanguage = createEvent<Language>();

// ✅ Тема
export type ThemeMode = 'system' | 'light' | 'dark';
export const changeThemeMode = createEvent<ThemeMode>();

// ============================================================
// STORAGE
// ============================================================

const STORAGE_KEYS = {
  LOCATION: 'settings_use_location',
  LANG: 'settings_language',
  THEME: 'settings_theme_mode',
  MAP_TYPE: 'settings_map_type',   // ✅ НОВОЕ
};

// ============================================================
// NORMALIZE
// ============================================================

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

const VALID_THEMES: ThemeMode[] = ['system', 'light', 'dark'];

function normalizeTheme(raw: string | null): ThemeMode {
  if (!raw) return 'system';
  if (VALID_THEMES.includes(raw as ThemeMode)) return raw as ThemeMode;
  return 'system';
}

/** ✅ неизвестное значение → обычная карта */
function normalizeMapType(raw: string | null): MapType {
  return raw === 'hybrid' ? 'hybrid' : 'standard';
}

// ============================================================
// HYDRATE
// ============================================================

export const hydrateSettingsFx = createEffect(async () => {
  try {
    const location = await AsyncStorage.getItem(STORAGE_KEYS.LOCATION);
    const lang = await AsyncStorage.getItem(STORAGE_KEYS.LANG);
    const theme = await AsyncStorage.getItem(STORAGE_KEYS.THEME);
    const mapType = await AsyncStorage.getItem(STORAGE_KEYS.MAP_TYPE);   // ✅

    return {
      useLocation: location !== null ? location === 'true' : true,
      language: normalizeLanguage(lang),
      themeMode: normalizeTheme(theme),
      mapType: normalizeMapType(mapType),                             // ✅
    };
  } catch {
    return {
      useLocation: true,
      language: 'en' as Language,
      themeMode: 'system' as ThemeMode,
      mapType: 'standard' as MapType,
    };
  }
});

// ============================================================
// STORES
// ============================================================


export const $useLocation = settingsDomain
  .createStore<boolean>(true)
  .on(toggleUseLocation, (_, value) => {
    AsyncStorage.setItem(STORAGE_KEYS.LOCATION, String(value));
    return value;
  })
  .on(hydrateSettingsFx.doneData, (_, p) => p.useLocation);

export const $appLanguage = settingsDomain
  .createStore<Language>('en')
  .on(changeLanguage, (_, value) => {
    AsyncStorage.setItem(STORAGE_KEYS.LANG, value);
    return value;
  })
  .on(hydrateSettingsFx.doneData, (_, p) => p.language);

// ✅ НОВЫЙ СТОР
export const $mapType = settingsDomain
  .createStore<MapType>('standard')
  .on(setMapType, (_, value) => {
    AsyncStorage.setItem(STORAGE_KEYS.MAP_TYPE, value);
    return value;
  })
  .on(hydrateSettingsFx.doneData, (_, p) => p.mapType);

export const $themeMode = settingsDomain
  .createStore<ThemeMode>('system')
  .on(changeThemeMode, (_, value) => {
    AsyncStorage.setItem(STORAGE_KEYS.THEME, value);
    return value;
  })
  .on(hydrateSettingsFx.doneData, (_, p) => p.themeMode);