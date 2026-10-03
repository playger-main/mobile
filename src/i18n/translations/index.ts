// src/i18n/translations/index.ts
import type { TranslationDict } from '../types';

import { common } from './common';
import { auth } from './auth';
import { profile } from './profile';
import { lists } from './lists';
import { reviews } from './reviews';
import { events } from './events';
import { grounds } from './grounds';
import { moderation } from './moderation';
import { filters } from './filters';
import { photos } from './photos';
import { location } from './location';
import { statuses } from './statuses';
import { settings } from './settings';
import { about } from './about';

export const translations: TranslationDict = {
  ...common,
  ...auth,
  ...profile,
  ...lists,
  ...reviews,
  ...events,
  ...grounds,
  ...moderation,
  ...filters,
  ...photos,
  ...location,
  ...statuses,
  ...settings,
  ...about,
};