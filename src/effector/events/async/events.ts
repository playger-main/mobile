// src/effector/events/async/events.ts
import { createEffect } from 'effector';
import { apiInstance } from '../../api';

// Структура ответа с сервера /event
export interface ServerEventItem {
  id: string;
  name: string;
  description: string;
  date: string;        // "2025-10-12"
  startTime: string;   // "14:00"
  duration: string;    // "1.5 hours"
  createdAt: string;
  updatedAt: string;
  creator: {
    id: string;
    name: string;
    role: string[];
  };
  ground: {
    id: string;
    name: string;
    address: string;
    kindofsport?: string[]; // Извлекаем спорт площадки для тегов
  };
}

// Интерфейс ивента на основе реального JSON ответа NestJS
export interface RealEventItem {
  id: string;
  name: string;
  description: string;
  date: string;       // "2025-10-12"
  startTime: string;  // "14:00"
  duration: string;   // "1.5 hours"
  creator: {
    id: string;
    name: string;
    role: string[];
  };
}

// Эффект для получения всех событий
export const fetchAllEventsFx = createEffect(async (): Promise<ServerEventItem[]> => {
  const response = await apiInstance.get<ServerEventItem[]>('/event');
  return response.data;
});

// Эффект запроса событий конкретной площадки
export const fetchEventsByGroundIdFx = createEffect(async (groundId: string): Promise<RealEventItem[]> => {
  const response = await apiInstance.get<RealEventItem[]>(`/event/ground/${groundId}`);
  return response.data;
});
