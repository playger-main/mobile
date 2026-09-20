import { createEvent } from 'effector';

// События для управления площадками
export const clearGrounds = createEvent();
export const toggleFavoriteInStore = createEvent<string>();

// Локальные триггеры фильтрации и интерфейса
export const setSearchQuery = createEvent<string>();
export const setSelectedCategory = createEvent<string>();
export const setSelectedDate = createEvent<string>();


export const setAuthStep = createEvent<'welcome' | 'signin' | 'signup'>();
export const logout = createEvent();