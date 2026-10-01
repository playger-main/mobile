// src/effector/api.ts
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

export const BASE_URL = 'https://playground-back-production.up.railway.app';

export const ACCESS_TOKEN_KEY = 'pg_access_token';
export const REFRESH_TOKEN_KEY = 'pg_refresh_token';

export const apiInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    // ✅ Запрещаем кэш GET-ответов (иначе старые avatar/photos/session)
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    Pragma: 'no-cache',
    Expires: '0',
  },
});

// ============================================================
// REQUEST — подставляем Bearer-токен из SecureStore
// ============================================================
apiInstance.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
      if (token) {
        config.headers = config.headers ?? {};
        (config.headers as any).Authorization = `Bearer ${token}`;
      }
    } catch {
      // Игнорируем ошибки чтения хранилища
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ============================================================
// RESPONSE — при 401 (токен протух) — logout + очистка токенов
// ============================================================
apiInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      console.log('[api] 401 Unauthorized → logging out');

      // 1. Чистим токены из SecureStore
      try {
        await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
        await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
      } catch {}

      // 2. Дёргаем logout → $userSession = null, $accessToken = null
      try {
        const { logout } = await import('./events/sync');
        logout();
      } catch (e) {
        console.warn('[api] logout event failed:', e);
      }
    }

    return Promise.reject(error);
  },
);