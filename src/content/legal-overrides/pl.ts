// src/content/legal-overrides/pl.ts
/**
 * ✅ Полный польский перевод юридических документов.
 *
 * Структура должна совпадать с базовой в content/legal.ts (то же число
 * разделов, тот же порядок, то же количество пунктов) — иначе экран
 * покажет английскую/русскую версию, чтобы не «съехать».
 *
 * Юридически значимой остаётся английская версия; перевод — для удобства.
 */
import { LEGAL_META, RenderedSection } from '../legal';

export const PL_PRIVACY: RenderedSection[] = [
  {
    title: '1. Kto jest administratorem',
    paragraphs: [
      `PlayG to aplikacja mobilna, która pomaga znajdować boiska i place sportowe, tworzyć wydarzenia sportowe i do nich dołączać oraz zostawiać opinie. Usługę świadczy ${LEGAL_META.controller} („my”).`,
      `W sprawach dotyczących prywatności oraz w celu realizacji swoich praw napisz do nas: ${LEGAL_META.contactEmail}.`,
    ],
  },
  {
    title: '2. Jakie dane zbieramy',
    bullets: [
      'Dane konta: nazwa użytkownika, adres e-mail, hasło (przechowywane wyłącznie jako hash bcrypt, nigdy w postaci jawnej) oraz informacja o potwierdzeniu adresu e-mail.',
      'Dane profilu, które dodajesz: awatar i zdjęcia profilowe, krótki opis, ulubione dyscypliny sportu i miasto.',
      'Treści, które tworzysz: boiska (nazwa, dyscypliny, nawierzchnia, udogodnienia, adres, opis), wydarzenia (nazwa, data, godzina, czas trwania, poziom, liczba graczy), opinie (ocena, komentarz) oraz polubienia.',
      'Ulubione: które boiska zapisałeś.',
      'Lokalizacja: tylko gdy włączone jest ustawienie „Używaj mojej lokalizacji”. Używamy współrzędnych, aby pokazać pobliskie boiska i rozpoznać miasto. Możesz to wyłączyć w każdej chwili w Ustawieniach; mapa nadal działa z domyślnym miastem.',
      'Dane techniczne: adres IP, czas żądania oraz wersja aplikacji/urządzenia w logach serwera — w celu bezpieczeństwa, ograniczania liczby żądań i diagnozowania błędów.',
    ],
    paragraphs: [
      'Nie zbieramy Twoich kontaktów, kalendarza, dokładnej lokalizacji w tle ani identyfikatorów reklamowych. Aplikacja nie zawiera reklamowych ani śledzących SDK.',
    ],
  },
  {
    title: '3. Co jest publiczne',
    paragraphs: [
      'PlayG to usługa społecznościowa, dlatego większość treści jest widoczna dla innych użytkowników: nazwa użytkownika, awatar, miasto, dyscypliny, liczniki aktywności, a także tworzone przez Ciebie boiska, wydarzenia i opinie.',
      'Zdjęcia (awatary, zdjęcia boisk i profilowe) są przechowywane w publicznym repozytorium plików i udostępniane bezpośrednimi linkami. Traktuj dodawane obrazy jako publiczne: nie dodawaj dokumentów, prywatnych zdjęć ani niczego, czego nie chcesz pokazywać innym.',
      'Twój adres e-mail nigdy nie jest pokazywany innym użytkownikom.',
    ],
  },
  {
    title: '4. Po co przetwarzamy dane',
    bullets: [
      'Aby świadczyć usługę: rejestracja, logowanie, pokazywanie boisk i wydarzeń, zapisywanie ulubionych, publikowanie opinii.',
      'Aby zapewnić bezpieczeństwo społeczności: moderacja boisk i treści, zapobieganie nadużyciom, ograniczanie liczby żądań, rozpatrywanie zgłoszeń.',
      'Aby się z Tobą komunikować: potwierdzenie e-mail, reset hasła, ważne komunikaty serwisowe.',
      'Aby przestrzegać prawa i egzekwować nasz Regulamin.',
    ],
    paragraphs: [
      'Tam, gdzie prawo wymaga podstawy prawnej przetwarzania, opieramy się na: wykonaniu naszej umowy z Tobą w zakresie podstawowej usługi; Twojej zgodzie w przypadku funkcji opcjonalnych, takich jak lokalizacja; naszym uzasadnionym interesie w zakresie bezpieczeństwa, zapobiegania nadużyciom i ulepszania usługi; oraz obowiązkach prawnych, gdy mają zastosowanie. Jeśli lokalne prawo używa innych konstrukcji, opieramy się na równoważnych podstawach oraz na zgodzie udzielanej przy tworzeniu konta lub włączaniu funkcji opcjonalnych.',
    ],
  },
  {
    title: '5. Udostępnianie danych i podmioty przetwarzające',
    lead:
      'Nie sprzedajemy Twoich danych osobowych ani nie udostępniamy ich w celach reklamowych. Korzystamy z ograniczonego grona dostawców, którzy przetwarzają dane na nasze polecenie:',
    bullets: [
      'Hosting i baza danych — Railway (aplikacja i baza PostgreSQL).',
      'Przechowywanie zdjęć — GitHub (publiczne repozytorium zdjęć).',
      'E-maile transakcyjne — Google (Gmail SMTP) do potwierdzeń i resetu hasła.',
      'Mapy — Google Maps do kafelków mapy i geokodowania.',
      'Dostawcy logowania — Google i/lub Facebook, jeśli wybierzesz logowanie społecznościowe.',
    ],
    paragraphs: [
      'Możemy również ujawnić dane, jeśli wymaga tego prawo lub jeśli jest to konieczne do ochrony praw i bezpieczeństwa użytkowników oraz usługi.',
      'Niektórzy dostawcy znajdują się poza Twoim krajem. W przypadku transgranicznego przekazywania danych stosujemy odpowiednie zabezpieczenia (np. standardowe klauzule umowne) i zapewniamy ten sam poziom ochrony niezależnie od miejsca przetwarzania.',
    ],
  },
  {
    title: '6. Jak długo przechowujemy dane',
    bullets: [
      'Dane konta i profilu — do usunięcia konta.',
      'Twoje treści (boiska, wydarzenia, opinie, zdjęcia) — do ich usunięcia przez Ciebie lub do usunięcia konta; część danych może pozostać w formie zanonimizowanej do celów statystycznych.',
      'Logi serwera — ograniczony okres, zwykle do 30 dni, w celach bezpieczeństwa i diagnostyki.',
      'Kopie zapasowe — do 30 dni, po czym są nadpisywane.',
    ],
  },
  {
    title: '7. Twoje prawa',
    paragraphs: [
      'W zależności od prawa Twojego kraju możesz mieć prawo dostępu do swoich danych, ich sprostowania, usunięcia, ograniczenia przetwarzania lub wniesienia sprzeciwu, otrzymania kopii w formacie przenośnym oraz wycofania zgody w każdej chwili. Prawa te zapewniamy wszystkim użytkownikom, niezależnie od miejsca zamieszkania.',
      'Możesz samodzielnie usunąć konto i powiązane treści: Profil → Usuń konto. Usunięcie następuje natychmiast; część danych może pozostać w kopiach zapasowych do 30 dni.',
      `Aby skorzystać z pozostałych praw, napisz do nas: ${LEGAL_META.contactEmail}. Odpowiadamy w ciągu 30 dni.`,
      'Jeśli uważasz, że Twoje dane były przetwarzane niezgodnie z prawem, możesz złożyć skargę do organu ochrony danych osobowych lub prywatności w swoim kraju zamieszkania, jeśli taki organ istnieje.',
    ],
  },
  {
    title: '8. Dzieci',
    paragraphs: [
      'PlayG nie jest przeznaczony dla dzieci poniżej 13 lat. Jeśli prawo Twojego kraju przewiduje wyższy minimalny wiek korzystania z usług online, stosuje się ten wiek; osoby młodsze potrzebują zgody rodzica lub opiekuna, jeśli lokalne prawo na to pozwala.',
      'Jeśli dowiemy się, że konto zostało utworzone przez osobę poniżej obowiązującego minimalnego wieku, usuniemy konto i jego treści.',
    ],
  },
  {
    title: '9. Bezpieczeństwo',
    paragraphs: [
      'Dane są przesyłane przez szyfrowane połączenia HTTPS, hasła są przechowywane jako hashe bcrypt, a tokeny dostępu — w bezpiecznym magazynie urządzenia (iOS Keychain / Android Keystore). Dostęp do danych produkcyjnych mają wyłącznie administratorzy, a API stosuje ograniczanie liczby żądań i kontrole uprawnień.',
      'Żaden system nie jest w pełni bezpieczny. Jeśli podejrzewasz problem ze swoim kontem, napisz do nas natychmiast.',
    ],
  },
  {
    title: '10. Zmiany niniejszej Polityki',
    paragraphs: [
      'Możemy aktualizować tę Politykę, gdy zmienia się aplikacja lub prawo. Aktualna wersja i data jej wejścia w życie są wskazane na początku tego ekranu. O istotnych zmianach informujemy w aplikacji; dalsze korzystanie po dacie wejścia w życie oznacza akceptację zaktualizowanej Polityki.',
    ],
  },
  {
    title: '11. Kontakt',
    paragraphs: [
      `Operator: ${LEGAL_META.controller}. E-mail: ${LEGAL_META.contactEmail}. Na wnioski dotyczące danych osobowych odpowiadamy w ciągu 30 dni.`,
    ],
  },
];

export const PL_TERMS: RenderedSection[] = [
  {
    title: '1. Akceptacja',
    paragraphs: [
      'Tworząc konto lub korzystając z PlayG, akceptujesz niniejszy Regulamin oraz naszą Politykę prywatności. Jeśli nie akceptujesz — nie korzystaj z aplikacji.',
    ],
  },
  {
    title: '2. Kto może korzystać',
    paragraphs: [
      'Musisz mieć co najmniej 13 lat, a jeśli prawo Twojego kraju przewiduje wyższy minimalny wiek korzystania z usług online, stosuje się ten wiek; osoby młodsze potrzebują zgody rodzica lub opiekuna, jeśli lokalne prawo na to pozwala. Musisz także mieć zdolność do zawarcia tej umowy. Jeśli korzystasz z PlayG w imieniu organizacji, potwierdzasz swoje umocowanie.',
    ],
  },
  {
    title: '3. Twoje konto',
    bullets: [
      'Podawaj prawdziwe dane i aktualizuj je.',
      'Zadbaj o bezpieczeństwo hasła i urządzenia; odpowiadasz za działania wykonywane na Twoim koncie.',
      'Jedno konto na osobę. Nie twórz kont, aby obchodzić moderację lub ograniczenia.',
      'Możesz w każdej chwili usunąć konto: Profil → Usuń konto.',
    ],
  },
  {
    title: '4. Twoje treści',
    paragraphs: [
      'Zachowujesz prawa do tworzonych treści (boisk, wydarzeń, opinii, zdjęć). Publikując je w PlayG, udzielasz nam nieodpłatnej, niewyłącznej licencji na przechowywanie, wyświetlanie, skalowanie i tłumaczenie ich w ramach usługi, dopóki treść pozostaje opublikowana.',
      'Potwierdzasz, że masz prawa do dodawanych treści (w tym do zdjęć innych osób — za ich zgodą) oraz że nie naruszają one praw osób trzecich.',
    ],
  },
  {
    title: '5. Zakazane treści i zachowania',
    paragraphs: [
      'Nie tolerujemy niedozwolonych treści ani agresywnych zachowań. Zabronione jest:',
    ],
    bullets: [
      'Treści niezgodne z prawem, nawoływanie do przemocy, nienawiści lub dyskryminacji.',
      'Nękanie, groźby, prześladowanie, ujawnianie danych osobowych innych osób.',
      'Treści o charakterze seksualnym, w szczególności z udziałem osób nieletnich.',
      'Spam, reklama, fikcyjne wydarzenia, nieprawdziwe informacje o boiskach, cenach lub bezpieczeństwie.',
      'Naruszenia własności intelektualnej, podszywanie się pod inne osoby, złośliwy kod, próby włamania się do usługi lub jej przeciążenia.',
    ],
  },
  {
    title: '6. Moderacja i zgłoszenia',
    paragraphs: [
      'Nowe boiska przechodzą moderację przed publikacją. Możemy sprawdzić, ukryć, edytować lub usunąć każdą treść, a także ograniczyć lub zamknąć konta naruszające Regulamin — w miarę możliwości z powiadomieniem.',
      `Aby zgłosić treść, użytkownika lub problem bezpieczeństwa, napisz do nas: ${LEGAL_META.contactEmail} i dołącz link. Zgłoszenia rozpatrujemy w ciągu 24 godzin i usuwamy treści naruszające Regulamin.`,
    ],
  },
  {
    title: '7. Spotkania w rzeczywistości i bezpieczeństwo',
    paragraphs: [
      'PlayG jest wyłącznie platformą: wydarzenia tworzą użytkownicy, a nie my. Nie organizujemy, nie nadzorujemy ani nie weryfikujemy wydarzeń, uczestników, trenerów ani boisk i nie gwarantujemy, że boisko istnieje, jest otwarte, wolne lub bezpieczne.',
      'Spotykasz się z innymi ludźmi na własne ryzyko. Wybieraj miejsca publiczne, sprawdzaj obiekt, informuj bliskich, dokąd idziesz, i nie udostępniaj więcej danych osobowych niż to konieczne. Osoby niepełnoletnie powinny uczestniczyć wyłącznie za zgodą rodzica lub opiekuna.',
      'Sport wiąże się z ryzykiem kontuzji. Uczestniczysz dobrowolnie i odpowiadasz za swoje zdrowie, ubezpieczenie i sprzęt.',
    ],
  },
  {
    title: '8. Usługi stron trzecich',
    paragraphs: [
      'Aplikacja korzysta z map i innych usług świadczonych przez strony trzecie oraz może zawierać linki do zewnętrznych stron i komunikatorów. Do tych usług stosują się ich warunki i polityki prywatności; nie odpowiadamy za ich treść ani dostępność.',
    ],
  },
  {
    title: '9. Własność intelektualna',
    paragraphs: [
      'Nazwa PlayG, logo, wygląd i kod są chronione prawem i należą do ich właścicieli. Udzielamy Ci osobistej, nieprzenoszalnej, niewyłącznej licencji na korzystanie z aplikacji zgodnie z jej przeznaczeniem. Kopiowanie, dekompilacja ani odsprzedaż aplikacji lub jej części nie są dozwolone.',
    ],
  },
  {
    title: '10. Zakończenie korzystania',
    paragraphs: [
      'Możesz w każdej chwili przestać korzystać z usługi i usunąć konto. Możemy zawiesić lub zakończyć dostęp w przypadku istotnego naruszenia Regulaminu lub gdy wymaga tego prawo. W miarę możliwości informujemy wcześniej i dajemy możliwość zachowania swoich treści.',
    ],
  },
  {
    title: '11. Wyłączenie gwarancji',
    paragraphs: [
      'Usługa jest świadczona „tak jak jest” i „w miarę dostępności”. W zakresie dozwolonym przez prawo nie gwarantujemy nieprzerwanego i bezbłędnego działania ani dokładności i kompletności informacji o boiskach, wydarzeniach i użytkownikach. Żadne postanowienie Regulaminu nie ogranicza obowiązkowych praw konsumenta.',
    ],
  },
  {
    title: '12. Ograniczenie odpowiedzialności',
    paragraphs: [
      'W zakresie dozwolonym przez prawo nie odpowiadamy za szkody pośrednie, utracone korzyści lub utratę danych ani za zachowania użytkowników — w tym podczas spotkań w rzeczywistości; nasza łączna odpowiedzialność jest ograniczona do kwoty wpłaconej nam w ciągu ostatnich 12 miesięcy (obecnie usługa jest bezpłatna, czyli wynosi zero). Nie wyłącza to odpowiedzialności, której nie można wyłączyć na mocy prawa.',
    ],
  },
  {
    title: '13. Prawo właściwe i spory',
    paragraphs: [
      `Do niniejszego Regulaminu stosuje się prawo: ${LEGAL_META.jurisdiction.pl}, bez uszczerbku dla bezwzględnie obowiązujących przepisów kraju Twojego zamieszkania, które zawsze mają pierwszeństwo, jeśli zapewniają silniejszą ochronę. Przed skierowaniem sprawy do sądu napisz do nas: ${LEGAL_META.contactEmail} — większość spraw udaje się rozwiązać bezpośrednio; możesz też skorzystać z dostępnych w swoim kraju pozasądowych sposobów rozwiązywania sporów.`,
    ],
  },
  {
    title: '14. App Store i Google Play',
    paragraphs: [
      'Niniejszy Regulamin obowiązuje między Tobą a nami, a nie z Apple ani Google. Apple i Google nie odpowiadają za aplikację ani jej treść i nie udzielają co do niej gwarancji ani wsparcia. Korzystając z aplikacji na iOS, Apple jest beneficjentem niniejszego Regulaminu i może dochodzić jego wykonania. Korzystanie ze sklepów podlega również ich własnym warunkom.',
    ],
  },
  {
    title: '15. Zmiany Regulaminu',
    paragraphs: [
      'Możemy aktualizować niniejszy Regulamin. Aktualna wersja i data wejścia w życie są wskazane na początku ekranu. O istotnych zmianach informujemy w aplikacji z wyprzedzeniem; dalsze korzystanie po dacie wejścia w życie oznacza akceptację.',
    ],
  },
  {
    title: '16. Kontakt',
    paragraphs: [
      `Pytania dotyczące niniejszego Regulaminu: ${LEGAL_META.contactEmail}.`,
    ],
  },
];
