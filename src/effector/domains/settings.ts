// src/effector/domains/settings.ts
import { createDomain, createEffect, createEvent } from 'effector';
import AsyncStorage from '@react-native-async-storage/async-storage';

const settingsDomain = createDomain('settings');

// Синхронные экшены изменения настроек
export const toggleEventReminders = createEvent<boolean>();
export const toggleUseLocation = createEvent<boolean>();
export const changeLanguage = createEvent<string>();

// Ключи для AsyncStorage
const STORAGE_KEYS = {
  REMINDERS: 'settings_event_reminders',
  LOCATION: 'settings_use_location',
  LANG: 'settings_language',
};

// ⚡️ АСИНХРОННЫЙ ЭФФЕКТ: Восстановление настроек из памяти телефона при старте
export const hydrateSettingsFx = createEffect(async () => {
  try {
    const reminders = await AsyncStorage.getItem(STORAGE_KEYS.REMINDERS);
    const location = await AsyncStorage.getItem(STORAGE_KEYS.LOCATION);
    const lang = await AsyncStorage.getItem(STORAGE_KEYS.LANG);

    return {
      eventReminders: reminders !== null ? reminders === 'true' : true, // по умолчанию true
      useLocation: location !== null ? location === 'true' : true,       // по умолчанию true
      language: lang !== null ? lang : 'English',
    };
  } catch {
    return { eventReminders: true, useLocation: true, language: 'English' };
  }
});

// Сторы настроек
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

export const $appLanguage = settingsDomain
  .createStore<string>('English')
  .on(changeLanguage, (_, value) => {
    AsyncStorage.setItem(STORAGE_KEYS.LANG, value);
    return value;
  })
  .on(hydrateSettingsFx.doneData, (_, payload) => payload.language);
