// src/effector/events/async/reports.ts
import { createEffect } from 'effector';
import { apiInstance } from '../../api';

export type ReportTargetType =
  | 'review'
  | 'ground'
  | 'event'
  | 'photo'
  | 'user';

export type ReportReason = 'spam' | 'abuse' | 'illegal' | 'nudity' | 'other';

export interface SubmitReportParams {
  targetType: ReportTargetType;
  targetId: string;
  reason: ReportReason;
  comment?: string;
}

export interface SubmitReportResult {
  id: string;
  status: 'pending' | 'actioned' | 'rejected';
}

/**
 * ✅ Жалоба на пользовательский контент (требование Apple 1.2 / Google Play UGC).
 * 409 — пользователь уже жаловался на этот объект.
 */
export const submitReportFx = createEffect<
  SubmitReportParams,
  SubmitReportResult
>(async (params) => {
  const { data } = await apiInstance.post<SubmitReportResult>(
    '/report',
    params,
  );
  return data;
});
