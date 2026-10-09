// src/effector/domains/auth.ts
import { createDomain, createEffect } from 'effector';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';
import { setAuthStep, logout, sessionExpired } from '../events/sync';
import { signUpFx, signInFx, verifyCodeFx, forgotPasswordFx, resetPasswordFx } from '../events/async/auth';
import {
  fetchMyProfileFx,
  updateProfileFx,
  updateAvatarFx,
  confirmEmailChangeFx,
  ServerUserProfile,
} from '../events/async/users';

const authDomain = createDomain('auth');

// ==========================================
// ТИПЫ
// ==========================================

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: string[];

  bio?: string;
  city?: string | null;
  preferredSports?: string[];
  avatar?: string | null;
  avatarPath?: string | null;
  photos?: string[];
  photoPaths?: string[];
  photoIds?: string[];
  isEmailConfirmed?: boolean;

  joinedCount?: number;
  savedCount?: number;
  gamesCount?: number;
}

// ==========================================
// КОНСТАНТЫ
// ==========================================

const ACCESS_TOKEN_KEY = 'pg_access_token';
const REFRESH_TOKEN_KEY = 'pg_refresh_token';

// ==========================================
// МАППИНГ сервер → сессия
// ==========================================

const mapProfileToSession = (p: ServerUserProfile): SessionUser => ({
  id: p.id,
  name: p.username,
  email: p.email,
  role: p.roles,
  bio: p.bio,
  city: p.city,
  preferredSports: p.preferredSports,
  avatar: p.avatar,
  avatarPath: p.avatarPath,
  photos: p.photos,
  photoPaths: p.photoPaths,
  photoIds: p.photoIds,
  isEmailConfirmed: p.isEmailConfirmed,
  joinedCount: p.joinedCount ?? 0,
  savedCount: p.savedCount ?? 0,
  gamesCount: p.gamesCount ?? 0,
});

// ==========================================
// ЭФФЕКТ: гидратация сессии из SecureStore
// ==========================================

export const hydrateSessionFx = createEffect(
  async (): Promise<{
    accessToken: string;
    refreshToken: string;
    user: SessionUser;
  } | null> => {
    try {
      const accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
      const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);

      if (!accessToken || !refreshToken) return null;

      const decoded: any = jwtDecode(accessToken);
      const currentTime = Date.now() / 1000;

      if (decoded.exp && decoded.exp < currentTime) {
        // ✅ Истёк access — но НЕ удаляем refresh. Пусть api.ts попробует refresh.
        // Не удаляем ничего, чтобы дать шанс refresh-логике восстановить сессию.
        // Если refresh тоже истёк — api.ts отправит sessionExpired.
        // Здесь только возвращаем null, чтобы не поднимать «мертвую» сессию.
        return null;
      }

      return {
        accessToken,
        refreshToken,
        user: {
          id: decoded.sub,
          name: decoded.username,
          email: decoded.email,
          role: decoded.roles || [],
        },
      };
    } catch {
      return null;
    }
  },
);

// ==========================================
// СТОРЫ
// ==========================================

export const $authStep = authDomain
  .createStore<
    'welcome' | 'signin' | 'signup' | 'verify' | 'forgot' | 'reset'
  >('welcome')
  .on(setAuthStep, (_, step) => step)
  .on(signUpFx.done, () => 'verify')
  .on(verifyCodeFx.done, () => 'signin')
  .on(forgotPasswordFx.done, () => 'reset')
  .on(resetPasswordFx.done, () => 'signin')
  .on(hydrateSessionFx.doneData, (state, payload) =>
    payload ? 'signin' : state,
  );

export const $userSession = authDomain
  .createStore<SessionUser | null>(null)
  .on(signInFx.doneData, (_, payload) => payload.user)
  .on(hydrateSessionFx.doneData, (state, payload) => {
    if (!payload) return state;
    if (state?.id === payload.user.id) {
      return { ...state, ...payload.user };
    }
    return payload.user;
  })
  .on(fetchMyProfileFx.doneData, (state, profile) =>
    state ? { ...state, ...mapProfileToSession(profile) } : state,
  )
  .on(updateProfileFx.doneData, (state, profile) =>
    state ? { ...state, ...mapProfileToSession(profile) } : state,
  )
  .on(updateAvatarFx.doneData, (state, profile) =>
    state ? { ...state, ...mapProfileToSession(profile) } : state,
  )
  .on(confirmEmailChangeFx.doneData, (state, profile) =>
    state ? { ...state, ...mapProfileToSession(profile) } : state,
  )
  // ✅ №21-23: единая очистка и на logout, и на sessionExpired
  .on(logout, () => {
    SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    return null;
  })
  .on(sessionExpired, () => {
    SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    return null;
  });

export const $accessToken = authDomain
  .createStore<string | null>(null)
  .on(signInFx.doneData, (_, payload) => {
    SecureStore.setItemAsync(ACCESS_TOKEN_KEY, payload.accessToken);
    SecureStore.setItemAsync(REFRESH_TOKEN_KEY, payload.refreshToken);
    return payload.accessToken;
  })
  .on(hydrateSessionFx.doneData, (state, payload) =>
    payload ? payload.accessToken : state,
  )
  .on(logout, () => null)
  .on(sessionExpired, () => null);

export const $isAuthSubmitting = authDomain
  .createStore<boolean>(false)
  .on(signUpFx, () => true)
  .on(signUpFx.finally, () => false)
  .on(signInFx, () => true)
  .on(signInFx.finally, () => false)
  .on(verifyCodeFx, () => true)
  .on(verifyCodeFx.finally, () => false)
  .on(forgotPasswordFx, () => true)
  .on(forgotPasswordFx.finally, () => false)
  .on(resetPasswordFx, () => true)
  .on(resetPasswordFx.finally, () => false);

export const $isHydrating = authDomain
  .createStore<boolean>(true)
  .on(hydrateSessionFx.finally, () => false);

// ==========================================
// АВТО-ПОДГРУЗКА ПРОФИЛЯ
// ==========================================

signInFx.doneData.watch(() => {
  fetchMyProfileFx();
});

hydrateSessionFx.doneData.watch((result) => {
  if (result) fetchMyProfileFx();
});