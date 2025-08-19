import { PaginatedResponse, Pagination } from './common.types';

/**
 * Notification interface
 */
export interface Notification {
  id: string;
  profileId?: string;
  type: keyof Notification_Type;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  isArchived: boolean;
  icon?: 'WARNING' | 'SUCESS' | 'INFO';
  priority?: 'low' | 'medium' | 'high';
  action?: string;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
}

export type Notification_Type = {
  COMPETITION_JOINED: 'competition_joined';
  COMPETITION_LEFT: 'competition_left';
  COMPETITION_CREATED: 'competition_created';
  COMPETITION_UPCOMING: 'competition_upcoming';
  VOTE_RECEIVED: 'vote_received';
  VOTE_PREMIUM: 'vote_premium';
  SETTINGS_CHANGED: 'settings_changed';
  REMINDER: 'reminder';
  TIP: 'tip';
  MOTIVATION: 'motivation';
  SYSTEM: 'system';
};

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
  profileId: string;
  message: string;
  title?: string;
  type?: keyof Notification_Type;
  icon?: 'WARNING' | 'SUCESS' | 'INFO';
  action?: string;
}

export interface NotificationUpdateRequest {
  isRead?: boolean;
  isArchived?: boolean;
}

export interface NotificationsListResponse {
  notifications: Notification[];
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
  totalCount: number;
  unreadCount: number;
  archivedCount: number;
}
