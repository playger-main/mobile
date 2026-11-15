// src/content/legal-overrides/index.ts
import { RenderedSection } from '../legal';
import { PL_PRIVACY, PL_TERMS } from './pl';

export type LegalDocKind = 'privacy' | 'terms';

interface LocaleDocument {
  privacy: RenderedSection[];
  terms: RenderedSection[];
}

/**
 * ✅ Полные переводы документов по языкам.
 * Добавить язык = создать файл рядом и дописать строку сюда.
 * Если перевода нет или он структурно разошёлся с базой —
 * экран покажет английскую/русскую версию (см. resolveSections).
 */
const OVERRIDES: Record<string, LocaleDocument> = {
  pl: { privacy: PL_PRIVACY, terms: PL_TERMS },
};

export function getLegalOverrides(
  kind: LegalDocKind,
  lang: string,
): RenderedSection[] | undefined {
  return OVERRIDES[lang]?.[kind];
}
