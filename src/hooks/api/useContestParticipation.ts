import { api } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Contest Participation types
export interface ContestParticipation {
  id: string;
  profileId: string;
  contestId: string;
  mediaId: string | null;
  coverImage: {
    id: string;
    key: string;
    name: string;
    url: string;
    size: number | null;
    type: string | null;
    status: string;
    mediaType: string;
    createdAt: string;
    updatedAt: string;
    profileId: string | null;
    caption: string | null;
    contestId: string | null;
  } | null;
  isApproved: boolean;
  isParticipating: boolean | null;
  createdAt: string;
  updatedAt: string;
  contest: {
    id: string;
    name: string;
    description: string;
    prizePool: number;
    startDate: string;
    endDate: string;
    registrationDeadline: string | null;
    resultAnnounceDate: string | null;
    slug: string;
    status: string;
    visibility: string;
    isFeatured: boolean;
    isVerified: boolean;
    isVotingEnabled: boolean;
    rules: string | null;
    requirements: string | null;
    winnerProfileId: string | null;
    createdAt: string;
    updatedAt: string;
  };
}

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
  getContestParticipants: async (contestId: string, params: { page?: number; limit?: number } = {}) => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());

    const response = await api.get(`/api/v1/contest/${contestId}/participants?${searchParams.toString()}`);
    return response.data;
  },

  // Check participation status
  checkParticipation: async (contestId: string, profileId: string) => {
    const response = await api.get(`/api/v1/contest/${contestId}/check-participation/${profileId}`);
    return response.data;
  },
};

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

  return {
    // Contest Participation mutations
    uploadCoverImage,
  };
};
