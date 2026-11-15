// src/effector/domains/report.ts
import { createDomain } from 'effector';

import { closeReport, openReport } from '../events/sync';
import type {
  ReportReason,
  ReportTargetType,
  SubmitReportParams,
} from '../events/async/reports';

const reportDomain = createDomain('report');

export interface ReportTarget {
  targetType: ReportTargetType;
  targetId: string;
  /** Что показать в заголовке шита: имя автора отзыва и т.п. */
  subject?: string;
}

export const $reportTarget = reportDomain
  .createStore<ReportTarget | null>(null)
  .on(openReport, (_, target) => target)
  .on(closeReport, () => null);

export type { ReportReason, ReportTargetType, SubmitReportParams };
