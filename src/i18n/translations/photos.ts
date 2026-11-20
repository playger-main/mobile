// src/i18n/translations/photos.ts
import type { TranslationDict } from '../types';

export const photos: TranslationDict = {
  'photos.main': { en: 'Main', ru: 'Главное', be: 'Галоўнае', lt: 'Pagrindinė', pl: 'Główne', uk: 'Головне' },
  'photos.maxPhotos': { en: 'Maximum photos', ru: 'Максимум фото', be: 'Максімум фота', lt: 'Daugiausia nuotraukų', pl: 'Maksymalna liczba zdjęć', uk: 'Максимум фото' },
  'photos.upToN': { en: 'You can add up to {{count}} photos.', ru: 'Можно добавить до {{count}} фото.', be: 'Можна дадаць да {{count}} фота.', lt: 'Galite pridėti iki {{count}} nuotraukų.', pl: 'Możesz dodać do {{count}} zdjęć.', uk: 'Можна додати до {{count}} фото.' },
  'photos.permissionNeeded': { en: 'Permission needed', ru: 'Требуется разрешение', be: 'Патрабуецца дазвол', lt: 'Reikalingas leidimas', pl: 'Wymagane pozwolenie', uk: 'Потрібен дозвіл' },
  'photos.accessHint': { en: 'We need access to your photos.', ru: 'Нужен доступ к вашим фото.', be: 'Патрэбен доступ да вашых фота.', lt: 'Mums reikia prieigos prie jūsų nuotraukų.', pl: 'Potrzebujemy dostępu do Twoich zdjęć.', uk: 'Потрібен доступ до ваших фото.' },
  'photos.hint': { en: 'Up to {{max}} photos. Tap ⭐ to set as main (cover).', ru: 'До {{max}} фото. Нажмите ⭐, чтобы сделать главным.', be: 'Да {{max}} фота. Націсніце ⭐, каб зрабіць галоўным.', lt: 'Iki {{max}} nuotraukų. Paspauskite ⭐, kad nustatytumėte pagrindinę.', pl: 'Do {{max}} zdjęć. Dotknij ⭐, aby ustawić jako główne.', uk: 'До {{max}} фото. Натисніть ⭐, щоб зробити головним.' },
  // ✅ iOS: доступ «только к выбранным фото» путает людей — ведём в настройки
  'photos.openSettings': {
    en: 'Open settings',
    ru: 'Открыть настройки',
    be: 'Адкрыць налады',
    lt: 'Atidaryti nustatymus',
    pl: 'Otwórz ustawienia',
    uk: 'Відкрити налаштування',
  },
  'photos.limitedHint': {
    en: 'You gave access to selected photos only. If your photo is not in the list, allow all photos in Settings → PlayG → Photos.',
    ru: 'Вы разрешили доступ только к выбранным фото. Если нужного фото нет в списке, разрешите все: Настройки → PlayG → Фото.',
    be: 'Вы дазволілі доступ толькі да выбраных фота. Калі патрэбнага фота няма ў спісе, дазвольце ўсе: Налады → PlayG → Фота.',
    lt: 'Leidote prieigą tik prie pasirinktų nuotraukų. Jei reikiamos nuotraukos sąraše nėra, leiskite visas: Nustatymai → PlayG → Nuotraukos.',
    pl: 'Przyznano dostęp tylko do wybranych zdjęć. Jeśli Twojego zdjęcia nie ma na liście, zezwól na wszystkie: Ustawienia → PlayG → Zdjęcia.',
    uk: 'Ви надали доступ лише до вибраних фото. Якщо потрібного фото немає у списку, дозвольте всі: Налаштування → PlayG → Фото.',
  },
};