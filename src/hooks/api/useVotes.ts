import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { hc } from '@/lib/api-client'

// Types based on the API schema
export interface Vote {
  id: string
  type: 'FREE' | 'PAID'
  voterId: string
  voteeId: string
  contestId: string
  count: number
  paymentId: string | null
  createdAt: string
  updatedAt: string
}

export interface VoteResponse {
  data: Vote[]
  pagination: {
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
    nextPage: number | null
    previousPage: number | null
  }
}

export interface FreeVoteAvailability {
  available: boolean
  nextAvailableAt: string
}

export interface LatestVote {
  votee: {
    id: string
    name: string
    profilePicture: string
  } | null
  voter: {
    id: string
    name: string
    profilePicture: string
  } | null
  totalVotes: number | null
  createdAt: string
}

export interface LatestVotesResponse {
  data: LatestVote[]
  pagination: {
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
    nextPage: number | null
    previousPage: number | null
  }
}

export interface VoteHistoryEntry {
  profileId: string
  userName: string
  contestName: string
  votedOn: string
  count: number
}

export interface VoteHistoryResponse {
  data: VoteHistoryEntry[]
  pagination: {
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
    nextPage: number | null
    previousPage: number | null
  }
}

// Hook for giving a free vote
export function useFreeVote() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: { voterId: string; voteeId: string; contestId: string }) => {
      const response = await hc.postApiv1contestVoteFree({
        json: data
      })
      return response
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['votes'] })
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] })
      queryClient.invalidateQueries({ queryKey: ['contest', 'leaderboard'] })
    },
  })
}

// Hook for giving a paid vote
export function usePaidVote() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: { voteeId: string; voterId: string; contestId: string; voteCount: number }) => {
      const response = await hc.postApiv1contestVotePay({
        json: data
      })
      return response
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['votes'] })
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] })
      queryClient.invalidateQueries({ queryKey: ['contest', 'leaderboard'] })
    },
  })
}

// Hook for checking free vote availability
export function useFreeVoteAvailability() {
  return useMutation({
    mutationFn: async (data: { profileId: string }) => {
      const response = await hc.postApiv1votesIsFreeVoteAvailable({
        json: data
      })
      return response
    },
  })
}

// Hook for getting latest votes
export function useLatestVotes(page: number = 1, limit: number = 20) {
  return useQuery({
    queryKey: ['votes', 'latest', page, limit],
    queryFn: async (): Promise<LatestVotesResponse> => {
      const response = await api.get(`/api/v1/votes/latest-votes?page=${page}&limit=${limit}`)
      return response.data
    },
  })
}

// Hook for getting vote history by profile ID
export function useVoteHistory(profileId: string, page: number = 1, limit: number = 20) {
  return useQuery({
    queryKey: ['votes', 'history', profileId, page, limit],
    queryFn: async (): Promise<VoteHistoryResponse> => {
      const response = await api.get(`/api/v1/votes/${profileId}?page=${page}&limit=${limit}`)
      return response.data
    },
    enabled: !!profileId,
  })
}
