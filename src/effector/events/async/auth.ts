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

// Структура ответа вашего NestJS AuthController (Строго accessToken и refreshToken)
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

// Структура данных внутри вашего JwtPayloadShape на бэкенде
export interface DecodedUserPayload {
  sub: string;
  username: string;
  email: string;
  roles: string[];
  exp: number;
}

// Эффект регистрации (Бэкенд возвращает 204 HTTP Code)
export const signUpFx = createEffect(async (payload: SignUpPayload): Promise<void> => {
  await apiInstance.post('/auth/signup', payload);
});

// Эффект входа: запрашивает токены и парсит данные пользователя из JWT
export const signInFx = createEffect(async (payload: SignInPayload) => {
  const response = await apiInstance.post<AuthResponse>('/auth/signin', payload);
  
  // Декодируем JWT: вытаскиваем sub, username, email и roles
  const decoded: DecodedUserPayload = jwtDecode(response.data.accessToken);

  return {
    accessToken: response.data.accessToken,
    refreshToken: response.data.refreshToken,
    user: {
      id: decoded.sub,
      name: decoded.username,
      email: decoded.email,
      role: decoded.roles,
    }
  };
});

// Эффект верификации 6-значного цифрового кода подтверждения email
export const verifyCodeFx = createEffect(async (code: string): Promise<void> => {
  await apiInstance.get(`/auth/confirm/${code}`);
});

// 🌐 АВТОМАТИЧЕСКИЙ AXIOS ИНТЕРЦЕПТОР ДЛЯ BEARER TOKENS
apiInstance.interceptors.request.use(
  async (config) => {
    const { $accessToken } = await import('../../store');
    const token = $accessToken.getState();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Эффект повторного запроса кода
export const resendCodeFx = createEffect(async (email: string): Promise<void> => {
  await apiInstance.post('/auth/resend-code', { email });
});
