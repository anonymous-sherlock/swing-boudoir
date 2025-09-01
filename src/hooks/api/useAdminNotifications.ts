import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

// Admin notification types based on the API schema
export interface AdminNotification {
  id: string
  title?: string
  message: string
  profileId: string
  userId: string
  createdAt: string
  updatedAt: string
  isRead: boolean
  isArchived: boolean
  icon?: 'WARNING' | 'SUCCESS' | 'INFO'
  action?: string
  type: 'COMPETITION_JOINED' | 'COMPETITION_LEFT' | 'COMPETITION_CREATED' | 'COMPETITION_UPCOMING' | 'VOTE_RECEIVED' | 'VOTE_PREMIUM' | 'SETTINGS_CHANGED' | 'REMINDER' | 'TIP' | 'MOTIVATION' | 'SYSTEM'
  user?: {
    id: string
    name: string
    email: string
    username?: string
    displayUsername?: string
    image?: string
    type: 'MODEL' | 'VOTER'
  }
  profile?: {
    id: string
    bio?: string
    city?: string
    country?: string
  }
}

export interface AdminNotificationListResponse {
  data: AdminNotification[]
  pagination: {
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
    nextPage: number | null
    previousPage: number | null
  }
}

export interface AdminNotificationFilters {
  search?: string
  page?: number
  limit?: number
  userId?: string
  profileId?: string
  type?: AdminNotification['type']
  isRead?: boolean
  isArchived?: boolean
  startDate?: string
  endDate?: string
  sortBy?: 'createdAt' | 'updatedAt'
  sortOrder?: 'asc' | 'desc'
}

// Hook for getting all notifications (admin only)
export function useAdminNotifications(filters: AdminNotificationFilters = {}) {
  const {
    search,
    page = 1,
    limit = 20,
    userId,
    profileId,
    type,
    isRead,
    isArchived,
    startDate,
    endDate,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = filters

  return useQuery({
    queryKey: ['admin', 'notifications', filters],
    queryFn: async (): Promise<AdminNotificationListResponse> => {
      const params = new URLSearchParams()
      
      if (search) params.append('search', search)
      if (page) params.append('page', page.toString())
      if (limit) params.append('limit', limit.toString())
      if (userId) params.append('userId', userId)
      if (profileId) params.append('profileId', profileId)
      if (type) params.append('type', type)
      if (isRead !== undefined) params.append('isRead', isRead.toString())
      if (isArchived !== undefined) params.append('isArchived', isArchived.toString())
      if (startDate) params.append('startDate', startDate)
      if (endDate) params.append('endDate', endDate)
      if (sortBy) params.append('sortBy', sortBy)
      if (sortOrder) params.append('sortOrder', sortOrder)

      const response = await api.get<AdminNotificationListResponse>(`/api/v1/admin/notifications?${params.toString()}`)
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch admin notifications')
      }
      return response.data
    },
    enabled: true, // Always enabled for admin
  })
}
