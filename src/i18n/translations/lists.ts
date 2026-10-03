// src/i18n/translations/lists.ts
import type { TranslationDict } from '../types';

export const lists: TranslationDict = {
  // ===== FAVORITES =====
  'favorites.title': { en: 'Favourite grounds', ru: 'Избранные площадки', be: 'Абраныя пляцоўкі', lt: 'Mėgstamos aikštelės', pl: 'Ulubione boiska', uk: 'Улюблені майданчики' },
  'favorites.count': { en: '{{count}} saved', ru: '{{count}} сохранено', be: '{{count}} захавана', lt: 'Išsaugota: {{count}}', pl: 'Zapisano: {{count}}', uk: 'Збережено: {{count}}' },
  'favorites.empty': { en: 'No favourites yet', ru: 'Пока нет избранных', be: 'Пакуль няма абраных', lt: 'Kol kas nėra mėgstamų', pl: 'Brak ulubionych', uk: 'Поки немає обраних' },
  'favorites.emptyHint': { en: 'Tap the heart icon on any ground to save it here.', ru: 'Нажмите на сердечко у площадки, чтобы сохранить её здесь.', be: 'Націсніце на сэрцайка каля пляцоўкі, каб захаваць яе тут.', lt: 'Paspauskite širdies piktogramą prie aikštelės, kad ją išsaugotumėte.', pl: 'Dotknij ikony serca przy boisku, aby zapisać je tutaj.', uk: 'Натисніть на сердечко біля майданчика, щоб зберегти його тут.' },
  'favorites.browseButton': { en: 'Browse grounds', ru: 'Смотреть площадки', be: 'Глядзець пляцоўкі', lt: 'Naršyti aikšteles', pl: 'Przeglądaj boiska', uk: 'Дивитися майданчики' },
  'favorites.removeTitle': { en: 'Remove from favourites?', ru: 'Убрать из избранного?', be: 'Прыбраць з абранага?', lt: 'Pašalinti iš mėgstamų?', pl: 'Usunąć z ulubionych?', uk: 'Прибрати з обраного?' },
  'favorites.removeHint': { en: 'This ground will no longer appear in your favourites list.', ru: 'Эта площадка больше не будет отображаться в избранном.', be: 'Гэта пляцоўка больш не будзе адлюстроўвацца ў абраным.', lt: 'Ši aikštelė nebebus rodoma mėgstamų sąraše.', pl: 'To boisko nie będzie już widoczne na liście ulubionych.', uk: 'Цей майданчик більше не відображатиметься в обраному.' },

  // ===== JOINED =====
  'joined.title': { en: 'Joined events', ru: 'Мои события', be: 'Мае падзеі', lt: 'Mano renginiai', pl: 'Moje wydarzenia', uk: 'Мої події' },
  'joined.count_one': { en: '{{count}} event', ru: '{{count}} событие', be: '{{count}} падзея', lt: '{{count}} renginys', pl: '{{count}} wydarzenie', uk: '{{count}} подія' },
  'joined.count_few': { en: '{{count}} events', ru: '{{count}} события', be: '{{count}} падзеі', lt: '{{count}} renginiai', pl: '{{count}} wydarzenia', uk: '{{count}} події' },
  'joined.count_many': { en: '{{count}} events', ru: '{{count}} событий', be: '{{count}} падзей', lt: '{{count}} renginių', pl: '{{count}} wydarzeń', uk: '{{count}} подій' },
  'joined.count_other': { en: '{{count}} events', ru: '{{count}} событий', be: '{{count}} падзей', lt: '{{count}} renginių', pl: '{{count}} wydarzeń', uk: '{{count}} подій' },
  'joined.empty': { en: 'No joined events yet', ru: 'Вы пока не присоединились к событиям', be: 'Вы пакуль не далучыліся да падзей', lt: 'Kol kas nesate prisijungę prie renginių', pl: 'Nie dołączyłeś jeszcze do żadnych wydarzeń', uk: 'Ви ще не долучилися до подій' },
  'joined.emptyHint': { en: 'Browse events and tap "Join" to see them here.', ru: 'Просмотрите события и нажмите «Присоединиться», чтобы они появились здесь.', be: 'Праглядзіце падзеі і націсніце «Далучыцца», каб яны зʼявіліся тут.', lt: 'Naršykite renginius ir paspauskite „Prisijungti“, kad jie būtų rodomi čia.', pl: 'Przeglądaj wydarzenia i kliknij „Dołącz”, aby pojawiły się tutaj.', uk: 'Перегляньте події та натисніть «Долучитися», щоб вони зʼявилися тут.' },
  'joined.findButton': { en: 'Find events', ru: 'Найти события', be: 'Знайсці падзеі', lt: 'Rasti renginius', pl: 'Znajdź wydarzenia', uk: 'Знайти події' },

  // ===== CREATED =====
  'created.title': { en: 'My events', ru: 'Созданные события', be: 'Створаныя падзеі', lt: 'Sukurti renginiai', pl: 'Utworzone wydarzenia', uk: 'Створені події' },
  'created.subtitle': { en: '{{count}} created', ru: 'Создано: {{count}}', be: 'Створана: {{count}}', lt: 'Sukurta: {{count}}', pl: 'Utworzono: {{count}}', uk: 'Створено: {{count}}' },
  'created.empty': { en: "You haven't created events yet", ru: 'Вы ещё не создавали события', be: 'Вы яшчэ не стваралі падзей', lt: 'Kol kas nesukūrėte jokių renginių', pl: 'Nie utworzyłeś jeszcze żadnych wydarzeń', uk: 'Ви ще не створювали подій' },
  'created.emptyHint': { en: 'Host a game and invite the community to play.', ru: 'Организуйте игру и пригласите сообщество.', be: 'Арганізуйце гульню і запрасіце супольнасць.', lt: 'Organizuokite žaidimą ir pakvieskite bendruomenę.', pl: 'Zorganizuj grę i zaproś społeczność.', uk: 'Організуйте гру та запросіть спільноту.' },
  'created.createButton': { en: 'Create event', ru: 'Создать событие', be: 'Стварыць падзею', lt: 'Sukurti renginį', pl: 'Utwórz wydarzenie', uk: 'Створити подію' },

  // ===== MY REVIEWS =====
  'myReviews.title': { en: 'My reviews', ru: 'Мои отзывы', be: 'Мае водгукі', lt: 'Mano atsiliepimai', pl: 'Moje opinie', uk: 'Мої відгуки' },
  'myReviews.count_one': { en: '{{count}} review', ru: '{{count}} отзыв', be: '{{count}} водгук', lt: '{{count}} atsiliepimas', pl: '{{count}} opinia', uk: '{{count}} відгук' },
  'myReviews.count_few': { en: '{{count}} reviews', ru: '{{count}} отзыва', be: '{{count}} водгукі', lt: '{{count}} atsiliepimai', pl: '{{count}} opinie', uk: '{{count}} відгуки' },
  'myReviews.count_many': { en: '{{count}} reviews', ru: '{{count}} отзывов', be: '{{count}} водгукаў', lt: '{{count}} atsiliepimų', pl: '{{count}} opinii', uk: '{{count}} відгуків' },
  'myReviews.count_other': { en: '{{count}} reviews', ru: '{{count}} отзывов', be: '{{count}} водгукаў', lt: '{{count}} atsiliepimų', pl: '{{count}} opinii', uk: '{{count}} відгуків' },
  'myReviews.empty': { en: 'No reviews yet', ru: 'Пока нет отзывов', be: 'Пакуль няма водгукаў', lt: 'Kol kas nėra atsiliepimų', pl: 'Brak opinii', uk: 'Поки немає відгуків' },
  'myReviews.emptyHint': { en: "Share your experience on the grounds you've visited.", ru: 'Поделитесь опытом о площадках, где вы были.', be: 'Падзяліцеся досведам пра пляцоўкі, дзе вы былі.', lt: 'Pasidalinkite patirtimi apie aikšteles, kuriose lankėtės.', pl: 'Podziel się opinią o boiskach, które odwiedziłeś.', uk: 'Поділіться досвідом про майданчики, де ви були.' },
  'myReviews.browseButton': { en: 'Browse grounds', ru: 'Смотреть площадки', be: 'Глядзець пляцоўкі', lt: 'Naršyti aikšteles', pl: 'Przeglądaj boiska', uk: 'Дивитися майданчики' },
  'myReviews.deleteTitle': { en: 'Delete this review?', ru: 'Удалить этот отзыв?', be: 'Выдаліць гэты водгук?', lt: 'Ištrinti šį atsiliepimą?', pl: 'Usunąć tę opinię?', uk: 'Видалити цей відгук?' },
  'myReviews.deleteHint': { en: 'This action cannot be undone.', ru: 'Это действие нельзя отменить.', be: 'Гэта дзеянне нельга адмяніць.', lt: 'Šio veiksmo atšaukti negalima.', pl: 'Tej czynności nie można cofnąć.', uk: 'Цю дію не можна скасувати.' },
  'myReviews.deleteFailed': { en: 'Could not delete review.', ru: 'Не удалось удалить отзыв.', be: 'Не ўдалося выдаліць водгук.', lt: 'Nepavyko ištrinti atsiliepimo.', pl: 'Nie udało się usunąć opinii.', uk: 'Не вдалося видалити відгук.' },
};