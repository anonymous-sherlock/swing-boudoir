import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

// Types based on the API schema
export interface Vote {
  id: string
  type: 'FREE' | 'PAID'
  voterId: string
  voteeId: string
  contestId: string
  count: number
  paymentId: string | null
  comment: string | null
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
  comment: string | null
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

export interface TopVoter {
  rank: number
  profileId: string
  userName: string
  profilePicture: string
  totalVotesGiven: number
  comment: string | null
  lastVoteAt: string
}

// Hook for giving a free vote
export function useFreeVote() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: { voterId: string; voteeId: string; contestId: string; comment?: string }) => {
      const response = await api.post('/api/v1/contest/vote/free', data)
      return response.data
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
      const response = await api.post('/api/v1/contest/vote/pay', data)
      return response.data
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
    mutationFn: async (data: { profileId: string }): Promise<FreeVoteAvailability> => {
      const response = await api.post('/api/v1/votes/is-free-vote-available', data)
      return response.data
    },
  })
}

// Hook for getting latest votes
export function useLatestVotes(page: number = 1, limit: number = 20) {
  return useQuery({
    queryKey: ['votes', 'latest', page, limit],
    queryFn: async (): Promise<LatestVotesResponse> => {
      // Try without any query parameters first to see if the API works
      const response = await api.get(`/api/v1/votes/latest-votes`)
      return response.data
    },
  })
}

// Hook for getting vote history by profile ID
export function useVoteHistory(profileId: string, page: number = 1, limit: number = 20) {
  return useQuery({
    queryKey: ['votes', 'history', profileId, page, limit],
    queryFn: async (): Promise<VoteHistoryResponse> => {
      const response = await api.get(`/api/v1/votes/${profileId}?page=${Number(page)}&limit=${Number(limit)}`)
      return response.data
    },
    enabled: !!profileId,
  })
}

// Hook for getting top voters for a specific profile
export function useTopVoters(profileId: string) {
  return useQuery({
    queryKey: ['votes', 'top-voters', profileId],
    queryFn: async (): Promise<TopVoter[]> => {
      const response = await api.get<TopVoter[]>(`/api/v1/votes/${profileId}/top-voters`)
      return response.data
    },
    enabled: !!profileId,
  })
}
