// src/effector/events/async/events.ts
import { createEffect } from 'effector';
import { apiInstance } from '../../api';

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

// Эффект запроса событий конкретной площадки
export const fetchEventsByGroundIdFx = createEffect(async (groundId: string): Promise<RealEventItem[]> => {
  const response = await apiInstance.get<RealEventItem[]>(`/event/ground/${groundId}`);
  return response.data;
});
