// src/effector/events/async/reportsAdmin.ts
import { createEffect } from 'effector';
import { apiInstance } from '../../api';
import type { ReportTargetType } from './reports';

export interface ModerationReport {
  id: string;
  targetType: ReportTargetType;
  targetId: string;
  reason: string;
  comment: string | null;
  status: 'pending' | 'actioned' | 'rejected';
  createdAt: string;
  reporter?: { id: string; username: string } | null;
}

export interface ReportsPage {
  items: ModerationReport[];
  total: number;
}

/** ✅ Очередь жалоб для модераторов и админов */
export const fetchReportsFx = createEffect(
  async (params: { status?: string } = {}) => {
    const { data } = await apiInstance.get<ReportsPage>('/report', {
      params: { ...params, take: 50 },
    });
    return data;
  },
);

export const resolveReportFx = createEffect(
  async (params: { id: string; status: 'actioned' | 'rejected' }) => {
    const { data } = await apiInstance.patch<ModerationReport>(
      `/report/${params.id}`,
      { status: params.status },
    );
    return data;
  },
);

/** ✅ Удаление самого объекта жалобы (права проверяет бэкенд) */
export const deleteReportedContentFx = createEffect(
  async (params: { targetType: ReportTargetType; targetId: string }) => {
    const base: Record<ReportTargetType, string> = {
      review: '/review',
      ground: '/ground',
      event: '/event',
      photo: '/photo',
      user: '/user',
    };
    await apiInstance.delete(`${base[params.targetType]}/${params.targetId}`);
    return params;
  },
);
