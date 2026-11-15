// src/effector/domains/moderation.ts
import { createDomain } from 'effector';

import {
  deleteReportedContentFx,
  fetchReportsFx,
  ModerationReport,
  resolveReportFx,
} from '../events/async/reportsAdmin';

const moderationDomain = createDomain('moderation');

export const $moderationReports = moderationDomain
  .createStore<ModerationReport[]>([])
  .on(fetchReportsFx.doneData, (_, page) => page.items)
  // ✅ после решения жалобы убираем её из списка
  .on(resolveReportFx.doneData, (state, updated) =>
    state.map((item) => (item.id === updated.id ? updated : item)),
  );

export const $moderationReportsLoading = moderationDomain
  .createStore(false)
  .on(fetchReportsFx.pending, (_, pending) => pending);

export type { ModerationReport };
