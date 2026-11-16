// src/effector/events/async/auth.ts
import { createEffect } from 'effector';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { ACCESS_TOKEN_KEY, BASE_URL, apiInstance } from '../../api';
import { jwtDecode } from 'jwt-decode';

export interface SignUpPayload {
  username: string;
  email: string;
  password: string;
  /** ✅ обязательное согласие с Условиями и Политикой (проверяет бэкенд) */
  acceptTerms: boolean;
  /** ✅ язык редакции, которую принял пользователь */
  termsLanguage?: string;
}

export interface SignInPayload {
  user: string; // Бэкенд ждет ключ "user" вместо email согласно LoginUserDto
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export interface DecodedUserPayload {
  sub: string;
  username: string;
  email: string;
  roles: string[];
  exp: number;
}

// Эффект регистрации
export const signUpFx = createEffect(async (payload: SignUpPayload): Promise<void> => {
  await apiInstance.post('/auth/signup', payload);
});

// Эффект входа
export const signInFx = createEffect(async (payload: SignInPayload) => {
  const response = await apiInstance.post<AuthResponse>('/auth/signin', payload);

  const decoded: DecodedUserPayload = jwtDecode(response.data.accessToken);

  return {
    accessToken: response.data.accessToken,
    refreshToken: response.data.refreshToken,
    user: {
      id: decoded.sub,
      name: decoded.username,
      email: decoded.email,
      role: decoded.roles,
    },
  };
});

// Эффект верификации 6-значного кода
export const verifyCodeFx = createEffect(async (code: string): Promise<void> => {
  await apiInstance.get(`/auth/confirm/${code}`);
});

// Эффект повторной отправки кода
export const resendCodeFx = createEffect(async (email: string): Promise<void> => {
  await apiInstance.post('/auth/resend-code', { email });
});

// ✅ Запрос сброса пароля
export const forgotPasswordFx = createEffect(
  async (email: string): Promise<{ message: string }> => {
    const res = await apiInstance.post<{ message: string }>(
      '/auth/forgot-password',
      { email },
    );
    return res.data;
  },
);

// ✅ Установка нового пароля
export const resetPasswordFx = createEffect(
  async (payload: {
    email: string;
    code: string;
    newPassword: string;
  }): Promise<{ message: string }> => {
    const res = await apiInstance.post<{ message: string }>(
      '/auth/reset-password',
      payload,
    );
    return res.data;
  },
);

/**
 * ✅ P1: серверный logout — отзывает refresh-токен на бэкенде.
 *
 * Токен читаем явно из SecureStore в самом начале эффекта: событие `logout`
 * чистит хранилище параллельно, а getItemAsync попадает в очередь раньше
 * deleteItemAsync, поэтому токен успевает прочитаться.
 * Любая ошибка сети игнорируется — локальный выход не должен блокироваться.
 */
export const logoutFx = createEffect(async (): Promise<void> => {
  try {
    const token = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    if (!token) return;

    await axios.post(`${BASE_URL}/auth/logout`, null, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 5000,
    });
  } catch {
    // сеть недоступна или токен уже истёк — ничего страшного
  }
});