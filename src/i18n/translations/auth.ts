// src/i18n/translations/auth.ts
import type { TranslationDict } from '../types';

export const auth: TranslationDict = {
  // ===== WELCOME =====
  'auth.welcome.title': { en: 'Discover sports near you.', ru: 'Находите спорт рядом с вами.', be: 'Знаходзьце спорт побач з вамі.', lt: 'Atraskite sportą šalia savęs.', pl: 'Odkrywaj sport w swojej okolicy.', uk: 'Знаходьте спорт поруч із вами.' },
  'auth.welcome.subtitle': { en: 'Sign in to join games, create events and save favourite grounds.', ru: 'Войдите, чтобы присоединяться к играм, создавать события и сохранять любимые площадки.', be: 'Увайдзіце, каб далучацца да гульняў, ствараць падзеі і захоўваць любімыя пляцоўкі.', lt: 'Prisijunkite, kad galėtumėte prisijungti prie žaidimų, kurti renginius ir išsaugoti mėgstamas aikšteles.', pl: 'Zaloguj się, aby dołączać do gier, tworzyć wydarzenia i zapisywać ulubione boiska.', uk: 'Увійдіть, щоб долучатися до ігор, створювати події та зберігати улюблені майданчики.' },
  'auth.welcome.bullet1': { en: 'Join local games in one tap', ru: 'Присоединяйтесь к играм в одно касание', be: 'Далучайцеся да гульняў у адно дотык', lt: 'Prisijunkite prie žaidimų vienu paspaudimu', pl: 'Dołączaj do gier jednym dotknięciem', uk: 'Долучайтеся до ігор одним дотиком' },
  'auth.welcome.bullet2': { en: 'Save the grounds you love', ru: 'Сохраняйте любимые площадки', be: 'Захоўвайце любімыя пляцоўкі', lt: 'Išsaugokite mėgstamas aikšteles', pl: 'Zapisuj ulubione boiska', uk: 'Зберігайте улюблені майданчики' },
  'auth.welcome.bullet3': { en: 'Host and manage your own events', ru: 'Организуйте и управляйте своими событиями', be: 'Арганізоўвайце і кіруйце сваімі падзеямі', lt: 'Organizuokite ir valdykite savo renginius', pl: 'Organizuj i zarządzaj własnymi wydarzeniami', uk: 'Організовуйте та керуйте власними подіями' },
  'auth.welcome.getStarted': { en: 'Get started', ru: 'Начать', be: 'Пачаць', lt: 'Pradėti', pl: 'Rozpocznij', uk: 'Почати' },

  // ===== SIGN IN =====
  'auth.signIn.title': { en: 'Welcome back', ru: 'С возвращением', be: 'З вяртаннем', lt: 'Sveiki sugrįžę', pl: 'Witaj ponownie', uk: 'З поверненням' },
  'auth.signIn.subtitle': { en: 'Sign in to join games, save grounds and host events.', ru: 'Войдите, чтобы присоединяться к играм, сохранять площадки и создавать события.', be: 'Увайдзіце, каб далучацца да гульняў, захоўваць пляцоўкі і ствараць падзеі.', lt: 'Prisijunkite, kad galėtumėte prisijungti prie žaidimų, išsaugoti aikšteles ir kurti renginius.', pl: 'Zaloguj się, aby dołączać do gier, zapisywać boiska i tworzyć wydarzenia.', uk: 'Увійдіть, щоб долучатися до ігор, зберігати майданчики та створювати події.' },
  'auth.email': { en: 'Email', ru: 'Электронная почта', be: 'Электронная пошта', lt: 'El. paštas', pl: 'E-mail', uk: 'Електронна пошта' },
  'auth.password': { en: 'Password', ru: 'Пароль', be: 'Пароль', lt: 'Slaptažodis', pl: 'Hasło', uk: 'Пароль' },
  'auth.forgotPassword': { en: 'Forgot password?', ru: 'Забыли пароль?', be: 'Забылі пароль?', lt: 'Pamiršote slaptažodį?', pl: 'Nie pamiętasz hasła?', uk: 'Забули пароль?' },
  'auth.signIn.button': { en: 'Sign in', ru: 'Войти', be: 'Увайсці', lt: 'Prisijungti', pl: 'Zaloguj się', uk: 'Увійти' },
  'auth.signIn.newTo': { en: 'New to PlayG? ', ru: 'Впервые в PlayG? ', be: 'Упершыню ў PlayG? ', lt: 'Naujas PlayG? ', pl: 'Nowy w PlayG? ', uk: 'Вперше в PlayG? ' },
  'auth.signIn.createAccount': { en: 'Create an account', ru: 'Создать аккаунт', be: 'Стварыць акаўнт', lt: 'Sukurti paskyrą', pl: 'Utwórz konto', uk: 'Створити акаунт' },
  'auth.continueAsGuest': { en: 'Continue browsing as guest', ru: 'Продолжить как гость', be: 'Працягнуць як госць', lt: 'Tęsti kaip svečias', pl: 'Kontynuuj jako gość', uk: 'Продовжити як гість' },

  // ===== SIGN UP =====
  'auth.signUp.title': { en: 'Create your account', ru: 'Создайте аккаунт', be: 'Стварыце акаўнт', lt: 'Sukurkite paskyrą', pl: 'Utwórz konto', uk: 'Створіть акаунт' },
  'auth.signUp.subtitle': { en: 'Join PlayG to find grounds and play with people near you.', ru: 'Присоединяйтесь к PlayG, чтобы находить площадки и играть с людьми рядом.', be: 'Далучайцеся да PlayG, каб знаходзіць пляцоўкі і гуляць з людзьмі побач.', lt: 'Prisijunkite prie PlayG, kad rastumėte aikšteles ir žaistumėte su žmonėmis netoliese.', pl: 'Dołącz do PlayG, aby znajdować boiska i grać z ludźmi w pobliżu.', uk: 'Долучайтеся до PlayG, щоб знаходити майданчики та грати з людьми поруч.' },
  'auth.fullName': { en: 'Full name', ru: 'Полное имя', be: 'Поўнае імя', lt: 'Pilnas vardas', pl: 'Pełne imię', uk: 'Повне імʼя' },
  'auth.passwordMin6': { en: 'Password (min 6 chars)', ru: 'Пароль (мин. 6 символов)', be: 'Пароль (мін. 6 сімвалаў)', lt: 'Slaptažodis (min. 6 simboliai)', pl: 'Hasło (min. 6 znaków)', uk: 'Пароль (мін. 6 символів)' },
  'auth.confirmPassword': { en: 'Confirm password', ru: 'Подтвердите пароль', be: 'Пацвердзіце пароль', lt: 'Patvirtinkite slaptažodį', pl: 'Potwierdź hasło', uk: 'Підтвердіть пароль' },
  'auth.passwordsDoNotMatch': { en: 'Passwords do not match', ru: 'Пароли не совпадают', be: 'Паролі не супадаюць', lt: 'Slaptažodžiai nesutampa', pl: 'Hasła nie są identyczne', uk: 'Паролі не збігаються' },
  'auth.createAccountButton': { en: 'Create account', ru: 'Создать аккаунт', be: 'Стварыць акаўнт', lt: 'Sukurti paskyrą', pl: 'Utwórz konto', uk: 'Створити акаунт' },
  'auth.alreadyHaveAccount': { en: 'Already have an account? ', ru: 'Уже есть аккаунт? ', be: 'Ужо ёсць акаўнт? ', lt: 'Jau turite paskyrą? ', pl: 'Masz już konto? ', uk: 'Вже маєте акаунт? ' },

  // ===== VERIFY CODE =====
  'auth.verify.title': { en: 'Verify your email', ru: 'Подтвердите email', be: 'Пацвердзіце email', lt: 'Patvirtinkite el. paštą', pl: 'Potwierdź swój e-mail', uk: 'Підтвердіть email' },
  'auth.verify.subtitle': { en: 'Enter the 6-digit confirmation code we sent to your inbox.', ru: 'Введите 6-значный код подтверждения из письма.', be: 'Увядзіце 6-значны код пацверджання з ліста.', lt: 'Įveskite 6 skaitmenų patvirtinimo kodą, kurį išsiuntėme į jūsų paštą.', pl: 'Wprowadź 6-cyfrowy kod potwierdzający wysłany na Twój e-mail.', uk: 'Введіть 6-значний код підтвердження, який ми надіслали на вашу пошту.' },
  'auth.verify.button': { en: 'Verify code', ru: 'Подтвердить код', be: 'Пацвердзіць код', lt: 'Patvirtinti kodą', pl: 'Potwierdź kod', uk: 'Підтвердити код' },
  'auth.verify.resendIn': { en: 'Resend code in {{count}}s', ru: 'Отправить код повторно через {{count}}с', be: 'Адправіць код паўторна праз {{count}}с', lt: 'Siųsti kodą iš naujo po {{count}}s', pl: 'Wyślij kod ponownie za {{count}}s', uk: 'Надіслати код повторно через {{count}}с' },
  'auth.verify.resend': { en: 'Resend verification code', ru: 'Отправить код повторно', be: 'Адправіць код паўторна', lt: 'Siųsti kodą iš naujo', pl: 'Wyślij kod ponownie', uk: 'Надіслати код повторно' },
  'auth.verify.backToRegistration': { en: 'Back to registration', ru: 'Назад к регистрации', be: 'Назад да рэгістрацыі', lt: 'Grįžti į registraciją', pl: 'Powrót do rejestracji', uk: 'Назад до реєстрації' },
  'auth.verify.successTitle': { en: 'Verification Success', ru: 'Успешное подтверждение', be: 'Паспяховае пацверджанне', lt: 'Patvirtinta sėkmingai', pl: 'Potwierdzenie powiodło się', uk: 'Успішне підтвердження' },
  'auth.verify.successMessage': { en: 'Account activated successfully! Please sign in.', ru: 'Аккаунт успешно активирован! Войдите.', be: 'Акаўнт паспяхова актываваны! Увайдзіце.', lt: 'Paskyra sėkmingai aktyvuota! Prisijunkite.', pl: 'Konto zostało pomyślnie aktywowane! Zaloguj się.', uk: 'Акаунт успішно активовано! Увійдіть.' },

  // ===== FORGOT PASSWORD =====
  'auth.forgot.title': { en: 'Forgot password?', ru: 'Забыли пароль?', be: 'Забылі пароль?', lt: 'Pamiršote slaptažodį?', pl: 'Nie pamiętasz hasła?', uk: 'Забули пароль?' },
  'auth.forgot.subtitle': { en: "Enter your email — we'll send a 6-digit code to reset your password.", ru: 'Введите email — мы отправим 6-значный код для сброса пароля.', be: 'Увядзіце email — мы дашлём 6-значны код для скіду пароля.', lt: 'Įveskite el. paštą — išsiųsime 6 skaitmenų kodą slaptažodžiui atkurti.', pl: 'Podaj e-mail — wyślemy 6-cyfrowy kod do zresetowania hasła.', uk: 'Введіть email — ми надішлемо 6-значний код для скидання пароля.' },
  'auth.forgot.sendCode': { en: 'Send reset code', ru: 'Отправить код', be: 'Адправіць код', lt: 'Siųsti kodą', pl: 'Wyślij kod', uk: 'Надіслати код' },
  'auth.forgot.backToSignIn': { en: '← Back to sign in', ru: '← Назад ко входу', be: '← Назад да ўваходу', lt: '← Atgal į prisijungimą', pl: '← Powrót do logowania', uk: '← Назад до входу' },

  // ===== RESET PASSWORD =====
  'auth.reset.title': { en: 'Set new password', ru: 'Установите новый пароль', be: 'Усталюйце новы пароль', lt: 'Nustatykite naują slaptažodį', pl: 'Ustaw nowe hasło', uk: 'Встановіть новий пароль' },
  'auth.reset.subtitle': { en: 'We sent a 6-digit code to {{email}}. Enter it below and choose a new password.', ru: 'Мы отправили 6-значный код на {{email}}. Введите его и выберите новый пароль.', be: 'Мы даслалі 6-значны код на {{email}}. Увядзіце яго і выберыце новы пароль.', lt: 'Išsiuntėme 6 skaitmenų kodą į {{email}}. Įveskite jį ir pasirinkite naują slaptažodį.', pl: 'Wysłaliśmy 6-cyfrowy kod na {{email}}. Wprowadź go i wybierz nowe hasło.', uk: 'Ми надіслали 6-значний код на {{email}}. Введіть його та виберіть новий пароль.' },
  'auth.reset.newPassword': { en: 'New password (min 6)', ru: 'Новый пароль (мин. 6)', be: 'Новы пароль (мін. 6)', lt: 'Naujas slaptažodis (min. 6)', pl: 'Nowe hasło (min. 6)', uk: 'Новий пароль (мін. 6)' },
  'auth.reset.confirmNewPassword': { en: 'Confirm new password', ru: 'Подтвердите новый пароль', be: 'Пацвердзіце новы пароль', lt: 'Patvirtinkite naują slaptažodį', pl: 'Potwierdź nowe hasło', uk: 'Підтвердіть новий пароль' },
  'auth.reset.button': { en: 'Reset password', ru: 'Сбросить пароль', be: 'Скінуць пароль', lt: 'Atkurti slaptažodį', pl: 'Zresetuj hasło', uk: 'Скинути пароль' },
  'auth.reset.resend': { en: 'Resend code', ru: 'Отправить код повторно', be: 'Адправіць код паўторна', lt: 'Siųsti kodą iš naujo', pl: 'Wyślij kod ponownie', uk: 'Надіслати код повторно' },
  'auth.reset.successTitle': { en: 'Success', ru: 'Успешно', be: 'Поспех', lt: 'Pavyko', pl: 'Sukces', uk: 'Успішно' },
  'auth.reset.successMessage': { en: 'Password changed. Please sign in.', ru: 'Пароль изменён. Войдите.', be: 'Пароль зменены. Увайдзіце.', lt: 'Slaptažodis pakeistas. Prisijunkite.', pl: 'Hasło zostało zmienione. Zaloguj się.', uk: 'Пароль змінено. Увійдіть.' },

  // ===== ERRORS =====
  'auth.error.registrationFailed': { en: 'Registration failed.', ru: 'Ошибка регистрации.', be: 'Памылка рэгістрацыі.', lt: 'Registracija nepavyko.', pl: 'Rejestracja nie powiodła się.', uk: 'Помилка реєстрації.' },
  'auth.error.invalidCredentials': { en: 'Invalid email or password.', ru: 'Неверный email или пароль.', be: 'Няправільны email або пароль.', lt: 'Neteisingas el. paštas arba slaptažodis.', pl: 'Nieprawidłowy e-mail lub hasło.', uk: 'Невірний email або пароль.' },
  'auth.error.accountUnverified': { en: 'Your account is unverified. We sent a new code to your email.', ru: 'Аккаунт не подтверждён. Мы отправили новый код на ваш email.', be: 'Акаўнт не пацверджаны. Мы даслалі новы код на ваш email.', lt: 'Paskyra nepatvirtinta. Išsiuntėme naują kodą į jūsų el. paštą.', pl: 'Konto nie zostało potwierdzone. Wysłaliśmy nowy kod na Twój e-mail.', uk: 'Акаунт не підтверджено. Ми надіслали новий код на вашу пошту.' },
  'auth.error.codeSent': { en: 'Code Sent', ru: 'Код отправлен', be: 'Код адпраўлены', lt: 'Kodas išsiųstas', pl: 'Kod wysłany', uk: 'Код надіслано' },
  'auth.error.newCodeSent': { en: 'A new code has been sent to your email.', ru: 'Новый код отправлен на ваш email.', be: 'Новы код адпраўлены на ваш email.', lt: 'Naujas kodas išsiųstas į jūsų el. paštą.', pl: 'Nowy kod został wysłany na Twój e-mail.', uk: 'Новий код надіслано на вашу пошту.' },
  'auth.error.invalidCode': { en: 'Invalid or expired code.', ru: 'Неверный или просроченный код.', be: 'Няправільны або пратэрмінаваны код.', lt: 'Neteisingas arba pasibaigęs kodas.', pl: 'Nieprawidłowy lub wygasły kod.', uk: 'Невірний або прострочений код.' },
  'auth.error.couldNotSendCode': { en: 'Could not send code.', ru: 'Не удалось отправить код.', be: 'Не ўдалося адправіць код.', lt: 'Nepavyko išsiųsti kodo.', pl: 'Nie udało się wysłać kodu.', uk: 'Не вдалося надіслати код.' },
  'auth.error.missingEmail': { en: 'Missing email.', ru: 'Отсутствует email.', be: 'Адсутнічае email.', lt: 'Trūksta el. pašto.', pl: 'Brak adresu e-mail.', uk: 'Відсутня електронна пошта.' },
};