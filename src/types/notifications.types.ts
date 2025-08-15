import { PaginatedResponse, Pagination } from './common.types';

/**
 * Notification interface
 */
export interface Notification {
  id: string;
  userId: string;
  profileId?: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  isArchived: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
}

export type NotificationType = 
  | 'competition_joined'
  | 'competition_left'
  | 'competition_created'
  | 'competition_upcoming'
  | 'vote_received'
  | 'vote_premium'
  | 'settings_changed'
  | 'reminder'
  | 'tip'
  | 'motivation'
  | 'system';

export interface NotificationCreateRequest {
  userId: string;
  profileId?: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  priority?: 'low' | 'medium' | 'high';
  expiresAt?: string;
}

export interface NotificationUpdateRequest {
  isRead?: boolean;
  isArchived?: boolean;
}

export interface NotificationsListResponse {
  data: Notification[];
  pagination: {
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextPage: number | null;
    previousPage: number | null;
  };
}

export interface NotificationCounts {
  total: number;
  unread: number;
  archived: number;
}
