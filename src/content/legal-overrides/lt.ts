// src/content/legal-overrides/lt.ts
/**
 * ✅ Полный литовский перевод юридических документов.
 * Структура совпадает с content/legal.ts (проверяется scripts/check-legal-translations.mjs).
 * Juridiškai privaloma — anglų kalba.
 */
import { LEGAL_META, RenderedSection } from '../legal';

const JURISDICTION = 'operatoriaus registracijos šalies';

export const LT_PRIVACY: RenderedSection[] = [
  {
    title: '1. Kas mes esame',
    paragraphs: [
      `PlayG – tai mobili programėlė, padedanti rasti sporto aikšteles, kurti sporto renginius, prie jų prisijungti ir rašyti atsiliepimus. Paslaugą teikia ${LEGAL_META.controller} (toliau – „mes“).`,
      `Dėl privatumo klausimų ar savo teisių įgyvendinimo rašykite mums: ${LEGAL_META.contactEmail}.`,
    ],
  },
  {
    title: '2. Kokius duomenis renkame',
    bullets: [
      'Paskyros duomenys: naudotojo vardas, el. pašto adresas, slaptažodis (saugomas tik kaip bcrypt maiša, niekada atviras), el. pašto patvirtinimo požymis.',
      'Profilio duomenys, kuriuos įvedate: avataras ir nuotraukos, trumpas aprašymas, mėgstamos sporto šakos ir miestas.',
      'Turinys, kurį kuriate: aikštelės (pavadinimas, sporto šakos, danga, patogumai, adresas, aprašymas), renginiai (pavadinimas, data, laikas, trukmė, lygis, žaidėjų skaičius), atsiliepimai (vertinimas, komentaras) ir „patinka“.',
      'Išsaugotos aikštelės: kurias aikšteles pažymėjote.',
      'Vieta: tik kai įjungtas nustatymas „Naudoti mano vietą“. Koordinatės naudojamos netoliese esančioms aikštelėms rodyti ir miestui nustatyti. Bet kada galite tai išjungti nustatymuose; žemėlapis veiks su numatytuoju miestu.',
      'Techniniai duomenys: IP adresas, užklausos laikas ir programėlės/įrenginio versija serverio žurnaluose – saugumui, užklausų ribojimui ir klaidų diagnostikai.',
    ],
    paragraphs: [
      'Nerenkame jūsų kontaktų, kalendoriaus, tikslios vietos fone ar reklaminių identifikatorių. Programėlėje nėra reklamos ar sekimo SDK.',
    ],
  },
  {
    title: '3. Kas matoma kitiems',
    paragraphs: [
      'PlayG – bendruomenės paslauga, todėl didžioji dalis turinio matoma kitiems naudotojams: naudotojo vardas, avataras, miestas, sporto šakos, aktyvumo skaitikliai, taip pat jūsų sukurtos aikštelės, renginiai ir atsiliepimai.',
      'Nuotraukos (avatarai, aikštelių ir profilio nuotraukos) saugomos viešoje failų saugykloje ir pateikiamos tiesioginėmis nuorodomis. Laikykite įkeltas nuotraukas viešomis: nekelkite dokumentų, privačių nuotraukų ar to, ko nenorite rodyti kitiems.',
      'Jūsų el. pašto adresas niekada nerodomas kitiems naudotojams.',
    ],
  },
  {
    title: '4. Kodėl tvarkome duomenis',
    bullets: [
      'Kad teiktume paslaugą: registracija, prisijungimas, aikštelių ir renginių rodymas, išsaugotų aikštelių saugojimas, atsiliepimų publikavimas.',
      'Kad užtikrintume bendruomenės saugumą: aikštelių ir turinio moderavimas, piktnaudžiavimo prevencija, užklausų ribojimas, skundų nagrinėjimas.',
      'Kad susisiektume su jumis: el. pašto patvirtinimas, slaptažodžio atstatymas, svarbūs pranešimai.',
      'Kad laikytumėmės teisės aktų ir vykdytume savo sąlygas.',
    ],
    paragraphs: [
      'Kai teisė reikalauja teisinio pagrindo, remiamės: sutarties su jumis vykdymu dėl pagrindinės paslaugos; jūsų sutikimu dėl pasirenkamų funkcijų (pvz., vietos); mūsų teisėtu interesu saugumo, piktnaudžiavimo prevencijos ir paslaugos tobulinimo srityse; teisinėmis prievolėmis, kai jos taikomos. Jei vietos teisė naudoja kitas konstrukcijas, remiamės lygiaverčiais pagrindais ir sutikimu, kurį duodate kurdami paskyrą ar įjungdami pasirenkamas funkcijas.',
    ],
  },
  {
    title: '5. Duomenų perdavimas ir tvarkytojai',
    lead:
      'Neparduodame jūsų asmens duomenų ir neperduodame jų reklamos tikslais. Naudojamės ribotu skaičiumi paslaugų teikėjų, kurie tvarko duomenis mūsų pavedimu:',
    bullets: [
      'Hostingas ir duomenų bazė – Railway (programa ir PostgreSQL saugykla).',
      'Nuotraukų saugykla – GitHub (vieša nuotraukų saugykla).',
      'Transakciniai laiškai – Google (Gmail SMTP) patvirtinimams ir slaptažodžio atstatymui.',
      'Žemėlapiai – Google Maps plytelėms ir geokodavimui.',
      'Prisijungimo teikėjai – Google ir/ar Facebook, jei pasirenkate socialinį prisijungimą.',
    ],
    paragraphs: [
      'Duomenis galime atskleisti ir tada, kai to reikalauja teisė arba kai tai būtina naudotojų ir paslaugos teisėms bei saugumui apsaugoti.',
      'Kai kurie teikėjai yra už jūsų šalies ribų. Perduodami duomenis tarpvalstybiniu mastu, taikome tinkamas apsaugos priemones (pvz., standartines sutarčių sąlygas) ir užtikriname tokį pat apsaugos lygį nepriklausomai nuo tvarkymo vietos.',
    ],
  },
  {
    title: '6. Kiek ilgai saugome duomenis',
    bullets: [
      'Paskyros ir profilio duomenys – iki paskyros ištrynimo.',
      'Jūsų turinys (aikštelės, renginiai, atsiliepimai, nuotraukos) – iki jo ištrynimo arba paskyros ištrynimo; dalis duomenų gali likti anonimizuoti statistikos tikslais.',
      'Serverio žurnalai – ribotas laikotarpis, paprastai iki 30 dienų, saugumui ir diagnostikai.',
      'Atsarginės kopijos – iki 30 dienų, vėliau perrašomos.',
    ],
  },
  {
    title: '7. Jūsų teisės',
    paragraphs: [
      'Priklausomai nuo jūsų šalies teisės, galite turėti teisę susipažinti su savo duomenimis, juos ištaisyti, ištrinti, apriboti tvarkymą ar tam prieštarauti, gauti kopiją perkeliamu formatu ir bet kada atšaukti sutikimą. Šias teises suteikiame visiems naudotojams, nepaisant gyvenamosios vietos.',
      'Paskyrą ir susijusį turinį galite ištrinti patys: Profilis → Ištrinti paskyrą. Ištrynimas vykdomas iš karto; dalis duomenų gali likti atsarginėse kopijose iki 30 dienų.',
      `Norėdami pasinaudoti kitomis teisėmis, rašykite mums: ${LEGAL_META.contactEmail}. Atsakome per 30 dienų.`,
      'Jei manote, kad jūsų duomenys buvo tvarkomi neteisėtai, galite pateikti skundą savo gyvenamosios šalies duomenų apsaugos ar privatumo institucijai, jei tokia yra.',
    ],
  },
  {
    title: '8. Vaikai',
    paragraphs: [
      'PlayG neskirtas vaikams iki 13 metų. Jei jūsų šalies teisė nustato aukštesnį minimalų amžių naudotis interneto paslaugomis, taikomas jis; jaunesniems asmenims reikia tėvų ar globėjų sutikimo, jei vietos teisė tai leidžia.',
      'Jei sužinome, kad paskyrą sukūrė asmuo, jaunesnis už taikomą minimalų amžių, paskyrą ir jos turinį ištriname.',
    ],
  },
  {
    title: '9. Saugumas',
    paragraphs: [
      'Duomenys perduodami šifruotais HTTPS ryšiais, slaptažodžiai saugomi kaip bcrypt maišos, o prieigos raktai – saugioje įrenginio saugykloje (iOS Keychain / Android Keystore). Prieigą prie produkcijos duomenų turi tik administratoriai, o API taiko užklausų ribojimą ir teisių patikras.',
      'Nė viena sistema nėra visiškai saugi. Jei įtariate problemą su savo paskyra, nedelsdami susisiekite su mumis.',
    ],
  },
  {
    title: '10. Šios politikos pakeitimai',
    paragraphs: [
      'Politiką galime atnaujinti, kai keičiasi programėlė ar teisė. Galiojanti versija ir įsigaliojimo data nurodytos šio ekrano viršuje. Apie esminius pakeitimus informuojame programėlėje; tolesnis naudojimasis po įsigaliojimo datos reiškia atnaujintos politikos priėmimą.',
    ],
  },
  {
    title: '11. Kontaktai',
    paragraphs: [
      `Operatorius: ${LEGAL_META.controller}. El. paštas: ${LEGAL_META.contactEmail}. Į prašymus dėl asmens duomenų atsakome per 30 dienų.`,
    ],
  },
];

export const LT_TERMS: RenderedSection[] = [
  {
    title: '1. Priėmimas',
    paragraphs: [
      'Sukurdami paskyrą ar naudodamiesi PlayG, sutinkate su šiomis naudojimo sąlygomis ir privatumo politika. Jei nesutinkate – nenaudokite programėlės.',
    ],
  },
  {
    title: '2. Kas gali naudotis',
    paragraphs: [
      'Jums turi būti bent 13 metų, o jei jūsų šalies teisė nustato aukštesnį minimalų amžių naudotis interneto paslaugomis, taikomas jis; jaunesniems asmenims reikia tėvų ar globėjų sutikimo, jei vietos teisė tai leidžia. Taip pat turite turėti teisinį veiksnumą sudaryti šią sutartį. Jei naudojatės PlayG organizacijos vardu, patvirtinate savo įgaliojimus.',
    ],
  },
  {
    title: '3. Jūsų paskyra',
    bullets: [
      'Pateikite teisingus duomenis ir juos atnaujinkite.',
      'Užtikrinkite slaptažodžio ir įrenginio saugumą; atsakote už veiksmus savo paskyroje.',
      'Viena paskyra vienam asmeniui. Nekurkite paskyrų moderavimui ar apribojimams apeiti.',
      'Paskyrą galite ištrinti bet kada: Profilis → Ištrinti paskyrą.',
    ],
  },
  {
    title: '4. Jūsų turinys',
    paragraphs: [
      'Išsaugote teises į savo sukurtą turinį (aikšteles, renginius, atsiliepimus, nuotraukas). Publikuodami jį PlayG, suteikiate mums neatlygintinę, neišimtinę licenciją saugoti, rodyti, keisti dydį ir versti jį paslaugoje, kol turinys publikuotas.',
      'Patvirtinate, kad turite teises į įkeliamą turinį (įskaitant kitų asmenų nuotraukas – su jų sutikimu) ir kad jis nepažeidžia trečiųjų asmenų teisių.',
    ],
  },
  {
    title: '5. Draudžiamas turinys ir elgesys',
    paragraphs: ['Netoleruojame nepriimtino turinio ar agresyvaus elgesio. Draudžiama:'],
    bullets: [
      'Neteisėtas turinys, raginimas smurtauti, neapykanta ar diskriminacija.',
      'Priekabiavimas, grasinimai, persekiojimas, kitų asmenų duomenų atskleidimas.',
      'Seksualinis turinys, ypač kai jame dalyvauja nepilnamečiai.',
      'Šlamštas, reklama, fiktyvūs renginiai, melaginga informacija apie aikšteles, kainas ar saugumą.',
      'Intelektinės nuosavybės pažeidimai, apsimetimas kitais asmenimis, kenkėjiškas kodas, bandymai įsilaužti ar perkrauti paslaugą.',
    ],
  },
  {
    title: '6. Moderavimas ir skundai',
    paragraphs: [
      'Naujos aikštelės praeina moderavimą prieš publikavimą. Galime patikrinti, paslėpti, redaguoti ar ištrinti bet kokį turinį, taip pat apriboti ar uždaryti sąlygas pažeidžiančias paskyras – kai įmanoma, pranešdami.',
      `Norėdami pranešti apie turinį, naudotoją ar saugumo problemą, rašykite mums: ${LEGAL_META.contactEmail} ir pridėkite nuorodą. Skundus nagrinėjame per 24 valandas ir pašaliname sąlygas pažeidžiantį turinį.`,
    ],
  },
  {
    title: '7. Susitikimai realybėje ir saugumas',
    paragraphs: [
      'PlayG yra tik platforma: renginius kuria naudotojai, ne mes. Mes neorganizuojame, neprižiūrime ir netikriname renginių, dalyvių, trenerių ar aikštelių ir negarantuojame, kad aikštelė egzistuoja, yra atvira, laisva ar saugi.',
      'Su kitais žmonėmis susitinkate savo rizika. Rinkitės viešas vietas, pasitikrinkite vietą, pasakykite artimiesiems, kur einate, ir nesidalinkite daugiau asmens duomenų nei būtina. Nepilnamečiai turėtų dalyvauti tik su tėvų ar globėjų sutikimu.',
      'Sportas susijęs su traumų rizika. Dalyvaujate savo noru ir atsakote už savo sveikatą, draudimą ir įrangą.',
    ],
  },
  {
    title: '8. Trečiųjų šalių paslaugos',
    paragraphs: [
      'Programėlė naudoja žemėlapius ir kitas trečiųjų šalių paslaugas, taip pat gali turėti nuorodų į išorines svetaines ir susirašinėjimo programėles. Tokioms paslaugoms taikomos jų sąlygos ir privatumo politikos; neatsakome už jų turinį ar prieinamumą.',
    ],
  },
  {
    title: '9. Intelektinė nuosavybė',
    paragraphs: [
      'PlayG pavadinimas, logotipas, dizainas ir kodas yra saugomi teisės ir priklauso jų savininkams. Suteikiame jums asmeninę, neperduodamą, neišimtinę licenciją naudotis programėle pagal paskirtį. Kopijuoti, dekompiliuoti ar perparduoti programėlę ar jos dalis draudžiama.',
    ],
  },
  {
    title: '10. Prieigos nutraukimas',
    paragraphs: [
      'Galite bet kada nustoti naudotis paslauga ir ištrinti paskyrą. Galime sustabdyti ar nutraukti prieigą, jei iš esmės pažeidžiate sąlygas arba to reikalauja teisė. Kai įmanoma, įspėjame iš anksto ir suteikiame galimybę išsaugoti turinį.',
    ],
  },
  {
    title: '11. Garantijų atsisakymas',
    paragraphs: [
      'Paslauga teikiama „tokia, kokia yra“ ir „kiek prieinama“. Teisės leidžiamomis ribomis negarantuojame nepertraukiamo ir be klaidų veikimo, taip pat informacijos apie aikšteles, renginius ir naudotojus tikslumo bei išsamumo. Jokia šių sąlygų nuostata neapriboja privalomų vartotojų teisių.',
    ],
  },
  {
    title: '12. Atsakomybės ribojimas',
    paragraphs: [
      'Teisės leidžiamomis ribomis neatsakome už netiesioginius nuostolius, negautą pelną ar duomenis, taip pat už naudotojų elgesį – įskaitant susitikimus realybėje; mūsų bendra atsakomybė ribojama suma, kurią mums sumokėjote per pastaruosius 12 mėnesių (dabar paslauga nemokama, t. y. nulis). Tai neapriboja atsakomybės, kurios negalima apriboti pagal teisę.',
    ],
  },
  {
    title: '13. Taikoma teisė ir ginčai',
    paragraphs: [
      `Šioms sąlygoms taikoma ${JURISDICTION} teisė, nepažeidžiant privalomų jūsų gyvenamosios šalies vartotojų apsaugos normų, kurios visada turi viršenybę, jei suteikia stipresnę apsaugą. Prieš kreipdamiesi į teismą, rašykite mums: ${LEGAL_META.contactEmail} – daugumą klausimų pavyksta išspręsti tiesiogiai; taip pat galite naudotis savo šalyje prieinamais neteisminio ginčų sprendimo būdais.`,
    ],
  },
  {
    title: '14. App Store ir Google Play',
    paragraphs: [
      'Šios sąlygos sudaromos tarp jūsų ir mūsų, o ne su Apple ar Google. Apple ir Google neatsako už programėlę ar jos turinį ir nesuteikia jai garantijų ar palaikymo. Naudodamiesi iOS programėle, Apple yra šių sąlygų trečiasis naudos gavėjas ir gali reikalauti jų vykdymo. Naudojimuisi parduotuvėmis taip pat taikomos jų pačių sąlygos.',
    ],
  },
  {
    title: '15. Sąlygų pakeitimai',
    paragraphs: [
      'Galime atnaujinti šias sąlygas. Galiojanti versija ir įsigaliojimo data nurodytos ekrano viršuje. Apie esminius pakeitimus informuojame programėlėje iš anksto; tolesnis naudojimasis po įsigaliojimo datos reiškia sutikimą.',
    ],
  },
  {
    title: '16. Kontaktai',
    paragraphs: [`Klausimai dėl šių sąlygų: ${LEGAL_META.contactEmail}.`],
  },
];
