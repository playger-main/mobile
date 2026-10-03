// src/i18n/translations/events.ts
import type { TranslationDict } from '../types';

export const events: TranslationDict = {
  // ===== EVENTS LIST =====
  'events.title': { en: 'Events', ru: 'События', be: 'Падзеі', lt: 'Renginiai', pl: 'Wydarzenia', uk: 'Події' },
  'events.today': { en: 'Today', ru: 'Сегодня', be: 'Сёння', lt: 'Šiandien', pl: 'Dziś', uk: 'Сьогодні' },
  'events.noEventsForDay': { en: 'No events planned for this day', ru: 'На этот день событий нет', be: 'На гэты дзень падзей няма', lt: 'Šiai dienai renginių nėra', pl: 'Brak wydarzeń na ten dzień', uk: 'На цей день подій немає' },
  'events.count_one': { en: '{{count}} event', ru: '{{count}} событие', be: '{{count}} падзея', lt: '{{count}} renginys', pl: '{{count}} wydarzenie', uk: '{{count}} подія' },
  'events.count_few': { en: '{{count}} events', ru: '{{count}} события', be: '{{count}} падзеі', lt: '{{count}} renginiai', pl: '{{count}} wydarzenia', uk: '{{count}} події' },
  'events.count_many': { en: '{{count}} events', ru: '{{count}} событий', be: '{{count}} падзей', lt: '{{count}} renginių', pl: '{{count}} wydarzeń', uk: '{{count}} подій' },
  'events.count_other': { en: '{{count}} events', ru: '{{count}} событий', be: '{{count}} падзей', lt: '{{count}} renginių', pl: '{{count}} wydarzeń', uk: '{{count}} подій' },
  'events.playersCount': { en: '{{current}}/{{max}} players', ru: '{{current}}/{{max}} игроков', be: '{{current}}/{{max}} гульцоў', lt: '{{current}}/{{max}} žaidėjų', pl: '{{current}}/{{max}} graczy', uk: '{{current}}/{{max}} гравців' },
  'events.unknownGround': { en: 'Unknown Ground', ru: 'Площадка не указана', be: 'Пляцоўка не пазначана', lt: 'Nežinoma aikštelė', pl: 'Nieznane boisko', uk: 'Майданчик не вказано' },
  'events.host': { en: 'HOST', ru: 'ОРГ', be: 'АРГ', lt: 'HOST', pl: 'GOSPODARZ', uk: 'ОРГ' },

    // ===== SKILL LEVELS =====
  'events.level.all': { en: 'All levels', ru: 'Все уровни', be: 'Усе ўзроўні', lt: 'Visi lygiai', pl: 'Wszystkie poziomy', uk: 'Усі рівні' },
  'events.level.beginner': { en: 'Beginner', ru: 'Начинающий', be: 'Пачатковец', lt: 'Pradedantysis', pl: 'Początkujący', uk: 'Початківець' },
  'events.level.intermediate': { en: 'Intermediate', ru: 'Средний', be: 'Сярэдні', lt: 'Vidutinis', pl: 'Średni', uk: 'Середній' },
  'events.level.advanced': { en: 'Advanced', ru: 'Продвинутый', be: 'Прасунуты', lt: 'Pažengęs', pl: 'Zaawansowany', uk: 'Просунутий' },

  // ===== CREATE / EDIT EVENT =====
  'events.create.title': { en: 'Create event', ru: 'Создать событие', be: 'Стварыць падзею', lt: 'Sukurti renginį', pl: 'Utwórz wydarzenie', uk: 'Створити подію' },
  'events.create.subtitle': { en: 'Organise a game', ru: 'Организуйте игру', be: 'Арганізуйце гульню', lt: 'Organizuokite žaidimą', pl: 'Zorganizuj grę', uk: 'Організуйте гру' },
  'events.edit.title': { en: 'Edit event', ru: 'Редактировать событие', be: 'Рэдагаваць падзею', lt: 'Redaguoti renginį', pl: 'Edytuj wydarzenie', uk: 'Редагувати подію' },
  'events.edit.subtitle': { en: 'Update details', ru: 'Обновите детали', be: 'Абнавіце дэталі', lt: 'Atnaujinkite informaciją', pl: 'Zaktualizuj szczegóły', uk: 'Оновіть деталі' },
  'events.form.titleLabel': { en: 'Event title', ru: 'Название события', be: 'Назва падзеі', lt: 'Renginio pavadinimas', pl: 'Tytuł wydarzenia', uk: 'Назва події' },
  'events.form.titlePlaceholder': { en: 'e.g. Evening pickup basketball', ru: 'Напр., Вечерний баскетбол', be: 'Напр., Вячэрні баскетбол', lt: 'Pvz., Vakarinis krepšinis', pl: 'np. Wieczorna koszykówka', uk: 'Напр., Вечірній баскетбол' },
  'events.form.ground': { en: 'Ground', ru: 'Площадка', be: 'Пляцоўка', lt: 'Aikštelė', pl: 'Boisko', uk: 'Майданчик' },
  'events.form.pickOnMap': { en: 'Pick on map', ru: 'Выбрать на карте', be: 'Выбраць на карце', lt: 'Pasirinkti žemėlapyje', pl: 'Wybierz na mapie', uk: 'Вибрати на карті' },
  'events.form.selectGround': { en: 'Select playground court', ru: 'Выберите площадку', be: 'Выберыце пляцоўку', lt: 'Pasirinkite aikštelę', pl: 'Wybierz boisko', uk: 'Виберіть майданчик' },
  'events.form.date': { en: 'Date', ru: 'Дата', be: 'Дата', lt: 'Data', pl: 'Data', uk: 'Дата' },
  'events.form.time': { en: 'Time', ru: 'Время', be: 'Час', lt: 'Laikas', pl: 'Godzina', uk: 'Час' },
  'events.form.skillLevel': { en: 'Skill level', ru: 'Уровень', be: 'Узровень', lt: 'Lygis', pl: 'Poziom', uk: 'Рівень' },
  'events.form.allLevels': { en: 'All levels', ru: 'Все уровни', be: 'Усе ўзроўні', lt: 'Visi lygiai', pl: 'Wszystkie poziomy', uk: 'Усі рівні' },
  'events.form.beginner': { en: 'Beginner', ru: 'Начинающий', be: 'Пачатковец', lt: 'Pradedantysis', pl: 'Początkujący', uk: 'Початківець' },
  'events.form.intermediate': { en: 'Intermediate', ru: 'Средний', be: 'Сярэдні', lt: 'Vidutinis', pl: 'Średni', uk: 'Середній' },
  'events.form.advanced': { en: 'Advanced', ru: 'Продвинутый', be: 'Прасунуты', lt: 'Pažengęs', pl: 'Zaawansowany', uk: 'Просунутий' },
  'events.form.playersNeeded': { en: 'Players needed', ru: 'Игроков нужно', be: 'Гульцоў трэба', lt: 'Reikia žaidėjų', pl: 'Potrzeba graczy', uk: 'Потрібно гравців' },
  'events.form.duration': { en: 'Duration (min)', ru: 'Длительность (мин)', be: 'Працягласць (хв)', lt: 'Trukmė (min)', pl: 'Czas trwania (min)', uk: 'Тривалість (хв)' },
  'events.form.description': { en: 'Description (optional)', ru: 'Описание (необязательно)', be: 'Апісанне (неабавязкова)', lt: 'Aprašymas (neprivaloma)', pl: 'Opis (opcjonalnie)', uk: 'Опис (необовʼязково)' },
  'events.form.descriptionPlaceholder': { en: 'Format, what to bring, meeting point…', ru: 'Формат, что взять, где встречаемся…', be: 'Фармат, што ўзяць, дзе сустракаемся…', lt: 'Formatas, ką atsinešti, susitikimo vieta…', pl: 'Format, co zabrać, miejsce spotkania…', uk: 'Формат, що взяти, де зустрічаємось…' },
  'events.form.publishButton': { en: 'Publish event', ru: 'Опубликовать событие', be: 'Апублікаваць падзею', lt: 'Paskelbti renginį', pl: 'Opublikuj wydarzenie', uk: 'Опублікувати подію' },
  'events.form.publishSuccess': { en: 'Success', ru: 'Успешно', be: 'Поспех', lt: 'Pavyko', pl: 'Sukces', uk: 'Успішно' },
  'events.form.publishMessage': { en: 'Your match has been successfully published!', ru: 'Ваш матч успешно опубликован!', be: 'Ваш матч паспяхова апублікаваны!', lt: 'Jūsų rungtynės sėkmingai paskelbtos!', pl: 'Twój mecz został pomyślnie opublikowany!', uk: 'Ваш матч успішно опубліковано!' },
  'events.form.updateSuccess': { en: 'Event updated successfully!', ru: 'Событие обновлено!', be: 'Падзея абноўлена!', lt: 'Renginys atnaujintas!', pl: 'Wydarzenie zaktualizowane!', uk: 'Подію оновлено!' },
  'events.form.titleRequired': { en: 'Please enter an event title.', ru: 'Введите название события.', be: 'Увядзіце назву падзеі.', lt: 'Įveskite renginio pavadinimą.', pl: 'Wprowadź tytuł wydarzenia.', uk: 'Введіть назву події.' },
  'events.form.groundRequired': { en: 'Please select a playground.', ru: 'Выберите площадку.', be: 'Выберыце пляцоўку.', lt: 'Pasirinkite aikštelę.', pl: 'Wybierz boisko.', uk: 'Виберіть майданчик.' },
  'events.form.groundPending': { en: 'Ground not available', ru: 'Площадка недоступна', be: 'Пляцоўка недаступная', lt: 'Aikštelė nepasiekiama', pl: 'Boisko niedostępne', uk: 'Майданчик недоступний' },
  'events.form.groundPendingHint': { en: 'This ground is pending moderation. Events cannot be created on it yet.', ru: 'Площадка на модерации. События пока нельзя создавать.', be: 'Пляцоўка на мадэрацыі. Падзеі пакуль нельга ствараць.', lt: 'Aikštelė laukia moderavimo. Renginių dar negalima kurti.', pl: 'Boisko oczekuje na moderację. Wydarzenia nie mogą być jeszcze tworzone.', uk: 'Майданчик на модерації. Події поки не можна створювати.' },
  'events.form.authRequiredHint': {
    en: 'Please sign in or create an account to organize your own sports events.',
    ru: 'Войдите или создайте аккаунт, чтобы организовывать свои спортивные события.',
    be: 'Увайдзіце або стварыце акаўнт, каб арганізоўваць свае спартыўныя падзеі.',
    lt: 'Prisijunkite arba susikurkite paskyrą, kad galėtumėte organizuoti savo sporto renginius.',
    pl: 'Zaloguj się lub utwórz konto, aby organizować własne wydarzenia sportowe.',
    uk: 'Увійдіть або створіть акаунт, щоб організовувати власні спортивні події.',
  },
  // ===== EVENT DETAIL =====
  'event.detail.header': { en: 'Event', ru: 'Событие', be: 'Падзея', lt: 'Renginys', pl: 'Wydarzenie', uk: 'Подія' },
  'event.detail.hostedBy': { en: 'Hosted by', ru: 'Организатор', be: 'Арганізатар', lt: 'Organizatorius', pl: 'Organizator', uk: 'Організатор' },
  'event.detail.details': { en: 'Details', ru: 'Детали', be: 'Дэталі', lt: 'Detalės', pl: 'Szczegóły', uk: 'Деталі' },
  'event.detail.noDetails': { en: 'No additional details provided for this event.', ru: 'Дополнительных деталей нет.', be: 'Дадатковых дэталяў няма.', lt: 'Papildomos informacijos nėra.', pl: 'Brak dodatkowych szczegółów.', uk: 'Додаткових деталей немає.' },
  'event.detail.join': { en: 'Join event', ru: 'Присоединиться', be: 'Далучыцца', lt: 'Prisijungti', pl: 'Dołącz', uk: 'Долучитися' },
  'event.detail.leave': { en: 'Leave event', ru: 'Покинуть событие', be: 'Пакінуць падзею', lt: 'Palikti renginį', pl: 'Opuść wydarzenie', uk: 'Покинути подію' },
  'event.detail.full': { en: 'Game Full', ru: 'Игра заполнена', be: 'Гульня запоўнена', lt: 'Žaidimas pilnas', pl: 'Gra pełna', uk: 'Гра заповнена' },
  'event.detail.finished': { en: 'Event finished', ru: 'Событие завершено', be: 'Падзея завершана', lt: 'Renginys baigtas', pl: 'Wydarzenie zakończone', uk: 'Подію завершено' },
  'event.detail.authRequired': { en: 'Authentication Required', ru: 'Требуется авторизация', be: 'Патрабуецца аўтарызацыя', lt: 'Reikalingas prisijungimas', pl: 'Wymagane uwierzytelnienie', uk: 'Потрібна авторизація' },
  'event.detail.authHint': { en: 'Please create an account or sign in to reserve a spot in this game.', ru: 'Создайте аккаунт или войдите, чтобы занять место.', be: 'Стварыце акаўнт або ўвайдзіце, каб заняць месца.', lt: 'Sukurkite paskyrą arba prisijunkite, kad užimtumėte vietą.', pl: 'Utwórz konto lub zaloguj się, aby zarezerwować miejsce.', uk: 'Створіть акаунт або увійдіть, щоб зайняти місце.' },
  'event.detail.actionFailed': { en: 'Action Failed', ru: 'Не удалось выполнить', be: 'Не ўдалося выканаць', lt: 'Veiksmas nepavyko', pl: 'Akcja nie powiodła się', uk: 'Дію не виконано' },

  // ===== EVENT GRID =====
  'eventGrid.date': { en: 'Date', ru: 'Дата', be: 'Дата', lt: 'Data', pl: 'Data', uk: 'Дата' },
  'eventGrid.time': { en: 'Time', ru: 'Время', be: 'Час', lt: 'Laikas', pl: 'Godzina', uk: 'Час' },
  'eventGrid.level': { en: 'Level', ru: 'Уровень', be: 'Узровень', lt: 'Lygis', pl: 'Poziom', uk: 'Рівень' },
  'eventGrid.players': { en: 'Players', ru: 'Игроки', be: 'Гульцы', lt: 'Žaidėjai', pl: 'Gracze', uk: 'Гравці' },

  // ===== EVENT PROGRESS =====
  'eventProgress.spotsLeft_one': { en: '{{count}} spot left', ru: 'Осталось {{count}} место', be: 'Засталося {{count}} месца', lt: 'Liko {{count}} vieta', pl: 'Pozostało {{count}} miejsce', uk: 'Залишилося {{count}} місце' },
  'eventProgress.spotsLeft_few': { en: '{{count}} spots left', ru: 'Осталось {{count}} места', be: 'Засталося {{count}} месцы', lt: 'Liko {{count}} vietos', pl: 'Pozostały {{count}} miejsca', uk: 'Залишилося {{count}} місця' },
  'eventProgress.spotsLeft_many': { en: '{{count}} spots left', ru: 'Осталось {{count}} мест', be: 'Засталося {{count}} месцаў', lt: 'Liko {{count}} vietų', pl: 'Pozostało {{count}} miejsc', uk: 'Залишилося {{count}} місць' },
  'eventProgress.spotsLeft_other': { en: '{{count}} spots left', ru: 'Осталось {{count}} мест', be: 'Засталося {{count}} месцаў', lt: 'Liko {{count}} vietų', pl: 'Pozostało {{count}} miejsc', uk: 'Залишилося {{count}} місць' },
  'eventProgress.noSpotsLeft': { en: 'No spots left', ru: 'Мест нет', be: 'Месцаў няма', lt: 'Vietų nebėra', pl: 'Brak miejsc', uk: 'Місць немає' },
  'eventLocation.subtitle': { en: 'Location', ru: 'Локация', be: 'Лакацыя', lt: 'Vieta', pl: 'Lokalizacja', uk: 'Локація' },

  // ===== PARTICIPANTS =====
  'participants.title': { en: 'Participants', ru: 'Участники', be: 'Удзельнікі', lt: 'Dalyviai', pl: 'Uczestnicy', uk: 'Учасники' },
  'participants.count': { en: '{{count}}/{{max}} joined', ru: '{{count}}/{{max}} присоединилось', be: '{{count}}/{{max}} далучылася', lt: '{{count}}/{{max}} prisijungė', pl: '{{count}}/{{max}} dołączyło', uk: '{{count}}/{{max}} долучилося' },
  'participants.creator': { en: 'Creator', ru: 'Организатор', be: 'Арганізатар', lt: 'Organizatorius', pl: 'Organizator', uk: 'Організатор' },
  'participants.empty': { en: 'No participants yet', ru: 'Пока нет участников', be: 'Пакуль няма ўдзельнікаў', lt: 'Kol kas nėra dalyvių', pl: 'Brak uczestników', uk: 'Поки немає учасників' },
  'participants.emptyHint': { en: 'Be the first to join this event', ru: 'Станьте первым участником', be: 'Станьце першым удзельнікам', lt: 'Būkite pirmi, kurie prisijungs', pl: 'Bądź pierwszym uczestnikiem', uk: 'Станьте першим учасником' },
};