import { buildUrl, getAuthHeaders } from './index';

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
  const response = await fetch(
    buildUrl(`logs?page=${page}&limit=${limit}`),
    {
      method: 'GET',
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des logs');
  }

  return response.json();
};

/**
 * Récupérer les logs par action
 */
export const getLogsByAction = async (
  action: string,
  page: number = 1,
  limit: number = 20
): Promise<PaginatedLogsResponse> => {
  const response = await fetch(
    buildUrl(`logs/action/${action}?page=${page}&limit=${limit}`),
    {
      method: 'GET',
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des logs');
  }

  return response.json();
};

/**
 * Récupérer les logs par utilisateur
 */
export const getLogsByUser = async (
  userId: string,
  page: number = 1,
  limit: number = 20
): Promise<PaginatedLogsResponse> => {
  const response = await fetch(
    buildUrl(`logs/user/${userId}?page=${page}&limit=${limit}`),
    {
      method: 'GET',
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des logs');
  }

  return response.json();
};

/**
 * Nettoyer les anciens logs
 */
export const cleanupOldLogs = async (days: number = 90): Promise<{ statusCode: number; message: string; data?: { deletedCount: number } }> => {
  const response = await fetch(
    buildUrl(`logs/cleanup?days=${days}`),
    {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error('Erreur lors du nettoyage des logs');
  }

  return response.json();
};
