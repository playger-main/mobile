// src/i18n/translations/filters.ts
import type { TranslationDict } from '../types';

export const filters: TranslationDict = {
  // ===== SPORTS =====
  'sport.basketball': { en: 'Basketball', ru: 'Баскетбол', be: 'Баскетбол', lt: 'Krepšinis', pl: 'Koszykówka', uk: 'Баскетбол' },
  'sport.football': { en: 'Football', ru: 'Футбол', be: 'Футбол', lt: 'Futbolas', pl: 'Piłka nożna', uk: 'Футбол' },
  'sport.tennis': { en: 'Tennis', ru: 'Теннис', be: 'Тэніс', lt: 'Tenisas', pl: 'Tenis', uk: 'Теніс' },
  'sport.volleyball': { en: 'Volleyball', ru: 'Волейбол', be: 'Валейбол', lt: 'Tinklinis', pl: 'Siatkówka', uk: 'Волейбол' },
  'sport.pickleball': { en: 'Pickleball', ru: 'Пиклбол', be: 'Піклбол', lt: 'Piklebolas', pl: 'Pickleball', uk: 'Піклбол' },
  'sport.skateboarding': { en: 'Skatepark', ru: 'Скейтпарк', be: 'Скейтпарк', lt: 'Riedučių parkas', pl: 'Skatepark', uk: 'Скейтпарк' },
  'sport.running': { en: 'Running', ru: 'Бег', be: 'Бег', lt: 'Bėgimas', pl: 'Bieganie', uk: 'Біг' },
  'sport.all': { en: 'All sports', ru: 'Все виды', be: 'Усе віды', lt: 'Visos šakos', pl: 'Wszystkie sporty', uk: 'Усі види' },

  // ===== SURFACE =====
  'surface.asphalt': { en: 'Asphalt', ru: 'Асфальт', be: 'Асфальт', lt: 'Asfaltas', pl: 'Asfalt', uk: 'Асфальт' },
  'surface.concrete': { en: 'Concrete', ru: 'Бетон', be: 'Бетон', lt: 'Betonas', pl: 'Beton', uk: 'Бетон' },
  'surface.artificial_grass': { en: 'Artificial grass', ru: 'Искусственная трава', be: 'Штучная трава', lt: 'Dirbtinė žolė', pl: 'Sztuczna trawa', uk: 'Штучна трава' },
  'surface.natural_grass': { en: 'Natural grass', ru: 'Натуральная трава', be: 'Натуральная трава', lt: 'Natūrali žolė', pl: 'Naturalna trawa', uk: 'Натуральна трава' },
  'surface.clay': { en: 'Clay', ru: 'Грунт', be: 'Грунт', lt: 'Molis', pl: 'Glina', uk: 'Ґрунт' },
  'surface.hard_court': { en: 'Hard court', ru: 'Хардкорт', be: 'Хардкорт', lt: 'Kietoji aikštelė', pl: 'Twarde boisko', uk: 'Хардкорт' },
  'surface.rubber': { en: 'Rubber', ru: 'Резина', be: 'Гума', lt: 'Guma', pl: 'Guma', uk: 'Гума' },
  'surface.tartan': { en: 'Tartan', ru: 'Тартан', be: 'Тартан', lt: 'Tartanas', pl: 'Tartan', uk: 'Тартан' },
  'surface.polyurethane': { en: 'Polyurethane', ru: 'Полиуретан', be: 'Поліурэтан', lt: 'Poliuretanas', pl: 'Poliuretan', uk: 'Поліуретан' },
  'surface.wood': { en: 'Wooden (parquet)', ru: 'Дерево (паркет)', be: 'Дрэва (паркет)', lt: 'Medis (parketas)', pl: 'Drewno (parkiet)', uk: 'Дерево (паркет)' },
  'surface.sand': { en: 'Sand', ru: 'Песок', be: 'Пясок', lt: 'Smėlis', pl: 'Piasek', uk: 'Пісок' },
  'surface.gravel': { en: 'Gravel', ru: 'Гравий', be: 'Жвір', lt: 'Žvyras', pl: 'Żwir', uk: 'Гравій' },
  'surface.indoor_parquet': { en: 'Indoor parquet', ru: 'Паркет в помещении', be: 'Паркет у памяшканні', lt: 'Parketas patalpoje', pl: 'Parkiet w hali', uk: 'Паркет у приміщенні' },
  'surface.unknown': { en: 'Unknown', ru: 'Неизвестно', be: 'Невядома', lt: 'Nežinoma', pl: 'Nieznana', uk: 'Невідомо' },

  // ===== AMENITIES =====
  'amenity.floodlights': { en: 'Floodlights', ru: 'Прожекторы', be: 'Праектары', lt: 'Prožektoriai', pl: 'Reflektory', uk: 'Прожектори' },
  'amenity.benches': { en: 'Benches', ru: 'Скамейки', be: 'Лаўкі', lt: 'Suolai', pl: 'Ławki', uk: 'Лавки' },
  'amenity.freeEntry': { en: 'Free entry', ru: 'Бесплатно', be: 'Бясплатна', lt: 'Nemokamas įėjimas', pl: 'Wstęp wolny', uk: 'Безкоштовно' },
  'amenity.parking': { en: 'Parking', ru: 'Парковка', be: 'Паркоўка', lt: 'Parkavimas', pl: 'Parking', uk: 'Парковка' },
  'amenity.changingRooms': { en: 'Changing rooms', ru: 'Раздевалки', be: 'Распранальні', lt: 'Persirengimo kambariai', pl: 'Przebieralnie', uk: 'Роздягальні' },
  'amenity.waterFountain': { en: 'Water fountain', ru: 'Питьевой фонтан', be: 'Пітны фонтан', lt: 'Geriamasis fontanas', pl: 'Fontanna wody', uk: 'Питний фонтан' },
  'amenity.showers': { en: 'Showers', ru: 'Душевые', be: 'Душэвыя', lt: 'Dušai', pl: 'Prysznice', uk: 'Душові' },
  'amenity.lockers': { en: 'Lockers', ru: 'Шкафчики', be: 'Шафкі', lt: 'Spintelės', pl: 'Szafki', uk: 'Шафки' },
  'amenity.restrooms': { en: 'Restrooms', ru: 'Туалеты', be: 'Туалеты', lt: 'Tualetai', pl: 'Toalety', uk: 'Туалети' },
  'amenity.wifi': { en: 'Wi-Fi', ru: 'Wi-Fi', be: 'Wi-Fi', lt: 'Wi-Fi', pl: 'Wi-Fi', uk: 'Wi-Fi' },
  'amenity.cafeteria': { en: 'Cafeteria', ru: 'Кафетерий', be: 'Кафетэрый', lt: 'Kavinė', pl: 'Kafeteria', uk: 'Кафетерій' },
  'amenity.firstAidKit': { en: 'First aid kit', ru: 'Аптечка', be: 'Аптэчка', lt: 'Pirmosios pagalbos rinkinys', pl: 'Apteczka', uk: 'Аптечка' },
  'amenity.equipmentRental': { en: 'Equipment rental', ru: 'Прокат инвентаря', be: 'Прокат інвентару', lt: 'Įrangos nuoma', pl: 'Wypożyczalnia sprzętu', uk: 'Прокат інвентарю' },
  'amenity.wheelchairAccessible': { en: 'Wheelchair accessible', ru: 'Доступно для инвалидных колясок', be: 'Даступна для інвалідных калясак', lt: 'Prieinama neįgaliesiems', pl: 'Dostępne dla wózków inwalidzkich', uk: 'Доступно для інвалідних візків' },
};