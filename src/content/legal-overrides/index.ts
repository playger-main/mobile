// src/content/legal-overrides/index.ts
import { RenderedSection } from '../legal';
import { PL_PRIVACY, PL_TERMS } from './pl';
import { LT_PRIVACY, LT_TERMS } from './lt';
import { UK_PRIVACY, UK_TERMS } from './uk';
import { BE_PRIVACY, BE_TERMS } from './be';

export type LegalDocKind = 'privacy' | 'terms';

interface LocaleDocument {
  privacy: RenderedSection[];
  terms: RenderedSection[];
}

/**
 * ✅ Языки юридических документов.
 *
 * `en` — оригинал (юридически значимый), остальные — переводы для удобства.
 * Язык документа не зависит от языка интерфейса: пользователь выбирает его
 * прямо на экране документа.
 */
export const LEGAL_LANGUAGES = ['en', 'ru', 'pl', 'lt', 'uk', 'be'] as const;
export type LegalLanguage = (typeof LEGAL_LANGUAGES)[number];

/** Переводы (en и ru — базовые тексты в content/legal.ts) */
const OVERRIDES: Record<string, LocaleDocument> = {
  pl: { privacy: PL_PRIVACY, terms: PL_TERMS },
  lt: { privacy: LT_PRIVACY, terms: LT_TERMS },
  uk: { privacy: UK_PRIVACY, terms: UK_TERMS },
  be: { privacy: BE_PRIVACY, terms: BE_TERMS },
};

export function normalizeLegalLanguage(value: string | null | undefined): LegalLanguage {
  return (LEGAL_LANGUAGES as readonly string[]).includes(value ?? '')
    ? (value as LegalLanguage)
    : 'en';
}

export function hasLegalTranslation(lang: string): boolean {
  return lang === 'en' || lang === 'ru' || !!OVERRIDES[lang];
}

export function getLegalOverrides(
  kind: LegalDocKind,
  lang: string,
): RenderedSection[] | undefined {
  return OVERRIDES[lang]?.[kind];
}

/** Короткие подписи для переключателя языка */
export const LEGAL_LANGUAGE_LABELS: Record<LegalLanguage, string> = {
  en: 'EN',
  ru: 'RU',
  pl: 'PL',
  lt: 'LT',
  uk: 'UK',
  be: 'BE',
};
