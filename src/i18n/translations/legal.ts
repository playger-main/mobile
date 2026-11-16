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
  // ✅ плашка «согласие зафиксировано» на экранах документов
  'legal.consent.title': {
    en: 'Consent recorded',
    ru: 'Согласие зафиксировано',
    be: 'Згода зафіксавана',
    lt: 'Sutikimas užfiksuotas',
    pl: 'Zgoda zapisana',
    uk: 'Згоду зафіксовано',
  },
  'legal.consent.body': {
    en: 'You accepted the Terms of Use and the Privacy Policy and have read them.',
    ru: 'Вы согласились с Условиями использования и Политикой конфиденциальности и ознакомились с ними.',
    be: 'Вы пагадзіліся з Умовамі выкарыстання і Палітыкай прыватнасці і азнаёміліся з імі.',
    lt: 'Jūs sutikote su naudojimo sąlygomis ir privatumo politika bei susipažinote su jais.',
    pl: 'Zaakceptowałeś Warunki korzystania i Politykę prywatności oraz zapoznałeś się z nimi.',
    uk: 'Ви погодилися з Умовами використання та Політикою конфіденційності й ознайомилися з ними.',
  },
  'legal.consent.meta': {
    en: 'Version {{version}} · {{date}}',
    ru: 'Версия {{version}} · {{date}}',
    be: 'Версія {{version}} · {{date}}',
    lt: 'Versija {{version}} · {{date}}',
    pl: 'Wersja {{version}} · {{date}}',
    uk: 'Версія {{version}} · {{date}}',
  },
};
