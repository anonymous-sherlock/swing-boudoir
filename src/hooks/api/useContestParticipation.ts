import { api } from '@/lib/api';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import {
  ContestParticipation,
  ContestParticipant,
  ContestParticipantsResponse,
  ToggleApprovalResponse,
  BulkToggleApprovalResponse
} from '@/types/contest.types';


// Query keys for React Query
export const contestParticipationKeys = {
  all: ['contestParticipation'] as const,
  lists: () => [...contestParticipationKeys.all, 'list'] as const,
  list: (filters: { page?: number; limit?: number }) => [...contestParticipationKeys.lists(), filters] as const,
  details: () => [...contestParticipationKeys.all, 'detail'] as const,
  detail: (id: string) => [...contestParticipationKeys.details(), id] as const,
  byContest: (contestId: string) => [...contestParticipationKeys.all, 'contest', contestId] as const,
  byProfile: (profileId: string) => [...contestParticipationKeys.all, 'profile', profileId] as const,
  checkParticipation: (contestId: string, profileId: string) => [...contestParticipationKeys.all, 'check', contestId, profileId] as const,
};

// Contest Participation API functions
const contestParticipationApi = {
  // Upload cover image for contest participation
  uploadCoverImage: async (participationId: string, file: File): Promise<ContestParticipation> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post(`/api/v1/contest/participation/${participationId}/upload/cover-image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Get contest participants
  getContestParticipants: async (contestId: string, params: { page?: number; limit?: number; search?: string } = {}) => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.search && params.search.trim()) {
      searchParams.append('search', params.search.trim());
    }

    const response = await api.get(`/api/v1/contest/${contestId}/participants?${searchParams.toString()}`);
    return response.data;
  },

  // Check participation status
  checkParticipation: async (contestId: string, profileId: string) => {
    const response = await api.get(`/api/v1/contest/${contestId}/check-participation/${profileId}`);
    return response.data;
  },

  // Toggle participant approval status
  toggleApproval: async (participationId: string): Promise<ToggleApprovalResponse> => {
    const response = await api.patch(`/api/v1/contest/participation/${participationId}/toggle-approval`);
    return response.data;
  },

  // Bulk toggle participant approval status
  bulkToggleApproval: async (data: { participationIds: string[]; isApproved: boolean }): Promise<BulkToggleApprovalResponse> => {
    const response = await api.patch('/api/v1/contest/participants/bulk-toggle-approval', data);
    return response.data;
  },
};

// Hook for fetching contest participants
export function useContestParticipants({
  contestId, page = 1, search, limit = 20, status
}: {
  contestId: string, page: number, search?: string, limit: number, status?: 'all' | 'approved' | 'pending'
}) {
  return useQuery({
    queryKey: ['contest', 'participants', contestId, page, limit, search ?? '', status ?? 'all'],
    queryFn: async (): Promise<ContestParticipantsResponse> => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (search && search.trim()) {
        params.append('search', search.trim());
      }

      if (status && status !== 'all') {
        params.append('status', status);
      }

      const response = await api.get(`/api/v1/contest/${contestId}/participants?${params.toString()}`)
      return response.data
    },
    enabled: !!contestId,
    staleTime: 2 * 60 * 1000, // 2 minutes - participants change more frequently
    gcTime: 5 * 60 * 1000, // 5 minutes - cache retention
    refetchOnWindowFocus: true, // Refetch when user returns to tab
    refetchOnMount: true, // Always refetch on mount for fresh data
    refetchOnReconnect: true, // Refetch when network reconnects
  })
}

// Main useContestParticipation hook
export const useContestParticipation = () => {
  const queryClient = useQueryClient();

  // Contest Participation mutations
  const uploadCoverImage = useMutation({
    mutationFn: ({ participationId, file }: { participationId: string; file: File }) =>
      contestParticipationApi.uploadCoverImage(participationId, file),
    onSuccess: (data) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: contestParticipationKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: contestParticipationKeys.byContest(data.contestId) });
      queryClient.invalidateQueries({ queryKey: contestParticipationKeys.byProfile(data.profileId) });
    },
  });

  const toggleApproval = useMutation({
    mutationFn: (participationId: string) => contestParticipationApi.toggleApproval(participationId),
    onSuccess: (data) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: contestParticipationKeys.detail(data.participation.id) });
      queryClient.invalidateQueries({ queryKey: contestParticipationKeys.byContest(data.participation.contestId) });
      queryClient.invalidateQueries({ queryKey: contestParticipationKeys.byProfile(data.participation.profileId) });
      // Also invalidate contest participants list
      queryClient.invalidateQueries({ queryKey: ['contest', 'participants', data.participation.contestId] });
    },
  });

  const bulkToggleApproval = useMutation({
    mutationFn: (data: { participationIds: string[]; isApproved: boolean }) =>
      contestParticipationApi.bulkToggleApproval(data),
    onSuccess: (data, variables) => {
      // Invalidate all contest participants queries since we don't know which contests were affected
      queryClient.invalidateQueries({ queryKey: ['contest', 'participants'] });
      // Also invalidate contest participation queries
      queryClient.invalidateQueries({ queryKey: contestParticipationKeys.all });
    },
  });

  return {
    // Contest Participation mutations
    uploadCoverImage,
    toggleApproval,
    bulkToggleApproval,
  };
};
