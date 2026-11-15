// src/content/legal.ts
/**
 * ✅ Юридические тексты в структурированном виде.
 *
 * Английская версия — основная (это принято и для App Store, и для Google Play);
 * русская — для основного рынка. Для be/lt/pl/uk показывается английская версия,
 * о чём экран честно сообщает («English version prevails»).
 *
 * ⚠️ Перед публикацией подставьте свои реквизиты в LEGAL_META:
 * юридическое лицо/ИП, адрес, страну регистрации и дату вступления в силу.
 * Текст составлен по фактическому поведению приложения, но не является
 * юридической консультацией — финальную версию стоит показать юристу.
 */

export type LegalLang = 'en' | 'ru';

/** Язык, для которого есть полный перевод документа (см. content/legal-overrides). */
export type LegalLocale = 'pl' | 'uk' | 'lt' | 'be';

/** Раздел, уже приведённый к одному языку — то, что рисует экран. */
export interface RenderedSection {
  title: string;
  lead?: string;
  bullets?: string[];
  paragraphs?: string[];
}

export interface LocalizedText {
  en: string;
  ru: string;
}

export interface LegalSection {
  title: LocalizedText;
  /** Вводный абзац перед списком */
  lead?: LocalizedText;
  bullets?: LocalizedText[];
  paragraphs?: LocalizedText[];
}

export const LEGAL_META = {
  /** Версия документа — увеличивайте при изменениях */
  version: '2.1',
  /** Дата вступления в силу (ISO, YYYY-MM-DD) */
  effectiveDate: '2026-11-15',
  /** Оператор данных / владелец сервиса — замените на своё юрлицо */
  controller: 'PlayG',
  /** Контакт для вопросов по данным и поддержки */
  contactEmail: 'playgroundmanage@gmail.com',
  /**
   * ✅ Сервис работает в нескольких странах, поэтому мы НЕ привязываем документы
   * к одной юрисдикции. Здесь укажите страну регистрации оператора, когда
   * появится юрлицо/ИП (например: Poland, Lithuania, Ukraine).
   * Пока стоит нейтральная формулировка «страна регистрации оператора».
   */
  jurisdiction: {
    en: 'the country in which the operator is established',
    ru: 'страна регистрации оператора',
    pl: 'kraj rejestracji operatora',
  },
} as const;

/** Текст, для которого нет перевода, показываем на английском. */
export function pickLegalText(text: LocalizedText, lang: string): string {
  return lang === 'ru' ? text.ru : text.en;
}

/**
 * ✅ Приводит разделы к нужному языку.
 * Приоритет: полный перевод (overrides) → ru → en.
 * Длина overrides должна совпадать с числом разделов — иначе берём базу,
 * чтобы при правке документа не показать «съехавший» перевод.
 */
export function resolveSections(
  sections: LegalSection[],
  lang: string,
  overrides?: RenderedSection[],
): RenderedSection[] {
  const useOverrides =
    overrides && overrides.length === sections.length ? overrides : undefined;

  return sections.map((section, index) => {
    if (useOverrides) return useOverrides[index];

    return {
      title: pickLegalText(section.title, lang),
      lead: section.lead ? pickLegalText(section.lead, lang) : undefined,
      bullets: section.bullets?.map((bullet) => pickLegalText(bullet, lang)),
      paragraphs: section.paragraphs?.map((paragraph) =>
        pickLegalText(paragraph, lang),
      ),
    };
  });
}

// ============================================================
// PRIVACY POLICY
// ============================================================

export const PRIVACY_SECTIONS: LegalSection[] = [
  {
    title: { en: '1. Who we are', ru: '1. Кто мы' },
    paragraphs: [
      {
        en: `PlayG is a mobile app that helps people find playgrounds and sports grounds, create and join sport events, and leave reviews. The service is operated by ${LEGAL_META.controller} (referred to as "we", "us").`,
        ru: `PlayG — мобильное приложение, которое помогает находить площадки для спорта, создавать события и присоединяться к ним, а также оставлять отзывы. Сервис предоставляет ${LEGAL_META.controller} (далее — «мы»).`,
      },
      {
        en: `For any privacy question, or to exercise your rights, contact us at ${LEGAL_META.contactEmail}.`,
        ru: `По любым вопросам о персональных данных и для реализации ваших прав пишите на ${LEGAL_META.contactEmail}.`,
      },
    ],
  },
  {
    title: { en: '2. What we collect', ru: '2. Какие данные мы собираем' },
    bullets: [
      {
        en: 'Account data: username, email address, password (stored only as a bcrypt hash, never in plain text), and whether the email is confirmed.',
        ru: 'Данные аккаунта: имя пользователя, адрес электронной почты, пароль (хранится только в виде bcrypt-хеша, никогда в открытом виде) и признак подтверждения email.',
      },
      {
        en: 'Profile data you add: avatar and profile photos, short bio, preferred sports, and your city.',
        ru: 'Данные профиля, которые вы добавляете: аватар и фотографии, краткое описание, любимые виды спорта и ваш город.',
      },
      {
        en: 'Content you create: grounds (name, sports, surface, amenities, address, description), events (title, date, time, duration, level, number of players), reviews (rating, comment) and likes.',
        ru: 'Создаваемый вами контент: площадки (название, виды спорта, покрытие, удобства, адрес, описание), события (название, дата, время, длительность, уровень, число игроков), отзывы (оценка, комментарий) и лайки.',
      },
      {
        en: 'Favourites: which grounds you saved.',
        ru: 'Избранное: какие площадки вы сохранили.',
      },
      {
        en: 'Location: only if the "Use my location" setting is on. We use your coordinates to show nearby grounds and to detect your city. You can turn this off at any time in Settings; the map still works with a default city.',
        ru: 'Геолокация: только если включена настройка «Использовать мою геолокацию». Координаты нужны, чтобы показать площадки рядом и определить город. Настройку можно выключить в любой момент; карта продолжит работать с городом по умолчанию.',
      },
      {
        en: 'Technical data: IP address, request time and app/device version in server logs — used for security, rate limiting and error diagnosis.',
        ru: 'Технические данные: IP-адрес, время запроса и версия приложения/устройства в серверных логах — для безопасности, ограничения частоты запросов и диагностики ошибок.',
      },
    ],
    paragraphs: [
      {
        en: 'We do not collect your contacts, calendar, precise background location or advertising identifiers. The app contains no advertising or tracking SDKs.',
        ru: 'Мы не собираем ваши контакты, календарь, точную геолокацию в фоне и рекламные идентификаторы. В приложении нет рекламных и трекинговых SDK.',
      },
    ],
  },
  {
    title: { en: '3. What is public', ru: '3. Что видно другим пользователям' },
    paragraphs: [
      {
        en: 'PlayG is a community service, so most content is visible to other users: your username, avatar, city, sports, activity counters, as well as the grounds, events and reviews you create.',
        ru: 'PlayG — сервис сообщества, поэтому большая часть контента видна другим пользователям: имя, аватар, город, виды спорта, счётчики активности, а также созданные вами площадки, события и отзывы.',
      },
      {
        en: 'Photos (avatars, ground and profile photos) are stored in a public file repository and served by direct links. Treat uploaded images as public: do not upload documents, private photos or anything you would not want others to see.',
        ru: 'Фотографии (аватары, фото площадок и профиля) хранятся в публичном файловом репозитории и отдаются по прямым ссылкам. Считайте загруженные изображения публичными: не загружайте документы, личные фото и всё, что не хотите показывать другим.',
      },
      {
        en: 'Your email address is never shown to other users.',
        ru: 'Ваш адрес электронной почты никогда не показывается другим пользователям.',
      },
    ],
  },
  {
    title: { en: '4. Why we process data', ru: '4. Зачем мы обрабатываем данные' },
    bullets: [
      {
        en: 'To provide the service: registration, sign-in, showing grounds and events, saving favourites, publishing reviews.',
        ru: 'Чтобы предоставлять сервис: регистрация, вход, показ площадок и событий, сохранение избранного, публикация отзывов.',
      },
      {
        en: 'To keep the community safe: moderation of grounds and content, abuse prevention, rate limiting, investigating reports.',
        ru: 'Чтобы поддерживать безопасность сообщества: модерация площадок и контента, предотвращение злоупотреблений, ограничение частоты запросов, разбор жалоб.',
      },
      {
        en: 'To communicate with you: email confirmation, password reset, important service notices.',
        ru: 'Чтобы связываться с вами: подтверждение email, сброс пароля, важные сервисные уведомления.',
      },
      {
        en: 'To comply with law and enforce our Terms.',
        ru: 'Чтобы соблюдать законодательство и обеспечивать исполнение Условий использования.',
      },
    ],
    paragraphs: [
      {
        en: 'Where the law requires a legal basis for processing, we rely on: performance of our agreement with you for the core service; your consent for optional features such as location; our legitimate interest in security, abuse prevention and service improvement; and legal obligations where applicable. Where local law uses different concepts, we rely on the equivalent grounds and on the consent you give when creating an account or enabling optional features.',
        ru: 'Там, где закон требует правового основания обработки, мы опираемся на: исполнение нашего соглашения с вами для основного сервиса; ваше согласие для опциональных функций (геолокация); наш законный интерес в безопасности, предотвращении злоупотреблений и улучшении сервиса; и исполнение требований закона, где применимо. Если местное право использует иные конструкции, мы опираемся на равнозначные основания и на согласие, которое вы даёте при создании аккаунта или включении опциональных функций.',
      },
    ],
  },
  {
    title: { en: '5. Sharing and processors', ru: '5. Передача данных и подрядчики' },
    lead: {
      en: 'We do not sell your personal data and do not share it for advertising. We use a limited set of service providers that process data on our behalf:',
      ru: 'Мы не продаём ваши персональные данные и не передаём их для рекламы. Мы используем ограниченный круг подрядчиков, которые обрабатывают данные по нашему поручению:',
    },
    bullets: [
      {
        en: 'Hosting and database — Railway (application and PostgreSQL storage).',
        ru: 'Хостинг и база данных — Railway (приложение и хранилище PostgreSQL).',
      },
      {
        en: 'Image storage — GitHub (public repository for photos).',
        ru: 'Хранение изображений — GitHub (публичный репозиторий для фотографий).',
      },
      {
        en: 'Transactional email — Google (Gmail SMTP) for confirmation and password-reset messages.',
        ru: 'Транзакционные письма — Google (Gmail SMTP) для подтверждения email и сброса пароля.',
      },
      {
        en: 'Maps — Google Maps for map tiles and geocoding.',
        ru: 'Карты — Google Maps для карт и геокодирования.',
      },
      {
        en: 'Sign-in providers — Google and/or Facebook, if you choose social sign-in.',
        ru: 'Вход через соцсети — Google и/или Facebook, если вы выбираете такой способ входа.',
      },
    ],
    paragraphs: [
      {
        en: 'We may also disclose data if required by law, or to protect the rights and safety of users and the service.',
        ru: 'Мы можем раскрыть данные, если этого требует закон или если это необходимо для защиты прав и безопасности пользователей и сервиса.',
      },
      {
        en: 'Some providers are located outside your country. Where data is transferred across borders, we use appropriate safeguards (such as standard contractual clauses) and apply the same level of protection wherever the data is processed.',
        ru: 'Часть подрядчиков находится за пределами вашей страны. При трансграничной передаче данных мы используем надлежащие гарантии (например, стандартные договорные условия) и обеспечиваем одинаковый уровень защиты независимо от места обработки.',
      },
    ],
  },
  {
    title: { en: '6. How long we keep data', ru: '6. Сколько мы храним данные' },
    bullets: [
      {
        en: 'Account and profile data — until you delete your account.',
        ru: 'Данные аккаунта и профиля — до удаления аккаунта.',
      },
      {
        en: 'Your content (grounds, events, reviews, photos) — until you delete it or delete your account; some items may be kept in anonymised form for statistics.',
        ru: 'Ваш контент (площадки, события, отзывы, фото) — до удаления вами или до удаления аккаунта; часть данных может остаться в обезличенном виде для статистики.',
      },
      {
        en: 'Server logs — a short period, typically up to 30 days, for security and diagnostics.',
        ru: 'Серверные логи — ограниченный срок, как правило до 30 дней, для безопасности и диагностики.',
      },
      {
        en: 'Backups — up to 30 days, after which they are overwritten.',
        ru: 'Резервные копии — до 30 дней, после чего перезаписываются.',
      },
    ],
  },
  {
    title: { en: '7. Your rights', ru: '7. Ваши права' },
    paragraphs: [
      {
        en: 'Depending on the law of your country, you may have the right to access your data, correct it, delete it, restrict or object to processing, receive a copy in a portable format, and withdraw consent at any time. We provide these rights to all users, regardless of where you live.',
        ru: 'В зависимости от законодательства вашей страны вы можете иметь право на доступ к своим данным, их исправление, удаление, ограничение обработки или возражение против неё, получение копии в машиночитаемом виде и отзыв согласия в любой момент. Мы предоставляем эти права всем пользователям независимо от страны проживания.',
      },
      {
        en: 'You can delete your account and the associated content yourself: Profile → Delete account. Deletion is immediate; some data may remain in backups for up to 30 days.',
        ru: 'Вы можете удалить аккаунт и связанный контент самостоятельно: Профиль → «Удалить аккаунт». Удаление происходит сразу; часть данных может оставаться в резервных копиях до 30 дней.',
      },
      {
        en: `To exercise any other right, email us at ${LEGAL_META.contactEmail}. We answer within 30 days.`,
        ru: `Для реализации остальных прав напишите на ${LEGAL_META.contactEmail}. Мы отвечаем в течение 30 дней.`,
      },
      {
        en: 'If you believe your data was handled unlawfully, you may complain to the data protection or privacy authority of your country of residence, if one exists.',
        ru: 'Если вы считаете, что ваши данные обрабатывались незаконно, вы можете обратиться в орган по защите данных или приватности страны вашего проживания, если такой орган существует.',
      },
    ],
  },
  {
    title: { en: '8. Children', ru: '8. Дети' },
    paragraphs: [
      {
        en: 'PlayG is not intended for children under 13. If the law of your country sets a higher minimum age for online services, that age applies; users below it need consent of a parent or guardian where local law allows this.',
        ru: 'PlayG не предназначен для детей младше 13 лет. Если законодательство вашей страны устанавливает более высокий минимальный возраст для онлайн-сервисов, применяется он; лицам младше необходимо согласие родителей или опекунов там, где местное право это допускает.',
      },
      {
        en: 'If we learn that a child below the applicable minimum age created an account, we delete the account and its content.',
        ru: 'Если мы узнаём, что аккаунт создан ребёнком младше применимого минимального возраста, мы удаляем аккаунт и его контент.',
      },
    ],
  },
  {
    title: { en: '9. Security', ru: '9. Безопасность' },
    paragraphs: [
      {
        en: 'Data is transmitted over encrypted HTTPS connections, passwords are stored as bcrypt hashes, and access tokens are kept in the device secure storage (iOS Keychain / Android Keystore). Access to production data is limited to administrators, and the API applies rate limiting and access checks.',
        ru: 'Данные передаются по шифрованному HTTPS, пароли хранятся в виде bcrypt-хешей, а токены доступа — в защищённом хранилище устройства (iOS Keychain / Android Keystore). Доступ к продовым данным ограничен администраторами, API применяет ограничение частоты запросов и проверки прав.',
      },
      {
        en: 'No system is perfectly secure. If you suspect a problem with your account, contact us immediately.',
        ru: 'Ни одна система не защищена идеально. Если вы подозреваете проблему с аккаунтом — сразу напишите нам.',
      },
    ],
  },
  {
    title: { en: '10. Changes to this Policy', ru: '10. Изменения политики' },
    paragraphs: [
      {
        en: 'We may update this Policy when the app or the law changes. The current version and its effective date are shown at the top of this screen. Material changes are announced in the app; continued use after the effective date means you accept the updated Policy.',
        ru: 'Мы можем обновлять эту Политику при изменении приложения или законодательства. Актуальная версия и дата вступления в силу указаны в начале этого экрана. О существенных изменениях мы сообщаем в приложении; продолжение использования после даты вступления в силу означает согласие с обновлённой Политикой.',
      },
    ],
  },
  {
    title: { en: '11. Contact', ru: '11. Контакты' },
    paragraphs: [
      {
        en: `Operator: ${LEGAL_META.controller}. Email: ${LEGAL_META.contactEmail}. We reply to privacy requests within 30 days.`,
        ru: `Оператор: ${LEGAL_META.controller}. Email: ${LEGAL_META.contactEmail}. На запросы по персональным данным отвечаем в течение 30 дней.`,
      },
    ],
  },
];

// ============================================================
// TERMS OF USE
// ============================================================

export const TERMS_SECTIONS: LegalSection[] = [
  {
    title: { en: '1. Acceptance', ru: '1. Принятие условий' },
    paragraphs: [
      {
        en: 'By creating an account or using PlayG you agree to these Terms of Use and to our Privacy Policy. If you do not agree, please do not use the app.',
        ru: 'Создавая аккаунт или используя PlayG, вы соглашаетесь с настоящими Условиями использования и Политикой конфиденциальности. Если вы не согласны — не используйте приложение.',
      },
    ],
  },
  {
    title: { en: '2. Eligibility', ru: '2. Кто может пользоваться' },
    paragraphs: [
      {
        en: 'You must be at least 13 years old and, if the law of your country sets a higher minimum age for using online services, that age applies; users below it need consent of a parent or guardian where local law allows. You must also be legally capable of entering into this agreement. If you use PlayG on behalf of an organisation, you confirm that you are authorised to do so.',
        ru: 'Вам должно быть не менее 13 лет, а если законодательство вашей страны устанавливает более высокий минимальный возраст для использования онлайн-сервисов, применяется он; лицам младше необходимо согласие родителей или опекунов там, где местное право это допускает. Вы также должны обладать дееспособностью для заключения этого соглашения. Если вы используете PlayG от имени организации, вы подтверждаете наличие полномочий.',
      },
    ],
  },
  {
    title: { en: '3. Your account', ru: '3. Ваш аккаунт' },
    bullets: [
      {
        en: 'Provide accurate information and keep it up to date.',
        ru: 'Указывайте достоверную информацию и поддерживайте её в актуальном состоянии.',
      },
      {
        en: 'Keep your password and device secure; you are responsible for activity under your account.',
        ru: 'Обеспечьте безопасность пароля и устройства; вы отвечаете за действия в своём аккаунте.',
      },
      {
        en: 'One account per person. Do not create accounts to bypass moderation or restrictions.',
        ru: 'Один аккаунт на человека. Не создавайте аккаунты, чтобы обходить модерацию или ограничения.',
      },
      {
        en: 'You can delete your account at any time: Profile → Delete account.',
        ru: 'Вы можете удалить аккаунт в любой момент: Профиль → «Удалить аккаунт».',
      },
    ],
  },
  {
    title: { en: '4. Your content', ru: '4. Ваш контент' },
    paragraphs: [
      {
        en: 'You keep ownership of the content you create (grounds, events, reviews, photos). By publishing it in PlayG you grant us a non-exclusive, royalty-free, worldwide licence to store, display, resize and translate it within the service, for as long as it remains published.',
        ru: 'Вы сохраняете права на созданный контент (площадки, события, отзывы, фотографии). Публикуя его в PlayG, вы предоставляете нам неисключительную безвозмездную лицензию на хранение, отображение, масштабирование и перевод в рамках сервиса, пока контент опубликован.',
      },
      {
        en: 'You confirm that you have the rights to the content you upload (including photos of other people, with their consent) and that it does not infringe anyone else’s rights.',
        ru: 'Вы подтверждаете, что обладаете правами на загружаемый контент (включая фотографии других людей — с их согласия) и что он не нарушает права третьих лиц.',
      },
    ],
  },
  {
    title: { en: '5. Prohibited content and conduct', ru: '5. Запрещённый контент и поведение' },
    paragraphs: [
      {
        en: 'There is zero tolerance for objectionable content and abusive users. The following is not allowed:',
        ru: 'Мы не допускаем недопустимый контент и агрессивное поведение. Запрещено:',
      },
    ],
    bullets: [
      {
        en: 'Illegal content, incitement to violence, hatred or discrimination.',
        ru: 'Незаконный контент, призывы к насилию, ненависти или дискриминации.',
      },
      {
        en: 'Harassment, threats, stalking, doxxing, publishing other people’s private data.',
        ru: 'Преследование, угрозы, сталкинг, доксинг, публикация чужих персональных данных.',
      },
      {
        en: 'Sexual content, especially any content involving minors.',
        ru: 'Сексуальный контент, особенно любой контент с участием несовершеннолетних.',
      },
      {
        en: 'Spam, advertising, fraudulent events, false or misleading information about venues, prices or safety.',
        ru: 'Спам, реклама, фиктивные события, заведомо ложная информация о площадках, ценах или безопасности.',
      },
      {
        en: 'Infringing intellectual property, impersonation, malware, attempts to break or overload the service.',
        ru: 'Нарушение интеллектуальных прав, выдача себя за других, вредоносный код, попытки взломать или перегрузить сервис.',
      },
    ],
  },
  {
    title: { en: '6. Moderation and reporting', ru: '6. Модерация и жалобы' },
    paragraphs: [
      {
        en: 'New grounds pass moderation before appearing in public. We may review, hide, edit or delete any content and limit or terminate accounts that violate these Terms — with notice where reasonable.',
        ru: 'Новые площадки проходят модерацию перед публикацией. Мы можем проверить, скрыть, отредактировать или удалить любой контент, а также ограничить или закрыть аккаунты, нарушающие Условия, — по возможности с уведомлением.',
      },
      {
        en: `To report content, a user or a safety issue, email us at ${LEGAL_META.contactEmail} with a link to the item. We aim to review reports within 24 hours and remove content that violates these Terms.`,
        ru: `Чтобы пожаловаться на контент, пользователя или проблему безопасности, напишите на ${LEGAL_META.contactEmail} и приложите ссылку. Мы рассматриваем жалобы в течение 24 часов и удаляем контент, нарушающий Условия.`,
      },
    ],
  },
  {
    title: { en: '7. Real-world events and safety', ru: '7. Встречи в реальной жизни и безопасность' },
    paragraphs: [
      {
        en: 'PlayG is only a platform: events are created by users, not by us. We do not organise, supervise or verify events, participants, coaches or venues, and we do not guarantee that a ground exists, is open, free or safe.',
        ru: 'PlayG — только площадка-платформа: события создают пользователи, а не мы. Мы не организуем, не контролируем и не проверяем события, участников, тренеров и площадки, и не гарантируем, что площадка существует, открыта, свободна или безопасна.',
      },
      {
        en: 'You meet other people at your own risk. Choose public places, check the venue, tell someone where you go, and do not share more personal information than necessary. Minors should participate only with the consent of a parent or guardian.',
        ru: 'Вы встречаетесь с другими людьми на свой риск. Выбирайте публичные места, проверяйте площадку, сообщайте близким, куда идёте, и не делитесь лишними личными данными. Несовершеннолетние должны участвовать только с согласия родителей или опекунов.',
      },
      {
        en: 'Sport carries a risk of injury. You participate voluntarily and are responsible for your health, insurance and equipment.',
        ru: 'Спорт связан с риском травм. Вы участвуете добровольно и отвечаете за своё здоровье, страховку и экипировку.',
      },
    ],
  },
  {
    title: { en: '8. Third-party services', ru: '8. Сторонние сервисы' },
    paragraphs: [
      {
        en: 'The app uses maps and other services provided by third parties, and may link to external sites or messengers. Their terms and privacy policies apply to those services, and we are not responsible for their content or availability.',
        ru: 'Приложение использует карты и иные сервисы третьих лиц, а также может содержать ссылки на внешние сайты и мессенджеры. К таким сервисам применяются их условия и политики конфиденциальности; мы не отвечаем за их контент и доступность.',
      },
    ],
  },
  {
    title: { en: '9. Intellectual property', ru: '9. Интеллектуальная собственность' },
    paragraphs: [
      {
        en: 'The PlayG name, logo, design and code are protected by law and belong to their respective owners. We grant you a personal, non-transferable, non-exclusive licence to use the app for its intended purpose. You may not copy, reverse engineer or resell the app or its parts.',
        ru: 'Название PlayG, логотип, дизайн и код защищены законом и принадлежат правообладателям. Мы предоставляем вам личную, непередаваемую, неисключительную лицензию на использование приложения по назначению. Копировать, декомпилировать или перепродавать приложение и его части нельзя.',
      },
    ],
  },
  {
    title: { en: '10. Termination', ru: '10. Прекращение доступа' },
    paragraphs: [
      {
        en: 'You may stop using the service and delete your account at any time. We may suspend or terminate access if you materially breach these Terms or if required by law. Where reasonable, we give notice and the possibility to export your content first.',
        ru: 'Вы можете прекратить использование сервиса и удалить аккаунт в любой момент. Мы можем приостановить или прекратить доступ при существенном нарушении Условий или по требованию закона. По возможности мы предупреждаем заранее и даём возможность сохранить свой контент.',
      },
    ],
  },
  {
    title: { en: '11. Disclaimers', ru: '11. Отказ от гарантий' },
    paragraphs: [
      {
        en: 'The service is provided "as is" and "as available". To the extent permitted by law, we do not warrant that the service will be uninterrupted, error-free, or that the information about grounds, events and users is accurate or complete. Nothing in these Terms limits mandatory consumer rights.',
        ru: 'Сервис предоставляется «как есть» и «как доступно». В пределах, допускаемых законом, мы не гарантируем бесперебойную и безошибочную работу, а также точность и полноту информации о площадках, событиях и пользователях. Ничто в этих Условиях не ограничивает обязательные права потребителей.',
      },
    ],
  },
  {
    title: { en: '12. Limitation of liability', ru: '12. Ограничение ответственности' },
    paragraphs: [
      {
        en: 'To the extent permitted by law, we are not liable for indirect or consequential losses, lost profits or data, or for the conduct of users — including during real-world meetings — and our total liability is limited to the amount you paid us in the last 12 months (currently the service is free, so this is zero). This does not exclude liability that cannot be excluded by law.',
        ru: 'В пределах, допускаемых законом, мы не отвечаем за косвенные убытки, упущенную выгоду или данные, а также за поведение пользователей — включая встречи в реальной жизни; наша совокупная ответственность ограничена суммой, уплаченной вами за последние 12 месяцев (сейчас сервис бесплатный, то есть нулём). Это не исключает ответственность, которую нельзя исключить по закону.',
      },
    ],
  },
  {
    title: { en: '13. Governing law and disputes', ru: '13. Применимое право и споры' },
    paragraphs: [
      {
        en: `These Terms are governed by the laws of ${LEGAL_META.jurisdiction.en}, without prejudice to mandatory rules of your country of residence, which always prevail where they give you stronger protection. Before going to court, please contact us at ${LEGAL_META.contactEmail} — most issues can be solved directly, and you may also use any out-of-court dispute resolution available in your country.`,
        ru: `К этим Условиям применяется право: ${LEGAL_META.jurisdiction.ru}, без ущерба для обязательных норм страны вашего проживания, которые всегда имеют приоритет, если дают вам более сильную защиту. Прежде чем обращаться в суд, напишите нам на ${LEGAL_META.contactEmail} — большинство вопросов решается напрямую; вы также можете воспользоваться доступными в вашей стране способами внесудебного урегулирования споров.`,
      },
    ],
  },
  {
    title: { en: '14. App Store and Google Play', ru: '14. App Store и Google Play' },
    paragraphs: [
      {
        en: 'These Terms are between you and us, not with Apple or Google. Apple and Google are not responsible for the app or its content, and provide no warranty or support for it. If you use the iOS app, Apple is a third-party beneficiary of these Terms and may enforce them against you. Your use of the stores is also subject to their own terms.',
        ru: 'Эти Условия заключаются между вами и нами, а не с Apple или Google. Apple и Google не отвечают за приложение и его контент и не предоставляют по нему гарантий или поддержки. При использовании iOS-приложения Apple является выгодоприобретателем этих Условий и может требовать их исполнения. Использование магазинов также регулируется их собственными условиями.',
      },
    ],
  },
  {
    title: { en: '15. Changes to these Terms', ru: '15. Изменения условий' },
    paragraphs: [
      {
        en: 'We may update these Terms. The current version and effective date are shown at the top of this screen. If changes are material, we notify you in the app before they take effect; continued use after the effective date means acceptance.',
        ru: 'Мы можем обновлять эти Условия. Актуальная версия и дата вступления в силу указаны в начале экрана. О существенных изменениях мы сообщаем в приложении заранее; продолжение использования после даты вступления в силу означает согласие.',
      },
    ],
  },
  {
    title: { en: '16. Contact', ru: '16. Контакты' },
    paragraphs: [
      {
        en: `Questions about these Terms: ${LEGAL_META.contactEmail}.`,
        ru: `Вопросы по этим Условиям: ${LEGAL_META.contactEmail}.`,
      },
    ],
  },
];
