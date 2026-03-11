/**
 * 使用统计相关 API
 */

import { apiClient } from './client';
import { computeKeyStats, KeyStats } from '@/utils/usage';

const USAGE_TIMEOUT_MS = 60 * 1000;

export interface UsageExportPayload {
  version?: number;
  exported_at?: string;
  usage?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface UsageImportResponse {
  added?: number;
  skipped?: number;
  total_requests?: number;
  failed_requests?: number;
  [key: string]: unknown;
}

export interface CleanupFailedUsagePayload {
  mode: 'all_failed' | 'polling_failed';
  scope: {
    timeRangeDays?: 1 | 7 | 14 | 30;
    startTime?: string;
    endTime?: string;
    apiQuery?: string;
    apiKeys?: string[];
    models?: string[];
    sources?: string[];
  };
  match: {
    status: 'failed';
    groupBy: ['source', 'model'];
    windowMinutes: number;
    minRepeatCount: number;
  };
}

export interface CleanupFailedUsageResponse {
  deletedCount?: number;
  affectedGroups?: number;
  [key: string]: unknown;
}

export const usageApi = {
  /**
   * 获取使用统计原始数据
   */
  getUsage: () => apiClient.get<Record<string, unknown>>('/usage', { timeout: USAGE_TIMEOUT_MS }),

  /**
   * 导出使用统计快照
   */
  exportUsage: () => apiClient.get<UsageExportPayload>('/usage/export', { timeout: USAGE_TIMEOUT_MS }),

  /**
   * 导入使用统计快照
   */
  importUsage: (payload: unknown) =>
    apiClient.post<UsageImportResponse>('/usage/import', payload, { timeout: USAGE_TIMEOUT_MS }),

  /**
   * 清理失败请求
   */
  cleanupFailedRequests: (payload: CleanupFailedUsagePayload) =>
    apiClient.post<CleanupFailedUsageResponse>('/usage/cleanup-failures', payload, { timeout: USAGE_TIMEOUT_MS }),

  /**
   * 计算密钥成功/失败统计，必要时会先获取 usage 数据
   */
  async getKeyStats(usageData?: unknown): Promise<KeyStats> {
    let payload = usageData;
    if (!payload) {
      const response = await apiClient.get<Record<string, unknown>>('/usage', { timeout: USAGE_TIMEOUT_MS });
      payload = response?.usage ?? response;
    }
    return computeKeyStats(payload);
  }
};
