// src/effector/domains/blocks.ts
import { createDomain } from 'effector';

import {
  blockUserFx,
  fetchMyBlocksFx,
  unblockUserFx,
} from '../events/async/blocks';

const blocksDomain = createDomain('blocks');

/**
 * ✅ Кого я заблокировал. Контент этих авторов бэкенд не отдаёт
 * (жалобы и блокировки — требование Apple 1.2 для UGC).
 */
export const $blockedIds = blocksDomain
  .createStore<string[]>([])
  .on(fetchMyBlocksFx.doneData, (_, ids) => ids)
  .on(blockUserFx.doneData, (state, userId) =>
    state.includes(userId) ? state : [...state, userId],
  )
  .on(unblockUserFx.doneData, (state, userId) =>
    state.filter((id) => id !== userId),
  );
