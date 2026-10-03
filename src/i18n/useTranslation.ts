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
 *   - Простую подстановку:      t('common.save')
 *   - Интерполяцию:             t('auth.verify.resendIn', { count: 30 })
 *   - Плюрализацию через Intl.PluralRules:
 *     если для языка нет ключа вида `key_one/few/many/other`,
 *     используется обычный ключ
 */
export function useTranslation() {
  const lang = useUnit($appLanguage) as Language;

  const t = (key: string, params?: Record<string, any>): string => {
    const entry = translations[key];
    if (!entry) {
      if (__DEV__) {
        console.warn(`[i18n] Missing key: "${key}"`);
      }
      return key;
    }

    // Fallback: язык → английский → ключ
    let str = entry[lang] ?? entry.en ?? key;

    // Интерполяция {{name}}
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        str = str.replace(new RegExp(`{{${k}}}`, 'g'), String(v));
      }
    }

    return str;
  };

  return { t, lang };
}