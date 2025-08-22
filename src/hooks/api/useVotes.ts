import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, extractApiError, isApiSuccess } from "@/lib/api";
import {
  Vote,
  FreeVoteRequest,
  PaidVoteRequest,
  FreeVoteAvailabilityRequest,
  FreeVoteAvailabilityResponse,
  LatestVotesResponse,
  ProfileVotesResponse,
  TopVoter,
  VoteMultiplierPeriod,
  CreateVoteMultiplierRequest,
  UpdateVoteMultiplierRequest,
} from "@/types/votes.types";
import { toast } from "sonner";

// API endpoint functions for dynamic parameters
const VOTES_ENDPOINTS = {
  freeVote: () => "/api/v1/contest/vote/free",
  paidVote: () => "/api/v1/contest/vote/pay",
  checkFreeVoteAvailability: () => "/api/v1/votes/is-free-vote-available",
  latestVotes: () => "/api/v1/votes/latest-votes",
  profileVotes: (profileId: string) => `/api/v1/votes/${profileId}`,
  topVoters: (profileId: string) => `/api/v1/votes/${profileId}/top-voters`,
  voteMultipliers: () => "/api/v1/vote-multiplier-periods",
  activeVoteMultiplier: () => "/api/v1/vote-multiplier-periods/active",
} as const;

// Cast a free vote
export const useCastFreeVote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (voteData: FreeVoteRequest): Promise<Vote> => {
      const response = await api.post<Vote>(VOTES_ENDPOINTS.freeVote(), voteData);
      if (!isApiSuccess(response)) {
        throw new Error(extractApiError(response) || "An unknown error occurred");
      }
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate relevant queries - be more specific to prevent unnecessary refetches
      queryClient.invalidateQueries({ queryKey: ["votes"] });
      queryClient.invalidateQueries({ queryKey: ["freeVoteAvailability", variables.voterId] });
      // Only invalidate the specific voter's profile, not all profiles
      queryClient.invalidateQueries({ queryKey: ["profile", "detail", "user", variables.voterId] });
      queryClient.invalidateQueries({ queryKey: ["contest"] });
    },
    onError: (error) => {
      toast.error("Failed to cast free vote", {
        description: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
      });
    },
  });
};

// Cast a paid vote (returns payment URL)
export const useCastPaidVote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (voteData: PaidVoteRequest): Promise<{ url: string }> => {
      const response = await api.post<{ url: string }>(VOTES_ENDPOINTS.paidVote(), voteData);
      if (!isApiSuccess(response)) {
        throw new Error(extractApiError(response) || "An unknown error occurred");
      }
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate relevant queries - be more specific to prevent unnecessary refetches
      queryClient.invalidateQueries({ queryKey: ["votes"] });
      queryClient.invalidateQueries({ queryKey: ["freeVoteAvailability", variables.voterId] });
      // Only invalidate the specific voter's profile, not all profiles
      queryClient.invalidateQueries({ queryKey: ["profile", "detail", "user", variables.voterId] });
      queryClient.invalidateQueries({ queryKey: ["contest"] });
    },
  });
};

// Check if free vote is available
export const useCheckFreeVoteAvailability = (params: FreeVoteAvailabilityRequest) => {
  return useQuery({
    queryKey: ["freeVoteAvailability", params.profileId],
    queryFn: async (): Promise<FreeVoteAvailabilityResponse> => {
      const response = await api.post<FreeVoteAvailabilityResponse>(
        VOTES_ENDPOINTS.checkFreeVoteAvailability(),
        params
      );
      if (!isApiSuccess(response)) {
        throw new Error(extractApiError(response) || "An unknown error occurred");
      }
      return response.data;
    },
    enabled: !!params.profileId,
  });
};

// Get latest votes
export const useLatestVotes = (params: { search?: string; page?: number; limit?: number } = {}) => {
  return useQuery({
    queryKey: ["latestVotes", params],
    queryFn: async (): Promise<LatestVotesResponse> => {
      const queryParams = new URLSearchParams();
      if (params.search) queryParams.append("search", params.search);
      if (params.page) queryParams.append("page", params.page.toString());
      if (params.limit) queryParams.append("limit", params.limit.toString());

      const response = await api.get<LatestVotesResponse>(
        `${VOTES_ENDPOINTS.latestVotes()}?${queryParams.toString()}`
      );
      if (!isApiSuccess(response)) {
        throw new Error(extractApiError(response) || "An unknown error occurred");
      }
      return response.data;
    },
  });
};

// Get votes by profile ID
export const useProfileVotes = (
  profileId: string,
  params: { search?: string; page?: number; limit?: number,onlyPaid?:boolean } = {}
) => {
  return useQuery({
    queryKey: ["profileVotes", profileId, params],
    queryFn: async (): Promise<ProfileVotesResponse> => {
      const queryParams = new URLSearchParams();
      if (params.search) queryParams.append("search", params.search);
      if (params.page) queryParams.append("page", params.page.toString());
      if (params.limit) queryParams.append("limit", params.limit.toString());
      if (params.onlyPaid) queryParams.append("onlyPaid", params.onlyPaid.toString());
      const response = await api.get<ProfileVotesResponse>(
        `${VOTES_ENDPOINTS.profileVotes(profileId)}?${queryParams.toString()}`
      );
      if (!isApiSuccess(response)) {
        throw new Error(extractApiError(response) || "An unknown error occurred");
      }

      console.log("response.data", response.data);
      return response.data;
    },
    enabled: !!profileId,
  });
};

// Get top voters for a profile
export const useTopVoters = (profileId: string) => {
  return useQuery({
    queryKey: ["topVoters", profileId],
    queryFn: async (): Promise<TopVoter[]> => {
      const response = await api.get<TopVoter[]>(VOTES_ENDPOINTS.topVoters(profileId));
      if (!isApiSuccess(response)) {
        throw new Error(extractApiError(response) || "An unknown error occurred");
      }
      return response.data;
    },
    enabled: !!profileId,
  });
};

// Vote multiplier periods (admin only)
export const useVoteMultipliers = (params: { search?: string; page?: number; limit?: number } = {}) => {
  return useQuery({
    queryKey: ["voteMultipliers", params],
    queryFn: async (): Promise<{ data: VoteMultiplierPeriod[]; pagination: { total: number; totalPages: number; hasNextPage: boolean; hasPreviousPage: boolean; nextPage: number | null; previousPage: number | null } }> => {
      const queryParams = new URLSearchParams();
      if (params.search) queryParams.append("search", params.search);
      if (params.page) queryParams.append("page", params.page.toString());
      if (params.limit) queryParams.append("limit", params.limit.toString());

      const response = await api.get(`${VOTES_ENDPOINTS.voteMultipliers()}?${queryParams.toString()}`);
      if (!isApiSuccess(response)) {
        throw new Error(extractApiError(response) || "An unknown error occurred");
      }
      return response.data;
    },
  });
};

// Get active vote multiplier
export const useActiveVoteMultiplier = () => {
  return useQuery({
    queryKey: ["activeVoteMultiplier"],
    queryFn: async (): Promise<VoteMultiplierPeriod | null> => {
      const response = await api.get<VoteMultiplierPeriod | null>(VOTES_ENDPOINTS.activeVoteMultiplier());
      if (!isApiSuccess(response)) {
        throw new Error(extractApiError(response) || "An unknown error occurred");
      }
      return response.data;
    },
  });
};

// Create vote multiplier period
export const useCreateVoteMultiplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateVoteMultiplierRequest): Promise<VoteMultiplierPeriod> => {
      const response = await api.post<VoteMultiplierPeriod>(VOTES_ENDPOINTS.voteMultipliers(), data);
      if (!isApiSuccess(response)) {
        throw new Error(extractApiError(response) || "An unknown error occurred");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["voteMultipliers"] });
      queryClient.invalidateQueries({ queryKey: ["activeVoteMultiplier"] });
    },
  });
};

// Update vote multiplier period
export const useUpdateVoteMultiplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateVoteMultiplierRequest }): Promise<VoteMultiplierPeriod> => {
      const response = await api.put<VoteMultiplierPeriod>(`${VOTES_ENDPOINTS.voteMultipliers()}/${id}`, data);
      if (!isApiSuccess(response)) {
        throw new Error(extractApiError(response) || "An unknown error occurred");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["voteMultipliers"] });
      queryClient.invalidateQueries({ queryKey: ["activeVoteMultiplier"] });
    },
  });
};

// Delete vote multiplier period
export const useDeleteVoteMultiplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<{ message: string }> => {
      const response = await api.delete<{ message: string }>(`${VOTES_ENDPOINTS.voteMultipliers()}/${id}`);
      if (!isApiSuccess(response)) {
        throw new Error(extractApiError(response) || "An unknown error occurred");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["voteMultipliers"] });
      queryClient.invalidateQueries({ queryKey: ["activeVoteMultiplier"] });
    },
  });
};
