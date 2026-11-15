// src/i18n/translations/legal.ts
import type { TranslationDict } from '../types';

export const legal: TranslationDict = {
  // ✅ мета-информация и служебные подписи документов
  'legal.meta.version': {
    en: 'Version {{version}}',
    ru: 'Версия {{version}}',
    be: 'Версія {{version}}',
    lt: 'Versija {{version}}',
    pl: 'Wersja {{version}}',
    uk: 'Версія {{version}}',
  },
  'legal.meta.effective': {
    en: 'effective from {{date}}',
    ru: 'действует с {{date}}',
    be: 'дзейнічае з {{date}}',
    lt: 'galioja nuo {{date}}',
    pl: 'obowiązuje od {{date}}',
    uk: 'діє з {{date}}',
  },
  'legal.englishPrevails': {
    en: 'The English version of this document is the legally binding one.',
    ru: 'Юридически значимой является английская версия документа.',
    be: 'Юрыдычна значнай з’яўляецца англійская версія дакумента.',
    lt: 'Teisiškai privaloma yra dokumento versija anglų kalba.',
    pl: 'Wiążąca prawnie jest angielska wersja dokumentu.',
    uk: 'Юридично значущою є англійська версія документа.',
  },
  'legal.contact.title': {
    en: 'Contact us',
    ru: 'Связаться с нами',
    be: 'Звязацца з намі',
    lt: 'Susisiekite su mumis',
    pl: 'Kontakt',
    uk: 'Зв’язатися з нами',
  },

  'legal.privacy.title': {
    en: 'Privacy Policy',
    ru: 'Политика конфиденциальности',
    be: 'Палітыка прыватнасці',
    lt: 'Privatumo politika',
    pl: 'Polityka prywatności',
    uk: 'Політика конфіденційності',
  },

  'legal.terms.title': {
    en: 'Terms of Use',
    ru: 'Условия использования',
    be: 'Умовы выкарыстання',
    lt: 'Naudojimo sąlygos',
    pl: 'Warunki użytkowania',
    uk: 'Умови використання',
  },
};
