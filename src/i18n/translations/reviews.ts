// src/i18n/translations/reviews.ts
import type { TranslationDict } from '../types';

export const reviews: TranslationDict = {
  // ===== REVIEWS SECTION =====
  'reviews.title': { en: 'Reviews', ru: 'Отзывы', be: 'Водгукі', lt: 'Atsiliepimai', pl: 'Opinie', uk: 'Відгуки' },
  'reviews.empty': { en: 'No reviews yet', ru: 'Пока нет отзывов', be: 'Пакуль няма водгукаў', lt: 'Kol kas nėra atsiliepimų', pl: 'Brak opinii', uk: 'Поки немає відгуків' },
  'reviews.emptyHint': { en: 'Be the first to share your experience on this ground.', ru: 'Станьте первым, кто поделится опытом о площадке.', be: 'Станьце першым, хто падзеліцца досведам пра пляцоўку.', lt: 'Būkite pirmi, kurie pasidalins patirtimi apie šią aikštelę.', pl: 'Bądź pierwszą osobą, która podzieli się opinią o tym boisku.', uk: 'Станьте першим, хто поділиться досвідом про майданчик.' },
  'reviews.writeButton': { en: 'Write a review', ru: 'Написать отзыв', be: 'Напісаць водгук', lt: 'Parašyti atsiliepimą', pl: 'Napisz opinię', uk: 'Написати відгук' },
  'reviews.editYourReview': { en: 'Edit your review', ru: 'Редактировать отзыв', be: 'Рэдагаваць водгук', lt: 'Redaguoti savo atsiliepimą', pl: 'Edytuj swoją opinię', uk: 'Редагувати відгук' },
  'reviews.yourReview': { en: 'Your review', ru: 'Ваш отзыв', be: 'Ваш водгук', lt: 'Jūsų atsiliepimas', pl: 'Twoja opinia', uk: 'Ваш відгук' },
  'reviews.noComment': { en: 'No comment', ru: 'Без комментария', be: 'Без каментара', lt: 'Be komentaro', pl: 'Bez komentarza', uk: 'Без коментаря' },
  'reviews.seeAll': { en: '· See all', ru: '· Все отзывы', be: '· Усе водгукі', lt: '· Visi atsiliepimai', pl: '· Zobacz wszystkie', uk: '· Усі відгуки' },
  'reviews.noReviewsYet': { en: 'No reviews yet · Write one', ru: 'Пока нет отзывов · Напишите', be: 'Пакуль няма водгукаў · Напішыце', lt: 'Kol kas nėra atsiliepimų · Parašykite', pl: 'Brak opinii · Napisz', uk: 'Поки немає відгуків · Напишіть' },
  'reviews.signInRequired': { en: 'Sign in required', ru: 'Требуется вход', be: 'Патрабуецца ўваход', lt: 'Reikia prisijungti', pl: 'Wymagane logowanie', uk: 'Потрібен вхід' },
  'reviews.signInHint': { en: 'Please sign in to leave a review.', ru: 'Пожалуйста, войдите, чтобы оставить отзыв.', be: 'Калі ласка, увайдзіце, каб пакінуць водгук.', lt: 'Prisijunkite, kad galėtumėte palikti atsiliepimą.', pl: 'Zaloguj się, aby zostawić opinię.', uk: 'Будь ласка, увійдіть, щоб залишити відгук.' },
  'reviews.deleteTitle': { en: 'Delete your review?', ru: 'Удалить ваш отзыв?', be: 'Выдаліць ваш водгук?', lt: 'Ištrinti jūsų atsiliepimą?', pl: 'Usunąć Twoją opinię?', uk: 'Видалити ваш відгук?' },

  // ===== REVIEW FORM =====
  'reviewForm.title': { en: 'Write a review', ru: 'Написать отзыв', be: 'Напісаць водгук', lt: 'Parašyti atsiliepimą', pl: 'Napisz opinię', uk: 'Написати відгук' },
  'reviewForm.editTitle': { en: 'Edit your review', ru: 'Редактировать отзыв', be: 'Рэдагаваць водгук', lt: 'Redaguoti savo atsiliepimą', pl: 'Edytuj swoją opinię', uk: 'Редагувати відгук' },
  'reviewForm.yourRating': { en: 'Your rating', ru: 'Ваша оценка', be: 'Ваша ацэнка', lt: 'Jūsų vertinimas', pl: 'Twoja ocena', uk: 'Ваша оцінка' },
  'reviewForm.tapToRate': { en: 'Tap a star to rate', ru: 'Нажмите на звезду', be: 'Націсніце на зорку', lt: 'Paspauskite žvaigždutę', pl: 'Dotknij gwiazdki', uk: 'Натисніть на зірку' },
  'reviewForm.poor': { en: 'Poor', ru: 'Плохо', be: 'Дрэнна', lt: 'Blogai', pl: 'Słabo', uk: 'Погано' },
  'reviewForm.fair': { en: 'Fair', ru: 'Нормально', be: 'Нармальна', lt: 'Patenkinamai', pl: 'Przeciętnie', uk: 'Нормально' },
  'reviewForm.good': { en: 'Good', ru: 'Хорошо', be: 'Добра', lt: 'Gerai', pl: 'Dobrze', uk: 'Добре' },
  'reviewForm.veryGood': { en: 'Very good', ru: 'Очень хорошо', be: 'Вельмі добра', lt: 'Labai gerai', pl: 'Bardzo dobrze', uk: 'Дуже добре' },
  'reviewForm.excellent': { en: 'Excellent!', ru: 'Отлично!', be: 'Выдатна!', lt: 'Puiku!', pl: 'Doskonale!', uk: 'Відмінно!' },
  'reviewForm.comment': { en: 'Comment (optional)', ru: 'Комментарий (необязательно)', be: 'Каментар (неабавязкова)', lt: 'Komentaras (neprivaloma)', pl: 'Komentarz (opcjonalnie)', uk: 'Коментар (необовʼязково)' },
  'reviewForm.commentPlaceholder': { en: 'Share your experience with other players…', ru: 'Поделитесь опытом с другими игроками…', be: 'Падзяліцеся досведам з іншымі гульцамі…', lt: 'Pasidalinkite patirtimi su kitais žaidėjais…', pl: 'Podziel się doświadczeniem z innymi graczami…', uk: 'Поділіться досвідом з іншими гравцями…' },
  'reviewForm.postButton': { en: 'Post review', ru: 'Опубликовать', be: 'Апублікаваць', lt: 'Paskelbti', pl: 'Opublikuj', uk: 'Опублікувати' },
  'reviewForm.ratingRequired': { en: 'Rating required', ru: 'Требуется оценка', be: 'Патрабуецца ацэнка', lt: 'Reikalingas vertinimas', pl: 'Wymagana ocena', uk: 'Потрібна оцінка' },
  'reviewForm.selectAtLeast1': { en: 'Please select at least 1 star.', ru: 'Пожалуйста, выберите хотя бы 1 звезду.', be: 'Калі ласка, выберыце хаця б 1 зорку.', lt: 'Pasirinkite bent 1 žvaigždutę.', pl: 'Wybierz co najmniej 1 gwiazdkę.', uk: 'Будь ласка, виберіть хоча б 1 зірку.' },

  // ===== REVIEW CARD =====
  'reviewCard.you': { en: 'YOU', ru: 'ВЫ', be: 'ВЫ', lt: 'JŪS', pl: 'TY', uk: 'ВИ' },
};