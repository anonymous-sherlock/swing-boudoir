import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

// Types based on the API schema
export interface Payment {
  id: string
  amount: number
  status: 'PENDING' | 'COMPLETED' | 'FAILED'
  stripeSessionId: string
  createdAt: string
  payer: {
    id: string
    user: {
      name: string
    }
  }
  votes: Array<{
    id: string
    type: 'FREE' | 'PAID'
    contest: {
      name: string
    }
    count: number | null
    votee: {
      id: string
      user: {
        name: string
      }
    }
    createdAt: string
  }>
}

export interface PaymentListResponse {
  data: Payment[]
  pagination: {
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
    nextPage: number | null
    previousPage: number | null
  }
}

// Hook for getting all payments (Admin only)
export function usePayments(page: number = 1, limit: number = 20) {
  return useQuery({
    queryKey: ['payments', page, limit],
    queryFn: async () => {
      const response = await api.get(`/api/v1/payments?page=${page}&limit=${limit}`)
      return response
    },
  })
}

// Hook for getting payment history for a specific user
export function usePaymentHistory(profileId: string, page: number = 1, limit: number = 20) {
  return useQuery({
    queryKey: ['payments', 'history', profileId, page, limit],
    queryFn: async () => {
      const response = await api.get(`/api/v1/payments/${profileId}/history?page=${page}&limit=${limit}`)
      return response
    },
    enabled: !!profileId,
  })
}
