// src/i18n/types.ts

export type Language = 'en' | 'be' | 'lt' | 'pl' | 'ru' | 'uk';

/** Формат одного словаря: ключ → { en, ru, be, lt, pl, uk } */
export type TranslationDict = Record<string, Record<Language, string>>;