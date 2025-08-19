import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { hc } from '@/lib/api-client'

// Types based on the API schema
export interface Contest {
  id: string
  name: string
  description: string
  prizePool: number
  startDate: string
  endDate: string
  registrationDeadline: string | null
  resultAnnounceDate: string | null
  slug: string
  status: 'DRAFT' | 'PUBLISHED' | 'ACTIVE' | 'VOTING' | 'JUDGING' | 'COMPLETED' | 'CANCELLED' | 'SUSPENDED'
  visibility: 'PUBLIC' | 'PRIVATE' | 'INVITE_ONLY' | 'RESTRICTED'
  isFeatured: boolean
  isVerified: boolean
  isVotingEnabled: boolean
  rules: string | null
  requirements: string | null
  winnerProfileId: string | null
  createdAt: string
  updatedAt: string
  awards: Award[]
  images?: ContestImage[] | null
}

export interface Award {
  id: string
  name: string
  icon: string
  contestId: string
}

export interface ContestImage {
  id: string
  key: string
  caption: string | null
  url: string
}

// Contest Participation Types based on API documentation
export interface ContestParticipationCoverImage {
  id: string
  key: string
  name: string
  url: string
  size: number | null
  type: string | null
  status: 'FAILED' | 'PROCESSING' | 'COMPLETED'
  mediaType: 'COVER_IMAGE' | 'CONTEST_IMAGE' | 'CONTEST_PARTICIPATION_COVER' | 'PROFILE_IMAGE' | 'PROFILE_COVER_IMAGE' | 'PROFILE_BANNER_IMAGE'
  createdAt: string
  updatedAt: string
  profileId: string | null
  caption: string | null
  contestId: string | null
}

export interface ContestParticipation {
  id: string
  profileId: string
  contestId: string
  mediaId: string | null
  coverImage: ContestParticipationCoverImage | null
  isApproved: boolean
  isParticipating: boolean | null
  createdAt: string
  updatedAt: string
}

// Contest Participation Check Response Type
export interface ContestParticipationCheckResponse {
  hasJoined: boolean
  participation: ContestParticipation | null
  contest: Contest
}

export interface ContestListResponse {
  data: Contest[]
  pagination: {
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
    nextPage: number | null
    previousPage: number | null
  }
}

export interface CreateContestData {
  name: string
  description: string
  startDate?: string | null
  prizePool: number
  endDate?: string | null
  slug?: string
  status?: 'DRAFT' | 'PUBLISHED' | 'ACTIVE' | 'VOTING' | 'JUDGING' | 'COMPLETED' | 'CANCELLED' | 'SUSPENDED'
  visibility?: 'PUBLIC' | 'PRIVATE' | 'INVITE_ONLY' | 'RESTRICTED'
  rules?: string | null
  requirements?: string | null
  awards: Array<{
    name: string
    icon: string
  }>
}

export interface UpdateContestData {
  name?: string
  description?: string
  startDate?: string | null
  prizePool?: number
  endDate?: string | null
  slug?: string
  status?: 'DRAFT' | 'PUBLISHED' | 'ACTIVE' | 'VOTING' | 'JUDGING' | 'COMPLETED' | 'CANCELLED' | 'SUSPENDED'
  visibility?: 'PUBLIC' | 'PRIVATE' | 'INVITE_ONLY' | 'RESTRICTED'
  rules?: string | null
  requirements?: string | null
  awards?: Array<{
    name: string
    icon: string
  }>
}

export interface ContestStats {
  contestId: string
  contestName: string
  totalParticipants: number
  totalVotes: number
  freeVotes: number
  paidVotes: number
  totalPrizePool: number
  startDate: string
  endDate: string
  isActive: boolean
  daysRemaining: number
  participationRate: number
}

export interface ContestLeaderboardEntry {
  rank: number
  profileId: string
  username: string
  displayUsername: string | null
  avatarUrl: string | null
  bio: string | null
  totalVotes: number
  freeVotes: number
  paidVotes: number
  isParticipating: boolean
  coverImage: string | null
  isApproved: boolean
}

export interface ContestLeaderboardResponse {
  data: ContestLeaderboardEntry[]
  pagination: {
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
    nextPage: number | null
    previousPage: number | null
  }
}

export interface JoinContestData {
  profileId: string
  contestId: string
  isParticipating?: boolean
  coverImage?: string | null
}

// Hook for getting contest list with pagination
export function useContests(page: number = 1, limit: number = 20, status: "active" | "upcoming" | "all" | "ended" = "all") {
  return useQuery({
    queryKey: ['contests', page, limit, status],
    queryFn: async () => {
      const response = await hc.getApiv1contest({
        queries: {
          page,
          limit,
          status
        }
      })

      return response
    },
  })
}

// Hook for getting upcoming contests
export function useUpcomingContests(page: number = 1, limit: number = 20) {
  return useQuery({
    queryKey: ['contests', 'upcoming', page, limit],
    queryFn: async (): Promise<ContestListResponse> => {
      const response = await api.get(`/api/v1/contest/upcoming?page=${page}&limit=${limit}`)
      return response.data
    },
  })
}

// Hook for getting a single contest by ID
export function useContest(id: string) {
  return useQuery({
    queryKey: ['contest', id],
    queryFn: async () => {
      const res = await hc.getApiv1contestId({
        params: {
          id
        }
      })
      return res
    },
    enabled: !!id,
  })
}

// Hook for getting a single contest by slug
export function useContestBySlug(slug: string) {
  return useQuery({
    queryKey: ['contest', 'slug', slug],
    queryFn: async (): Promise<Contest> => {
      const response = await api.get(`/api/v1/contest/slug/${slug}`)
      return response.data
    },
    enabled: !!slug,
  })
}

// Hook for getting available contests for a profile
export function useAvailableContests(profileId: string, page: number = 1, limit: number = 20) {
  return useQuery({
    queryKey: ['contests', 'available', profileId, page, limit],
    queryFn: async (): Promise<ContestListResponse> => {
      const response = await api.get(`/api/v1/contest/${profileId}/available?page=${page}&limit=${limit}`)
      return response.data
    },
    enabled: !!profileId,
  })
}

// Hook for getting contests that a profile has joined
export function useJoinedContests(profileId: string, page: number = 1, limit: number = 20) {
  return useQuery({
    queryKey: ['contests', 'joined', profileId, page, limit],
    queryFn: async (): Promise<ContestListResponse> => {
      const response = await api.get(`/api/v1/contest/${profileId}/joined?page=${page}&limit=${limit}`)
      return response.data
    },
    enabled: !!profileId,
  })
}

// Hook for getting contest statistics
export function useContestStats(contestId: string) {
  return useQuery({
    queryKey: ['contest', 'stats', contestId],
    queryFn: async (): Promise<ContestStats> => {
      const response = await api.get(`/api/v1/contest/${contestId}/stats`)
      return response.data
    },
    enabled: !!contestId,
  })
}

// Hook for getting contest leaderboard
export function useContestLeaderboard(contestId: string, page: number = 1, limit: number = 20) {
  return useQuery({
    queryKey: ['contest', 'leaderboard', contestId, page, limit],
    queryFn: async (): Promise<ContestLeaderboardResponse> => {
      const response = await api.get(`/api/v1/contest/${contestId}/leaderboard?page=${page}&limit=${limit}`)
      return response.data
    },
    enabled: !!contestId,
  })
}

// Hook for getting contest awards
export function useContestAwards(contestId: string) {
  return useQuery({
    queryKey: ['contest', 'awards', contestId],
    queryFn: async (): Promise<Award[]> => {
      const response = await api.get(`/api/v1/contest/${contestId}/awards`)
      return response.data
    },
    enabled: !!contestId,
  })
}

// Hook for getting a single award by ID
export function useAward(id: string) {
  return useQuery({
    queryKey: ['award', id],
    queryFn: async (): Promise<Award> => {
      const response = await api.get(`/api/v1/awards/${id}`)
      return response.data
    },
    enabled: !!id,
  })
}

// Hook for creating a new contest
export function useCreateContest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateContestData): Promise<Contest> => {
      const response = await api.post('/api/v1/contest', data)
      return response.data
    },
    onSuccess: () => {
      // Invalidate and refetch contests list
      queryClient.invalidateQueries({ queryKey: ['contests'] })
      queryClient.invalidateQueries({ queryKey: ['contests', 'upcoming'] })
    },
  })
}

// Hook for updating a contest
export function useUpdateContest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateContestData }): Promise<Contest> => {
      const response = await api.patch(`/api/v1/contest/${id}`, data)
      return response.data
    },
    onSuccess: (data) => {
      // Invalidate and refetch specific contest and contests list
      queryClient.invalidateQueries({ queryKey: ['contest', data.id] })
      queryClient.invalidateQueries({ queryKey: ['contests'] })
      queryClient.invalidateQueries({ queryKey: ['contests', 'upcoming'] })
    },
  })
}

// Hook for deleting a contest
export function useDeleteContest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<{ message: string }> => {
      const response = await api.delete(`/api/v1/contest/${id}`)
      return response.data
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch contests list - invalidate all contests queries
      queryClient.invalidateQueries({ queryKey: ['contests'] })
      queryClient.invalidateQueries({ queryKey: ['contests', 'upcoming'] })
      queryClient.invalidateQueries({ queryKey: ['contest'] })
      // Also remove the specific contest from cache
      queryClient.removeQueries({ queryKey: ['contest', variables] })
      // Force refetch the current contests list
      queryClient.refetchQueries({ queryKey: ['contests'] })
    },
  })
}

// Hook for creating contest awards
export function useCreateContestAwards() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ contestId, awards }: { contestId: string; awards: Array<{ name: string; icon: string }> }): Promise<Award[]> => {
      const response = await api.post(`/api/v1/contest/${contestId}/awards`, awards)
      return response.data
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch contest awards and contest details
      queryClient.invalidateQueries({ queryKey: ['contest', 'awards', variables.contestId] })
      queryClient.invalidateQueries({ queryKey: ['contest', variables.contestId] })
    },
  })
}

// Hook for updating an award
export function useUpdateAward() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { name?: string; icon?: string } }): Promise<Award> => {
      const response = await api.patch(`/api/v1/awards/${id}`, data)
      return response.data
    },
    onSuccess: (data) => {
      // Invalidate and refetch specific award and related contests
      queryClient.invalidateQueries({ queryKey: ['award', data.id] })
      queryClient.invalidateQueries({ queryKey: ['contest', 'awards', data.contestId] })
    },
  })
}

// Hook for deleting an award
export function useDeleteAward() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<{ message: string }> => {
      const response = await api.delete(`/api/v1/awards/${id}`)
      return response.data
    },
    onSuccess: () => {
      // Invalidate and refetch awards list
      queryClient.invalidateQueries({ queryKey: ['awards'] })
    },
  })
}

// Hook for checking if a profile has joined a contest
export function useCheckContestParticipation(contestId: string, profileId: string) {
  return useQuery({
    queryKey: ['contest', 'participation', contestId, profileId],
    queryFn: async (): Promise<ContestParticipationCheckResponse> => {
      const response = await api.get(`/api/v1/contest/${contestId}/check-participation/${profileId}`)
      return response.data
    },
    enabled: !!contestId && !!profileId,
  })
}

// Hook for joining a contest
export function useJoinContest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: JoinContestData): Promise<ContestParticipation> => {
      const response = await api.post('/api/v1/contest/join', data)
      return response.data
    },
    onSuccess: (data) => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: ['contests', 'available', data.profileId] })
      queryClient.invalidateQueries({ queryKey: ['contests', 'joined', data.profileId] })
      queryClient.invalidateQueries({ queryKey: ['contest', data.contestId] })
      queryClient.invalidateQueries({ queryKey: ['contest', 'participation', data.contestId, data.profileId] })
      queryClient.invalidateQueries({ queryKey: ['contests'] })
    },
  })
}

// Hook for leaving a contest
export function useLeaveContest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: { contestId: string; profileId: string }): Promise<{ message: string }> => {
      const response = await api.post('/api/v1/contest/leave', data)
      return response.data
    },
    onSuccess: (_data, variables) => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: ['contests', 'available', variables.profileId] })
      queryClient.invalidateQueries({ queryKey: ['contests', 'joined', variables.profileId] })
      queryClient.invalidateQueries({ queryKey: ['contest', variables.contestId] })
      queryClient.invalidateQueries({ queryKey: ['contest', 'participation', variables.contestId, variables.profileId] })
    },
  })
}

// Hook for uploading contest images
export function useUploadContestImages() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, files }: { id: string; files: File[] }): Promise<Contest> => {
      const formData = new FormData()
      files.forEach((file) => {
        formData.append('files', file)
      })

      const response = await api.post(`/api/v1/contest/${id}/upload/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    },
    onSuccess: (data) => {
      // Invalidate and refetch specific contest and contests list
      queryClient.invalidateQueries({ queryKey: ['contest', data.id] })
      queryClient.invalidateQueries({ queryKey: ['contests'] })
    },
  })
}

// Hook for removing contest images
export function useRemoveContestImage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, imageId }: { id: string; imageId: string }): Promise<{ message: string }> => {
      const response = await api.delete(`/api/v1/contest/${id}/images/${imageId}`)
      return response.data
    },
    onSuccess: () => {
      // Invalidate and refetch contests list
      queryClient.invalidateQueries({ queryKey: ['contests'] })
    },
  })
}

// Hook for uploading contest participation cover image
export function useUploadContestParticipationCoverImage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ participationId, file }: { participationId: string; file: File }): Promise<ContestParticipation> => {
      const formData = new FormData()
      formData.append('file', file)

      const response = await api.post(`/api/v1/contest/participation/${participationId}/upload/cover-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    },
    onSuccess: (data) => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: ['contest', 'participation', data.contestId, data.profileId] })
      queryClient.invalidateQueries({ queryKey: ['contests', 'joined', data.profileId] })
      queryClient.invalidateQueries({ queryKey: ['contest', data.contestId] })
    },
  })
}

// Types for contest participants
export interface ContestParticipant {
  id: string
  contestId: string
  mediaId: string | null
  coverImage: {
    id: string
    key: string
    name: string
    url: string
    size: number | null
    type: string | null
    status: 'FAILED' | 'PROCESSING' | 'COMPLETED'
    mediaType: 'COVER_IMAGE' | 'CONTEST_IMAGE' | 'CONTEST_PARTICIPATION_COVER' | 'PROFILE_IMAGE' | 'PROFILE_COVER_IMAGE' | 'PROFILE_BANNER_IMAGE'
    createdAt: string
    updatedAt: string
    profileId: string | null
    caption: string | null
    contestId: string | null
  } | null
  isApproved: boolean
  isParticipating: boolean | null
  createdAt: string
  updatedAt: string
  profile: {
    id: string
    bio: string | null
    freeVoterMessage: string | null
    hobbiesAndPassions: string | null
    paidVoterMessage: string | null
    user: {
      id: string
      email: string
      name: string
      image: string | null
    } | null
  } | null
}

export interface ContestParticipantsResponse {
  data: ContestParticipant[]
  pagination: {
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
    nextPage: number | null
    previousPage: number | null
  }
}

// Hook for fetching contest participants
export function useContestParticipants(contestId: string, page: number = 1, limit: number = 20) {
  return useQuery({
    queryKey: ['contest', 'participants', contestId, page, limit],
    queryFn: async (): Promise<ContestParticipantsResponse> => {
      const response = await api.get(`/api/v1/contest/${contestId}/participants?page=${page}&limit=${limit}`)
      return response.data
    },
    enabled: !!contestId,
  })
} 