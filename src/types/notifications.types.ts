import { PaginatedResponse, Pagination } from './common.types';

/**
 * Notification interface
 */
export interface Notification {
  id: string;
  message: string;
  profileId: string;
  createdAt: string;
  updatedAt: string;
  isRead: boolean;
  archived: boolean;
  icon?: "WARNING" | "SUCCESS" | "INFO";
  action?: string | null;
}

/**
 * Notifications API response with pagination
 */
export interface NotificationsListResponse {
  notifications: Notification[];
  pagination: Pagination;
}
