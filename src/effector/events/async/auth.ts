// src/effector/events/async/auth.ts
import { createEffect } from 'effector';
import { apiInstance } from '../../api';
import { jwtDecode } from 'jwt-decode';

export interface SignUpPayload {
  username: string;
  email: string;
  password: string;
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

// ❌ УДАЛЕНО: старый request-интерцептор (перенесён в api.ts)