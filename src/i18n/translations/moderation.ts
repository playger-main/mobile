// src/i18n/translations/moderation.ts
import type { TranslationDict } from '../types';

export const moderation: TranslationDict = {
  'moderation.title': { en: 'Moderation', ru: 'Модерация', be: 'Мадэрацыя', lt: 'Moderavimas', pl: 'Moderacja', uk: 'Модерація' },
  'moderation.pending_one': { en: '{{count}} pending ground', ru: '{{count}} площадка на модерации', be: '{{count}} пляцоўка на мадэрацыі', lt: '{{count}} laukiama aikštelė', pl: '{{count}} oczekujące boisko', uk: '{{count}} майданчик на модерації' },
  'moderation.pending_few': { en: '{{count}} pending grounds', ru: '{{count}} площадки на модерации', be: '{{count}} пляцоўкі на мадэрацыі', lt: '{{count}} laukiamos aikštelės', pl: '{{count}} oczekujące boiska', uk: '{{count}} майданчики на модерації' },
  'moderation.pending_many': { en: '{{count}} pending grounds', ru: '{{count}} площадок на модерации', be: '{{count}} пляцовак на мадэрацыі', lt: '{{count}} laukiamų aikštelių', pl: '{{count}} oczekujących boisk', uk: '{{count}} майданчиків на модерації' },
  'moderation.pending_other': { en: '{{count}} pending grounds', ru: '{{count}} площадок на модерации', be: '{{count}} пляцовак на мадэрацыі', lt: '{{count}} laukiamų aikštelių', pl: '{{count}} oczekujących boisk', uk: '{{count}} майданчиків на модерації' },
  'moderation.allClear': { en: 'All clear!', ru: 'Всё чисто!', be: 'Усё чыста!', lt: 'Viskas tvarkoje!', pl: 'Wszystko gotowe!', uk: 'Усе чисто!' },
  'moderation.allClearHint': { en: 'There are no pending grounds waiting for moderation.', ru: 'Нет площадок, ожидающих модерации.', be: 'Няма пляцовак, якія чакаюць мадэрацыі.', lt: 'Nėra aikštelių, laukiančių moderavimo.', pl: 'Brak boisk oczekujących na moderację.', uk: 'Немає майданчиків, що чекають на модерацію.' },
  'moderation.accessDenied': { en: 'Access denied', ru: 'Доступ запрещён', be: 'Доступ забаронены', lt: 'Prieiga uždrausta', pl: 'Dostęp zabroniony', uk: 'Доступ заборонено' },
  'moderation.accessDeniedHint': { en: "You don't have permission to access this screen.", ru: 'У вас нет прав на этот экран.', be: 'У вас няма правоў на гэты экран.', lt: 'Neturite teisių šiam ekranui.', pl: 'Nie masz uprawnień do tego ekranu.', uk: 'У вас немає прав на цей екран.' },
  'moderation.approve': { en: 'Approve', ru: 'Одобрить', be: 'Ухваліць', lt: 'Patvirtinti', pl: 'Zatwierdź', uk: 'Схвалити' },
  'moderation.reject': { en: 'Reject', ru: 'Отклонить', be: 'Адхіліць', lt: 'Atmesti', pl: 'Odrzuć', uk: 'Відхилити' },
  'moderation.approvedTitle': { en: 'Approved', ru: 'Одобрено', be: 'Ухвалена', lt: 'Patvirtinta', pl: 'Zatwierdzono', uk: 'Схвалено' },
  'moderation.approvedMessage': { en: 'The ground is now visible to all users.', ru: 'Площадка теперь видна всем.', be: 'Пляцоўка цяпер бачная ўсім.', lt: 'Aikštelė dabar matoma visiems.', pl: 'Boisko jest teraz widoczne dla wszystkich.', uk: 'Майданчик тепер видно всім.' },
  'moderation.rejectedTitle': { en: 'Rejected', ru: 'Отклонено', be: 'Адхілена', lt: 'Atmesta', pl: 'Odrzucono', uk: 'Відхилено' },
  'moderation.rejectedMessage': { en: 'The ground has been removed.', ru: 'Площадка удалена.', be: 'Пляцоўка выдалена.', lt: 'Aikštelė pašalinta.', pl: 'Boisko zostało usunięte.', uk: 'Майданчик видалено.' },
  'moderation.rejectConfirmTitle': { en: 'Reject ground?', ru: 'Отклонить площадку?', be: 'Адхіліць пляцоўку?', lt: 'Atmesti aikštelę?', pl: 'Odrzucić boisko?', uk: 'Відхилити майданчик?' },
  'moderation.rejectConfirmHint': { en: 'This will permanently delete the ground. This action cannot be undone.', ru: 'Это навсегда удалит площадку. Действие необратимо.', be: 'Гэта назаўжды выдаліць пляцоўку. Дзеянне незваротнае.', lt: 'Tai visam laikui ištrins aikštelę. Veiksmo atšaukti negalima.', pl: 'To trwale usunie boisko. Tej czynności nie można cofnąć.', uk: 'Це назавжди видалить майданчик. Дію не можна скасувати.' },
  'moderation.rejectConfirmButton': { en: 'Reject & Delete', ru: 'Отклонить и удалить', be: 'Адхіліць і выдаліць', lt: 'Atmesti ir ištrinti', pl: 'Odrzuć i usuń', uk: 'Відхилити й видалити' },
  'moderation.failedApprove': { en: 'Failed to approve ground.', ru: 'Не удалось одобрить.', be: 'Не ўдалося ўхваліць.', lt: 'Nepavyko patvirtinti.', pl: 'Nie udało się zatwierdzić.', uk: 'Не вдалося схвалити.' },
  'moderation.failedDelete': { en: 'Failed to delete ground.', ru: 'Не удалось удалить.', be: 'Не ўдалося выдаліць.', lt: 'Nepavyko ištrinti.', pl: 'Nie udało się usunąć.', uk: 'Не вдалося видалити.' },
};