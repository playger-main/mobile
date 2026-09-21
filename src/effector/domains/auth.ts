// src/effector/domains/auth.ts
import { createDomain, createEffect } from 'effector';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';
import { setAuthStep, logout } from '../events/sync';
import { signUpFx, signInFx, verifyCodeFx } from '../events/async/auth'; // ✅ Импортировали verifyCodeFx сюда

const authDomain = createDomain('auth');

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: string[];
  joinedCount?: number;  // Счетчик "Joined"
  savedCount?: number;   // Счетчик "Saved"
  gamesCount?: number;   // Счетчик "Games"
}


const ACCESS_TOKEN_KEY = 'pg_access_token';
const REFRESH_TOKEN_KEY = 'pg_refresh_token';

// Асинхронный эффект восстановления сессии при старте приложения (из SecureStore)
export const hydrateSessionFx = createEffect(async (): Promise<{ accessToken: string; refreshToken: string; user: SessionUser } | null> => {
  try {
    const accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);

    if (!accessToken || !refreshToken) return null;

    const decoded: any = jwtDecode(accessToken);
    const currentTime = Date.now() / 1000;
    
    if (decoded.exp && decoded.exp < currentTime) {
      await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
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
});

// ✅ СТОР ШАГОВ АВТОРИЗАЦИИ: Теперь обрабатывает все 4 состояния без ошибок компиляции
export const $authStep = authDomain
  .createStore<'welcome' | 'signin' | 'signup' | 'verify'>('welcome')
  .on(setAuthStep, (_, step) => step)
  // После успешной регистрации переводим пользователя на ввод 6-значного кода
  .on(signUpFx.done, () => 'verify')
  // После успешного подтверждения кода из письма — отправляем на форму входа
  .on(verifyCodeFx.done, () => 'signin')
  .on(hydrateSessionFx.doneData, (state, payload) => payload ? 'signin' : state);

export const $userSession = authDomain
  .createStore<SessionUser | null>(null)
  .on(signInFx.doneData, (_, payload) => payload.user)
  .on(hydrateSessionFx.doneData, (state, payload) => payload ? payload.user : state)
  .on(logout, () => {
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
  .on(hydrateSessionFx.doneData, (state, payload) => payload ? payload.accessToken : state)
  .on(logout, () => null);

export const $isAuthSubmitting = authDomain
  .createStore<boolean>(false)
  .on(signUpFx, () => true)
  .on(signUpFx.finally, () => false)
  .on(signInFx, () => true)
  .on(signInFx.finally, () => false)
  .on(verifyCodeFx, () => true)
  .on(verifyCodeFx.finally, () => false);

export const $isHydrating = authDomain
  .createStore<boolean>(true)
  .on(hydrateSessionFx.finally, () => false);
