// src/i18n/useTranslation.ts
import { useUnit } from 'effector-react';
import { $appLanguage } from '@/effector/domains/settings';
import { translations } from './translations';
import type { Language } from './types';

/**
 * Хук для переводов. Реактивный — при смене $appLanguage
 * все компоненты, использующие его, автоматически перерендерятся.
 *
 * Поддерживает:
 *   - Простой ключ:        t('common.save')
 *   - Интерполяцию:        t('auth.verify.resendIn', { count: 30 })
 *   - Плюрализацию:        t('events.count', { count: 5 })
 *     Если в translations есть ключи `key_one`, `key_few`, `key_many`,
 *     `key_other` — выберется правильная форма через Intl.PluralRules.
 */
export function useTranslation() {
  const lang = useUnit($appLanguage) as Language;

  const t = (key: string, params?: Record<string, any>): string => {
    // 1. Плюрализация (если передан числовой count)
    if (params && typeof params.count === 'number') {
      const pluralKey = resolvePluralKey(key, lang, params.count);
      if (pluralKey) {
        return renderTranslation(pluralKey, lang, params);
      }
    }

    // 2. Обычный ключ
    return renderTranslation(key, lang, params);
  };

  return { t, lang };
}

// ============================================================
// ВНУТРЕННИЕ ХЕЛПЕРЫ
// ============================================================

/** Подбирает ключ с нужным суффиксом формы (_one / _few / _many / _other). */
function resolvePluralKey(
  baseKey: string,
  lang: Language,
  count: number,
): string | null {
  const hasPluralForms =
    !!translations[`${baseKey}_one`] ||
    !!translations[`${baseKey}_few`] ||
    !!translations[`${baseKey}_many`] ||
    !!translations[`${baseKey}_other`];

  if (!hasPluralForms) return null;

  let form: Intl.LDMLPluralRule = 'other';

  try {
    const rules = new Intl.PluralRules(lang);
    form = rules.select(count);
  } catch {
    // Fallback для редких платформ без полной поддержки
    form = count === 1 ? 'one' : 'other';
  }

  // Ищем ключ с этой формой, потом fallback на _other / _many / _few / _one
  const candidates = [
    `${baseKey}_${form}`,
    `${baseKey}_other`,
    `${baseKey}_many`,
    `${baseKey}_few`,
    `${baseKey}_one`,
  ];

  for (const candidate of candidates) {
    if (translations[candidate]) return candidate;
  }

  return null;
}

/** Рендерит перевод: language → en → key + интерполяция {{...}}. */
function renderTranslation(
  key: string,
  lang: Language,
  params?: Record<string, any>,
): string {
  const entry = translations[key];
  if (!entry) {
    if (__DEV__) {
      console.warn(`[i18n] Missing key: "${key}" (lang: ${lang})`);
    }
    return key;
  }

  let str = entry[lang] ?? entry.en ?? key;

  if (params) {
    for (const [k, v] of Object.entries(params)) {
      str = str.replace(new RegExp(`{{${k}}}`, 'g'), String(v));
    }
  }

  return str;
}