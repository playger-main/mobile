import { createEvent } from 'effector';

// События для управления площадками
export const clearGrounds = createEvent();
export const toggleFavoriteInStore = createEvent<string>();

// Локальные триггеры фильтрации и интерфейса
export const setSearchQuery = createEvent<string>();
export const setSelectedCategory = createEvent<string>();
