// src/i18n/translations/calendar.ts
import type { TranslationDict } from '../types';

/**
 * Локализация react-native-calendars.
 * Дни недели: 0 = Sunday, 6 = Saturday (порядок как в LocaleConfig).
 * Месяцы: 0 = January, 11 = December.
 *
 * В компоненте CalendarEvents.tsx передаём locale={lang},
 * а LocaleConfig.locales заполняется из этих ключей в registerCalendarLocales().
 */
export const calendar: TranslationDict = {
  // ===== MONTHS (full) =====
  'calendar.month.0': { en: 'January', ru: 'Январь', be: 'Студзень', lt: 'Sausis', pl: 'Styczeń', uk: 'Січень' },
  'calendar.month.1': { en: 'February', ru: 'Февраль', be: 'Люты', lt: 'Vasaris', pl: 'Luty', uk: 'Лютий' },
  'calendar.month.2': { en: 'March', ru: 'Март', be: 'Сакавік', lt: 'Kovas', pl: 'Marzec', uk: 'Березень' },
  'calendar.month.3': { en: 'April', ru: 'Апрель', be: 'Красавік', lt: 'Balandis', pl: 'Kwiecień', uk: 'Квітень' },
  'calendar.month.4': { en: 'May', ru: 'Май', be: 'Травень', lt: 'Gegužė', pl: 'Maj', uk: 'Травень' },
  'calendar.month.5': { en: 'June', ru: 'Июнь', be: 'Чэрвень', lt: 'Birželis', pl: 'Czerwiec', uk: 'Червень' },
  'calendar.month.6': { en: 'July', ru: 'Июль', be: 'Ліпень', lt: 'Liepa', pl: 'Lipiec', uk: 'Липень' },
  'calendar.month.7': { en: 'August', ru: 'Август', be: 'Жнівень', lt: 'Rugpjūtis', pl: 'Sierpień', uk: 'Серпень' },
  'calendar.month.8': { en: 'September', ru: 'Сентябрь', be: 'Верасень', lt: 'Rugsėjis', pl: 'Wrzesień', uk: 'Вересень' },
  'calendar.month.9': { en: 'October', ru: 'Октябрь', be: 'Кастрычнік', lt: 'Spalis', pl: 'Październik', uk: 'Жовтень' },
  'calendar.month.10': { en: 'November', ru: 'Ноябрь', be: 'Лістапад', lt: 'Lapkritis', pl: 'Listopad', uk: 'Листопад' },
  'calendar.month.11': { en: 'December', ru: 'Декабрь', be: 'Снежань', lt: 'Gruodis', pl: 'Grudzień', uk: 'Грудень' },

  // ===== MONTHS (short) =====
  'calendar.monthShort.0': { en: 'Jan', ru: 'Янв', be: 'Сту', lt: 'Sau', pl: 'Sty', uk: 'Січ' },
  'calendar.monthShort.1': { en: 'Feb', ru: 'Фев', be: 'Лют', lt: 'Vas', pl: 'Lut', uk: 'Лют' },
  'calendar.monthShort.2': { en: 'Mar', ru: 'Мар', be: 'Сак', lt: 'Kov', pl: 'Mar', uk: 'Бер' },
  'calendar.monthShort.3': { en: 'Apr', ru: 'Апр', be: 'Кра', lt: 'Bal', pl: 'Kwi', uk: 'Кві' },
  'calendar.monthShort.4': { en: 'May', ru: 'Май', be: 'Тра', lt: 'Geg', pl: 'Maj', uk: 'Тра' },
  'calendar.monthShort.5': { en: 'Jun', ru: 'Июн', be: 'Чэр', lt: 'Bir', pl: 'Cze', uk: 'Чер' },
  'calendar.monthShort.6': { en: 'Jul', ru: 'Июл', be: 'Ліп', lt: 'Lie', pl: 'Lip', uk: 'Лип' },
  'calendar.monthShort.7': { en: 'Aug', ru: 'Авг', be: 'Жні', lt: 'Rug', pl: 'Sie', uk: 'Сер' },
  'calendar.monthShort.8': { en: 'Sep', ru: 'Сен', be: 'Вер', lt: 'Rgs', pl: 'Wrz', uk: 'Вер' },
  'calendar.monthShort.9': { en: 'Oct', ru: 'Окт', be: 'Кас', lt: 'Spa', pl: 'Paź', uk: 'Жов' },
  'calendar.monthShort.10': { en: 'Nov', ru: 'Ноя', be: 'Ліс', lt: 'Lap', pl: 'Lis', uk: 'Лис' },
  'calendar.monthShort.11': { en: 'Dec', ru: 'Дек', be: 'Сне', lt: 'Gru', pl: 'Gru', uk: 'Гру' },

  // ===== DAYS (full), 0 = Sunday =====
  'calendar.day.0': { en: 'Sunday', ru: 'Воскресенье', be: 'Нядзеля', lt: 'Sekmadienis', pl: 'Niedziela', uk: 'Неділя' },
  'calendar.day.1': { en: 'Monday', ru: 'Понедельник', be: 'Панядзелак', lt: 'Pirmadienis', pl: 'Poniedziałek', uk: 'Понеділок' },
  'calendar.day.2': { en: 'Tuesday', ru: 'Вторник', be: 'Аўторак', lt: 'Antradienis', pl: 'Wtorek', uk: 'Вівторок' },
  'calendar.day.3': { en: 'Wednesday', ru: 'Среда', be: 'Серада', lt: 'Trečiadienis', pl: 'Środa', uk: 'Середа' },
  'calendar.day.4': { en: 'Thursday', ru: 'Четверг', be: 'Чацвер', lt: 'Ketvirtadienis', pl: 'Czwartek', uk: 'Четвер' },
  'calendar.day.5': { en: 'Friday', ru: 'Пятница', be: 'Пятніца', lt: 'Penktadienis', pl: 'Piątek', uk: 'Пʼятниця' },
  'calendar.day.6': { en: 'Saturday', ru: 'Суббота', be: 'Субота', lt: 'Šeštadienis', pl: 'Sobota', uk: 'Субота' },

  // ===== DAYS (short), 0 = Sunday =====
  'calendar.dayShort.0': { en: 'Sun', ru: 'Вс', be: 'Нд', lt: 'Sk', pl: 'Nd', uk: 'Нд' },
  'calendar.dayShort.1': { en: 'Mon', ru: 'Пн', be: 'Пн', lt: 'Pr', pl: 'Pon', uk: 'Пн' },
  'calendar.dayShort.2': { en: 'Tue', ru: 'Вт', be: 'Аў', lt: 'An', pl: 'Wt', uk: 'Вт' },
  'calendar.dayShort.3': { en: 'Wed', ru: 'Ср', be: 'Ср', lt: 'Tr', pl: 'Śr', uk: 'Ср' },
  'calendar.dayShort.4': { en: 'Thu', ru: 'Чт', be: 'Чц', lt: 'Kt', pl: 'Czw', uk: 'Чт' },
  'calendar.dayShort.5': { en: 'Fri', ru: 'Пт', be: 'Пт', lt: 'Pn', pl: 'Pt', uk: 'Пт' },
  'calendar.dayShort.6': { en: 'Sat', ru: 'Сб', be: 'Сб', lt: 'Št', pl: 'Sob', uk: 'Сб' },

  // ===== TODAY =====
  'calendar.today': { en: 'Today', ru: 'Сегодня', be: 'Сёння', lt: 'Šiandien', pl: 'Dzisiaj', uk: 'Сьогодні' },
};