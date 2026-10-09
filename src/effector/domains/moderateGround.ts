// src/effector/domains/moderateGround.ts
import { createDomain, createEffect, sample } from 'effector';
import { apiInstance } from '@/effector/api';
import type { Language } from '@/i18n';
import { PhotoInput } from '@/components/ui/PhotoPicker';

// ============================================================
// ТИПЫ
// ============================================================

export interface ModerateFormState {
  // Основные поля
  name: string;
  kindofsport: string[];
  coverage: string[];
  amenities: string[];
  address: string;
  description: string;                          // оригинал
  descriptionTranslate: Record<string, string>; // переводы
  geolocation: { lat: number; lng: number } | null;

  // Фото
  photos: PhotoInput[];
  initialPhotoIds: string[];

  // UI: активный таб языка
  activeLang: Language;

  // Для отслеживания изменений
  initial: {
    name: string;
    kindofsport: string[];
    coverage: string[];
    amenities: string[];
    address: string;
    description: string;
    descriptionTranslate: Record<string, string>;
    geolocation: { lat: number; lng: number } | null;
    photoIds: string[];
  };
}

// ============================================================
// DOMAIN
// ============================================================

const moderateDomain = createDomain('moderateGround');

// ============================================================
// EVENTS
// ============================================================

export const moderateFormInitialized = moderateDomain.createEvent<{
  name: string;
  kindofsport: string[];
  coverage: string[];
  amenities: string[];
  address: string;
  description: string;
  descriptionTranslate: Record<string, string>;
  geolocation: { lat: number; lng: number } | null;
  photos: PhotoInput[];
  initialPhotoIds: string[];
  activeLang: Language;
}>();

export const moderateFormReset = moderateDomain.createEvent();

export const moderateFieldChanged = moderateDomain.createEvent<{
  field: 'name' | 'address' | 'description';
  value: string;
}>();

export const moderateSportsChanged = moderateDomain.createEvent<string[]>();
export const moderateCoverageChanged = moderateDomain.createEvent<string[]>();
export const moderateAmenitiesChanged = moderateDomain.createEvent<string[]>();

export const moderateGeolocationChanged = moderateDomain.createEvent<{
  lat: number;
  lng: number;
} | null>();

export const moderatePhotosChanged = moderateDomain.createEvent<PhotoInput[]>();

export const moderateActiveLangChanged = moderateDomain.createEvent<Language>();

export const moderateTranslateChanged = moderateDomain.createEvent<{
  lang: string;
  value: string;
}>();

export const moderateCopyOriginalToActiveLang = moderateDomain.createEvent();

// ============================================================
// STORES
// ============================================================

export const $moderateForm = moderateDomain
  .createStore<ModerateFormState | null>(null)
  .on(moderateFormInitialized, (_, payload) => ({
    name: payload.name,
    kindofsport: payload.kindofsport,
    coverage: payload.coverage,
    amenities: payload.amenities,
    address: payload.address,
    description: payload.description,
    descriptionTranslate: payload.descriptionTranslate,
    geolocation: payload.geolocation,
    photos: payload.photos,
    initialPhotoIds: payload.initialPhotoIds,
    activeLang: payload.activeLang,
    initial: {
      name: payload.name,
      kindofsport: [...payload.kindofsport],
      coverage: [...payload.coverage],
      amenities: [...payload.amenities],
      address: payload.address,
      description: payload.description,
      descriptionTranslate: { ...payload.descriptionTranslate },
      geolocation: payload.geolocation
        ? { ...payload.geolocation }
        : null,
      photoIds: [...payload.initialPhotoIds],
    },
  }))
  .on(moderateFieldChanged, (state, { field, value }) =>
    state ? { ...state, [field]: value } : state,
  )
  .on(moderateSportsChanged, (state, value) =>
    state ? { ...state, kindofsport: value } : state,
  )
  .on(moderateCoverageChanged, (state, value) =>
    state ? { ...state, coverage: value } : state,
  )
  .on(moderateAmenitiesChanged, (state, value) =>
    state ? { ...state, amenities: value } : state,
  )
  .on(moderateGeolocationChanged, (state, value) =>
    state ? { ...state, geolocation: value } : state,
  )
  .on(moderatePhotosChanged, (state, value) =>
    state ? { ...state, photos: value } : state,
  )
  .on(moderateActiveLangChanged, (state, lang) =>
    state ? { ...state, activeLang: lang } : state,
  )
  .on(moderateTranslateChanged, (state, { lang, value }) =>
    state
      ? {
          ...state,
          descriptionTranslate: {
            ...state.descriptionTranslate,
            [lang]: value,
          },
        }
      : state,
  )
  // ✅ Копировать оригинал в активный таб
  .on(moderateCopyOriginalToActiveLang, (state) =>
    state
      ? {
          ...state,
          descriptionTranslate: {
            ...state.descriptionTranslate,
            [state.activeLang]: state.description,
          },
        }
      : state,
  )
  .reset(moderateFormReset);

// ============================================================
// COMPUTED
// ============================================================

export const $moderateHasChanges = $moderateForm.map((form) => {
  if (!form) return false;

  if (form.name !== form.initial.name) return true;
  if (form.address !== form.initial.address) return true;
  if (form.description !== form.initial.description) return true;

  if (JSON.stringify(form.kindofsport) !== JSON.stringify(form.initial.kindofsport)) return true;
  if (JSON.stringify(form.coverage) !== JSON.stringify(form.initial.coverage)) return true;
  if (JSON.stringify(form.amenities) !== JSON.stringify(form.initial.amenities)) return true;

  if (
    JSON.stringify(form.descriptionTranslate) !==
    JSON.stringify(form.initial.descriptionTranslate)
  ) return true;

  if (form.geolocation?.lat !== form.initial.geolocation?.lat) return true;
  if (form.geolocation?.lng !== form.initial.geolocation?.lng) return true;

  const currentIds = form.photos.filter((p) => !p.isNew && p.id).map((p) => p.id!);
  if (JSON.stringify([...currentIds].sort()) !== JSON.stringify([...form.initial.photoIds].sort())) return true;

  if (form.photos.some((p) => p.isNew)) return true;

  return false;
});

export const $moderateIsValid = $moderateForm.map((form) => {
  if (!form) return false;
  if (!form.name.trim()) return false;
  if (form.kindofsport.length === 0) return false;
  if (!form.address.trim()) return false;
  if (!form.geolocation) return false;
  return true;
});

export const $moderateActiveLang = $moderateForm.map(
  (form) => form?.activeLang ?? 'en',
);