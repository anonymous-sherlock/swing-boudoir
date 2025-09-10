import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, extractApiError, isApiError } from "@/lib/api";
import { z } from "zod";
import { toast } from "sonner";

// Schema for model rank data based on actual API
export const ModelRankSchema = z.object({
  id: z.string(),
  rank: z.union([z.number(), z.literal("N/A")]),
  isManualRank: z.boolean().optional(),
  profile: z.object({
    id: z.string(),
    name: z.string(),
    image: z.string(),
    username: z.string(),
    bio: z.string(),
  }),
  stats: z.object({
    freeVotes: z.number(),
    paidVotes: z.number(),
  }),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const AssignRankSchema = z.object({
  profileId: z.string(),
  manualRank: z.number().min(1).max(5),
});

export type ModelRank = z.infer<typeof ModelRankSchema>;
export type AssignRankData = z.infer<typeof AssignRankSchema>;

// API response type for paginated model ranks
export interface ModelRanksResponse {
  currentProfile: ModelRank
  data: ModelRank[];
  pagination: {
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextPage: number | null;
    previousPage: number | null;
  };
}

// API functions
const getModelRanks = async (params?: {
  search?: string;
  page?: number;
  limit?: number;
  profileId?: string;
}): Promise<ModelRanksResponse> => {
  const queryParams = new URLSearchParams();
  if (params?.search) queryParams.append('search', params.search);
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.profileId) queryParams.append('profileId', params.profileId);

  const endpoint = queryParams.toString() ? `/api/v1/ranks?${queryParams.toString()}` : '/api/v1/ranks';
  const response = await api.get(endpoint);
  return response.data;
};

const assignModelRank = async (data: AssignRankData): Promise<{ success: boolean; message: string; rank: ModelRank }> => {
  const response = await api.post('/api/v1/ranks/assign', data);
  console.log("API response:", response.data);


  return response.data;
};

const removeModelRank = async (profileId: string): Promise<{ success: boolean; message: string; rank: ModelRank }> => {
  const response = await api.post('/api/v1/ranks/remove', { profileId });
  return response.data;
};

const updateComputedRanks = async (): Promise<{ success: boolean; message: string; rank: ModelRank }> => {
  const response = await api.post('/api/v1/ranks/update-computed', {
    force: true,
  });
  return response.data;
};

// React Query hooks
export const useGetModelRanks = (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  return useQuery({
    queryKey: ["model-ranks", params],
    queryFn: () => getModelRanks(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for analytics data (used by admin page)
export const useModelRanksAnalytics = () => {
  return useQuery({
    queryKey: ["model-ranks-analytics"],
    queryFn: () => getModelRanks({ limit: 1000 }),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAssignModelRank = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: assignModelRank,
    retry: false, // Don't retry on failure
    onSuccess: () => {
      // Invalidate model ranks list to refetch
      queryClient.invalidateQueries({ queryKey: ["model-ranks"] });
      queryClient.invalidateQueries({ queryKey: ["model-ranks-analytics"] });
    },
    onError: (error) => {
      console.error("Failed to assign model rank:", error);
      // Don't show toast here - let the component handle it
    },
  });
};

export const useRemoveModelRank = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeModelRank,
    onSuccess: () => {
      // Invalidate model ranks list to refetch
      queryClient.invalidateQueries({ queryKey: ["model-ranks"] });
      queryClient.invalidateQueries({ queryKey: ["model-ranks-analytics"] });
    },
    onError: (error) => {
      console.error("Failed to remove model rank:", error);
    },
  });
};


export const useUpdateComputedRanks = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateComputedRanks,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["model-ranks"] });
      queryClient.invalidateQueries({ queryKey: ["model-ranks-analytics"] });
    },
    onError: (error) => {
      console.error("Failed to update computed ranks:", error);
    },
  });
};
