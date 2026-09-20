// src/effector/events/async/auth.ts
import { createEffect } from 'effector';
import { apiInstance } from '../../api';

export interface SignUpPayload {
  username: string;
  email: string;
  password: string;
}

export interface SignInPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string[];
  };
}

// Эффект регистрации (Возвращает 204 User Created согласно вашему Swagger)
export const signUpFx = createEffect(async (payload: SignUpPayload): Promise<void> => {
  await apiInstance.post('/auth/signup', payload);
});

// Эффект входа (Возвращает токены и данные пользователя)
export const signInFx = createEffect(async (payload: SignInPayload): Promise<AuthResponse> => {
  const response = await apiInstance.post<AuthResponse>('/auth/signin', payload);
  return response.data;
});
