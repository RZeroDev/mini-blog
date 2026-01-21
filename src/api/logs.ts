import api from './index';

export interface Log {
  id: string;
  action: string;
  entity: string;
  entityId?: string;
  userId?: string;
  userName?: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface PaginatedLogsResponse {
  statusCode: number;
  data: {
    items: Log[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
  message: string;
}

/**
 * Récupérer tous les logs avec pagination
 */
export const getLogs = async (
  page: number = 1,
  limit: number = 20
): Promise<PaginatedLogsResponse> => {
  const response = await api.get(`/logs?page=${page}&limit=${limit}`);
  return response.data;
};

/**
 * Récupérer les logs par action
 */
export const getLogsByAction = async (
  action: string,
  page: number = 1,
  limit: number = 20
): Promise<PaginatedLogsResponse> => {
  const response = await api.get(
    `/logs/action/${action}?page=${page}&limit=${limit}`
  );
  return response.data;
};

/**
 * Récupérer les logs par utilisateur
 */
export const getLogsByUser = async (
  userId: string,
  page: number = 1,
  limit: number = 20
): Promise<PaginatedLogsResponse> => {
  const response = await api.get(
    `/logs/user/${userId}?page=${page}&limit=${limit}`
  );
  return response.data;
};

/**
 * Nettoyer les anciens logs
 */
export const cleanupOldLogs = async (days: number = 90): Promise<any> => {
  const response = await api.delete(`/logs/cleanup?days=${days}`);
  return response.data;
};
