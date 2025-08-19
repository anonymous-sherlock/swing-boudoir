import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

// Types based on the API schema
export interface Notification {
  id: string
  message: string
  profileId: string
  createdAt: string
  updatedAt: string
  isRead: boolean
  archived: boolean
  icon?: 'WARNING' | 'SUCESS' | 'INFO'
  action?: string
}

export interface NotificationStats {
  totalNotifications: number
  unreadCount: number
  archivedCount: number
}

export interface NotificationListResponse {
  notifications: Notification[]
  pagination: {
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
    nextPage: number | null
    previousPage: number | null
  }
}

export interface ArchivedNotificationResponse {
  archivedNotifications: Notification[]
  pagination: {
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
    nextPage: number | null
    previousPage: number | null
  }
}

export interface CreateNotificationData {
  message: string
  profileId: string
  icon?: 'WARNING' | 'SUCESS' | 'INFO'
  action?: string
}

export interface UpdateNotificationData {
  message?: string
  profileId?: string
  isRead?: boolean
  archived?: boolean
  icon?: 'WARNING' | 'SUCESS' | 'INFO'
  action?: string
}

export interface ReadAllResponse {
  message: string
  updatedCount: number
}

// Hook for getting notification statistics for a specific profile
export function useNotificationStats(profileId: string) {
  return useQuery({
    queryKey: ['notifications', 'stats', profileId],
    queryFn: async (): Promise<NotificationStats> => {
      if (!profileId || profileId.trim() === '') {
        throw new Error('Profile ID is required')
      }

      const response = await api.get<NotificationStats>(`/api/v1/notifications/${profileId.trim()}/stats`)
      if (!response.success) {
        const errorMessage = response.error || 'Failed to fetch notification stats'
        throw new Error(errorMessage)
      }
      return response.data
    },
    enabled: !!profileId && profileId.trim() !== '',
  })
}

// Hook for getting paginated list of notifications
export function useNotifications(
  profileId: string,
  page: number = 1,
  limit: number = 20,
  isRead?: boolean,
  archived?: boolean
) {
  return useQuery({
    queryKey: ['notifications', profileId, page, limit, isRead, archived],
    queryFn: async (): Promise<NotificationListResponse> => {
      if (!profileId || profileId.trim() === '') {
        throw new Error('Profile ID is required')
      }

      const params = new URLSearchParams({
        profileId: profileId.trim(),
        page: page.toString(),
        limit: limit.toString(),
      })
      
      if (isRead !== undefined) params.append('isRead', isRead.toString())
      if (archived !== undefined) params.append('archived', archived.toString())
      
      const response = await api.get<NotificationListResponse>(`/api/v1/notifications?${params}`)
      if (!response.success) {
        const errorMessage = response.error || 'Failed to fetch notifications'
        throw new Error(errorMessage)
      }
      return response.data
    },
    enabled: !!profileId && profileId.trim() !== '',
  })
}

// Hook for getting a single notification by ID
export function useNotification(id: string) {
  return useQuery({
    queryKey: ['notification', id],
    queryFn: async (): Promise<Notification> => {
      const response = await api.get<Notification>(`/api/v1/notifications/${id}`)
      if (!response.success) throw new Error(response.error)
      return response.data
    },
    enabled: !!id,
  })
}

// Hook for getting archived notifications
export function useArchivedNotifications(
  profileId: string,
  page: number = 1,
  limit: number = 20
) {
  return useQuery({
    queryKey: ['notifications', 'archived', profileId, page, limit],
    queryFn: async (): Promise<ArchivedNotificationResponse> => {
      const response = await api.get<ArchivedNotificationResponse>(
        `/api/v1/notifications/${profileId}/archived?page=${page}&limit=${limit}`
      )
      if (!response.success) throw new Error(response.error)
      return response.data
    },
    enabled: !!profileId,
  })
}

// Hook for creating a new notification
export function useCreateNotification() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateNotificationData): Promise<Notification> => {
      const response = await api.post<Notification>('/api/v1/notifications', data)
      if (!response.success) throw new Error(response.error)
      return response.data
    },
    onSuccess: (data) => {
      // Invalidate and refetch notifications list and stats
      queryClient.invalidateQueries({ queryKey: ['notifications', data.profileId] })
      queryClient.invalidateQueries({ queryKey: ['notifications', 'stats', data.profileId] })
    },
  })
}

// Hook for updating a notification
export function useUpdateNotification() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateNotificationData }): Promise<Notification> => {
      const response = await api.put<Notification>(`/api/v1/notifications/${id}`, data)
      if (!response.success) throw new Error(response.error)
      return response.data
    },
    onSuccess: (data) => {
      // Invalidate and refetch specific notification and related queries
      queryClient.invalidateQueries({ queryKey: ['notification', data.id] })
      queryClient.invalidateQueries({ queryKey: ['notifications', data.profileId] })
      queryClient.invalidateQueries({ queryKey: ['notifications', 'stats', data.profileId] })
    },
  })
}

// Hook for deleting a notification
export function useDeleteNotification() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<Notification> => {
      const response = await api.delete<Notification>(`/api/v1/notifications/${id}`)
      if (!response.success) throw new Error(response.error)
      return response.data
    },
    onSuccess: (data) => {
      // Invalidate and refetch notifications list and stats
      queryClient.invalidateQueries({ queryKey: ['notifications', data.profileId] })
      queryClient.invalidateQueries({ queryKey: ['notifications', 'stats', data.profileId] })
      // Remove the specific notification from cache
      queryClient.removeQueries({ queryKey: ['notification', data.id] })
    },
  })
}

// Hook for marking a notification as read
export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<Notification> => {
      const response = await api.patch<Notification>(`/api/v1/notifications/${id}/read`)
      if (!response.success) throw new Error(response.error)
      return response.data
    },
    onSuccess: (data) => {
      // Invalidate and refetch specific notification and related queries
      queryClient.invalidateQueries({ queryKey: ['notification', data.id] })
      queryClient.invalidateQueries({ queryKey: ['notifications', data.profileId] })
      queryClient.invalidateQueries({ queryKey: ['notifications', 'stats', data.profileId] })
    },
  })
}

// Hook for marking all notifications as read
export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (profileId: string): Promise<ReadAllResponse> => {
      const response = await api.patch<ReadAllResponse>(`/api/v1/notifications/${profileId}/read-all`)
      if (!response.success) throw new Error(response.error)
      return response.data
    },
    onSuccess: (_, profileId) => {
      // Invalidate and refetch notifications list and stats
      queryClient.invalidateQueries({ queryKey: ['notifications', profileId] })
      queryClient.invalidateQueries({ queryKey: ['notifications', 'stats', profileId] })
    },
  })
}

// Hook for toggling notification archive status
export function useToggleNotificationArchive() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<Notification> => {
      const response = await api.patch<Notification>(`/api/v1/notifications/${id}/archive`)
      if (!response.success) throw new Error(response.error)
      return response.data
    },
    onSuccess: (data) => {
      // Invalidate and refetch specific notification and related queries
      queryClient.invalidateQueries({ queryKey: ['notification', data.id] })
      queryClient.invalidateQueries({ queryKey: ['notifications', data.profileId] })
      queryClient.invalidateQueries({ queryKey: ['notifications', 'archived', data.profileId] })
      queryClient.invalidateQueries({ queryKey: ['notifications', 'stats', data.profileId] })
    },
  })
}
