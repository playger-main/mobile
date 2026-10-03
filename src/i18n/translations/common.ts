// src/i18n/translations/common.ts
import type { TranslationDict } from '../types';

export const common: TranslationDict = {
  // ===== COMMON =====
  'common.ok': { en: 'OK', ru: 'ОК', be: 'ОК', lt: 'Gerai', pl: 'OK', uk: 'Гаразд' },
  'common.cancel': { en: 'Cancel', ru: 'Отмена', be: 'Скасаваць', lt: 'Atšaukti', pl: 'Anuluj', uk: 'Скасувати' },
  'common.save': { en: 'Save', ru: 'Сохранить', be: 'Захаваць', lt: 'Išsaugoti', pl: 'Zapisz', uk: 'Зберегти' },
  'common.saveChanges': { en: 'Save changes', ru: 'Сохранить изменения', be: 'Захаваць змены', lt: 'Išsaugoti pakeitimus', pl: 'Zapisz zmiany', uk: 'Зберегти зміни' },
  'common.noChangesYet': { en: 'No changes yet', ru: 'Пока нет изменений', be: 'Пакуль няма змен', lt: 'Pakeitimų nėra', pl: 'Brak zmian', uk: 'Поки немає змін' },
  'common.delete': { en: 'Delete', ru: 'Удалить', be: 'Выдаліць', lt: 'Ištrinti', pl: 'Usuń', uk: 'Видалити' },
  'common.edit': { en: 'Edit', ru: 'Редактировать', be: 'Рэдагаваць', lt: 'Redaguoti', pl: 'Edytuj', uk: 'Редагувати' },
  'common.change': { en: 'Change', ru: 'Изменить', be: 'Змяніць', lt: 'Keisti', pl: 'Zmień', uk: 'Змінити' },
  'common.remove': { en: 'Remove', ru: 'Удалить', be: 'Прыбраць', lt: 'Pašalinti', pl: 'Usuń', uk: 'Прибрати' },
  'common.error': { en: 'Error', ru: 'Ошибка', be: 'Памылка', lt: 'Klaida', pl: 'Błąd', uk: 'Помилка' },
  'common.success': { en: 'Success', ru: 'Успешно', be: 'Поспех', lt: 'Pavyko', pl: 'Sukces', uk: 'Успішно' },
  'common.tryAgain': { en: 'Please try again.', ru: 'Попробуйте ещё раз.', be: 'Паспрабуйце яшчэ раз.', lt: 'Pabandykite dar kartą.', pl: 'Spróbuj ponownie.', uk: 'Спробуйте ще раз.' },
  'common.signInRequired': { en: 'Sign in required', ru: 'Требуется вход', be: 'Патрабуецца ўваход', lt: 'Reikia prisijungti', pl: 'Wymagane logowanie', uk: 'Потрібен вхід' },
  'common.signIn': { en: 'Sign In', ru: 'Войти', be: 'Увайсці', lt: 'Prisijungti', pl: 'Zaloguj się', uk: 'Увійти' },
  'common.signUp': { en: 'Sign up', ru: 'Зарегистрироваться', be: 'Зарэгістравацца', lt: 'Registruotis', pl: 'Zarejestruj się', uk: 'Зареєструватися' },
  'common.couldNotDelete': { en: 'Could not delete.', ru: 'Не удалось удалить.', be: 'Не ўдалося выдаліць.', lt: 'Nepavyko ištrinti.', pl: 'Nie udało się usunąć.', uk: 'Не вдалося видалити.' },
  'common.couldNotSave': { en: 'Could not save.', ru: 'Не удалось сохранить.', be: 'Не ўдалося захаваць.', lt: 'Nepavyko išsaugoti.', pl: 'Nie udało się zapisać.', uk: 'Не вдалося зберегти.' },
  'common.confirmDelete': { en: 'Delete?', ru: 'Удалить?', be: 'Выдаліць?', lt: 'Ištrinti?', pl: 'Usunąć?', uk: 'Видалити?' },
  'common.cannotBeUndone': { en: 'This action cannot be undone.', ru: 'Это действие нельзя отменить.', be: 'Гэта дзеянне нельга адмяніць.', lt: 'Šio veiksmo atšaukti negalima.', pl: 'Tej czynności nie można cofnąć.', uk: 'Цю дію не можна скасувати.' },
  'common.ground': { en: 'Ground', ru: 'Площадка', be: 'Пляцоўка', lt: 'Aikštelė', pl: 'Boisko', uk: 'Майданчик' },
  'common.authRequired': { en: 'Authentication Required', ru: 'Требуется авторизация', be: 'Патрабуецца аўтарызацыя', lt: 'Reikalingas prisijungimas', pl: 'Wymagane uwierzytelnienie', uk: 'Потрібна авторизація' },

  // ===== GENERIC ERRORS =====
  'error.generic': { en: 'Something went wrong.', ru: 'Что-то пошло не так.', be: 'Нешта пайшло не так.', lt: 'Kažkas nepavyko.', pl: 'Coś poszło nie tak.', uk: 'Щось пішло не так.' },
  'error.network': { en: 'Network error. Check your connection.', ru: 'Ошибка сети. Проверьте соединение.', be: 'Памылка сеткі. Праверце злучэнне.', lt: 'Tinklo klaida. Patikrinkite ryšį.', pl: 'Błąd sieci. Sprawdź połączenie.', uk: 'Помилка мережі. Перевірте з’єднання.' },
  'error.unauthorized': { en: 'Please sign in again.', ru: 'Войдите заново.', be: 'Увайдзіце зноў.', lt: 'Prisijunkite iš naujo.', pl: 'Zaloguj się ponownie.', uk: 'Увійдіть знову.' },
  'error.notFound': { en: 'Not found.', ru: 'Не найдено.', be: 'Не знойдзена.', lt: 'Nerasta.', pl: 'Nie znaleziono.', uk: 'Не знайдено.' },

    // ===== RELATIVE DATE =====
  'relativeDate.justNow': {
    en: 'just now',
    ru: 'только что',
    be: 'толькі што',
    lt: 'ką tik',
    pl: 'przed chwilą',
    uk: 'щойно',
  },
  'relativeDate.minutesAgo': {
    en: '{{count}}m ago',
    ru: '{{count}} мин назад',
    be: '{{count}} хв таму',
    lt: 'prieš {{count}} min.',
    pl: '{{count}} min temu',
    uk: '{{count}} хв тому',
  },
  'relativeDate.hoursAgo': {
    en: '{{count}}h ago',
    ru: '{{count}} ч назад',
    be: '{{count}} г таму',
    lt: 'prieš {{count}} val.',
    pl: '{{count}} godz. temu',
    uk: '{{count}} год тому',
  },
  'relativeDate.daysAgo': {
    en: '{{count}}d ago',
    ru: '{{count}} дн назад',
    be: '{{count}} д таму',
    lt: 'prieš {{count}} d.',
    pl: '{{count}} dni temu',
    uk: '{{count}} дн тому',
  },
};