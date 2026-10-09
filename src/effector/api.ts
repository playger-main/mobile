// src/effector/api.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';

export const BASE_URL = 'https://playground-back-production.up.railway.app';

export const ACCESS_TOKEN_KEY = 'pg_access_token';
export const REFRESH_TOKEN_KEY = 'pg_refresh_token';

export const apiInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    Pragma: 'no-cache',
    Expires: '0',
  },
});

// ============================================================
// AUTH ENDPOINTS — не триггерят refresh и не логинят при 401
// ============================================================
const isAuthEndpoint = (url?: string) => {
  if (!url) return false;
  return (
    url.includes('/auth/signin') ||
    url.includes('/auth/signup') ||
    url.includes('/auth/confirm') ||
    url.includes('/auth/resend-code') ||
    url.includes('/auth/forgot-password') ||
    url.includes('/auth/reset-password') ||
    url.includes('/auth/refresh')
  );
};

// ============================================================
// REFRESH-FLOW (№21, №22)
//
// Логика:
//   - Есть single-flight: если refresh уже идёт — новые 401 ждут его.
//   - На успехе — обновляем токены в SecureStore и ретраим исходный запрос.
//   - На провале — sessionExpired() → logout → редирект на /profile.
// ============================================================

let isRefreshing = false;
let refreshQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: any) => void;
}> = [];

const performRefresh = async (): Promise<string> => {
  const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);

  if (!refreshToken) {
    throw new Error('No refresh token in storage');
  }

  // ✅ Бэк требует И Bearer, И body (см. SchemaRefresh + JwtRefreshGuard)
  const res = await axios.post(
    `${BASE_URL}/auth/refresh`,
    { refreshToken },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${refreshToken}`,
      },
      // Используем «сырой» axios, чтобы не влететь в интерцепторы apiInstance
    },
  );

  const { accessToken, refreshToken: newRefreshToken } = res.data;

  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, newRefreshToken);

  return accessToken;
};

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
// RESPONSE — при 401 пытаемся refresh → retry → иначе sessionExpired
// ============================================================
apiInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error?.response?.status;
    const originalConfig = error?.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;
    const url = originalConfig?.url ?? '';

    // Не обрабатываем auth-эндпоинты (там 401 — норма)
    if (isAuthEndpoint(url)) {
      return Promise.reject(error);
    }

    // Не 401 — просто пробрасываем
    if (status !== 401) {
      return Promise.reject(error);
    }

    // Уже ретраили — не зацикливаемся
    if (originalConfig?._retry) {
      console.log('[api] 401 after retry → sessionExpired');
      try {
        const { sessionExpired } = await import('./events/sync');
        sessionExpired();
      } catch (e) {
        console.warn('[api] sessionExpired event failed:', e);
      }
      return Promise.reject(error);
    }

    // ─── Single-flight refresh ─────────────────────────────────
    if (isRefreshing) {
      // Ждём результата уже идущего refresh
      return new Promise((resolve, reject) => {
        refreshQueue.push({
          resolve: (token: string) => {
            if (!originalConfig) return reject(error);
            originalConfig._retry = true;
            originalConfig.headers = originalConfig.headers ?? ({} as any);
            (originalConfig.headers as any).Authorization = `Bearer ${token}`;
            resolve(apiInstance(originalConfig));
          },
          reject: (err) => reject(err),
        });
      });
    }

    isRefreshing = true;

    try {
      console.log('[api] 401 → trying refresh…');
      const newToken = await performRefresh();

      // Разбудим очередь
      refreshQueue.forEach(({ resolve }) => resolve(newToken));
      refreshQueue = [];

      // Ретраим текущий запрос
      if (!originalConfig) {
        throw new Error('Missing original config');
      }
      originalConfig._retry = true;
      originalConfig.headers = originalConfig.headers ?? ({} as any);
      (originalConfig.headers as any).Authorization = `Bearer ${newToken}`;

      return apiInstance(originalConfig);
    } catch (refreshError) {
      console.log('[api] refresh failed → sessionExpired');
      refreshQueue.forEach(({ reject }) => reject(refreshError));
      refreshQueue = [];

      try {
        const { sessionExpired } = await import('./events/sync');
        sessionExpired();
      } catch (e) {
        console.warn('[api] sessionExpired event failed:', e);
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);