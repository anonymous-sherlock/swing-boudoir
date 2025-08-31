import { api } from '@/lib/api';
import type { ProfileSelectSchemaType } from '@/lib/validations/profile.schema';
import { ProfileInsertSchema } from '@/lib/validations/profile.schema';
import { ContestParticipation, User_Type } from '@/types';
import { Profile, ProfileStats } from '@/types/profile.types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import z from 'zod';




export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextPage: number | null;
    previousPage: number | null;
  };
}

export interface CreateProfileRequest {
  userId: string;
  bio?: string | null;
  avatarUrl?: string | null;
  phone?: string | null;
  address: string;
  city?: string | null;
  country?: string | null;
  postalCode?: string | null;
  dateOfBirth?: string | null;
  gender?: string | null;
  hobbiesAndPassions?: string | null;
  paidVoterMessage?: string | null;
  freeVoterMessage?: string | null;
  lastFreeVoteAt?: string | null;
  coverImageId?: string | null;
}

export interface UpdateProfileRequest {
  userId?: string;
  bio?: string | null;
  avatarUrl?: string | null;
  phone?: string | null;
  address?: string;
  city?: string | null;
  country?: string | null;
  postalCode?: string | null;
  dateOfBirth?: string | null;
  gender?: string | null;
  hobbiesAndPassions?: string | null;
  paidVoterMessage?: string | null;
  freeVoterMessage?: string | null;
  lastFreeVoteAt?: string | null;
  coverImageId?: string | null;
  user?: {
    displayUsername?: string | null;
    username?: string | null;
    name?: string | null;
  } | null;
}

// Query keys for React Query
export const profileKeys = {
  all: ['profile'] as const,
  lists: () => [...profileKeys.all, 'list'] as const,
  list: (filters: { page?: number; limit?: number }) => [...profileKeys.lists(), filters] as const,
  details: () => [...profileKeys.all, 'detail'] as const,
  detail: (id: string) => [...profileKeys.details(), id] as const,
  byUserId: (userId: string) => [...profileKeys.details(), 'user', userId] as const,
  byUsername: (username: string) => [...profileKeys.details(), 'username', username] as const,
  stats: () => [...profileKeys.all, 'stats'] as const,
  statsByProfileId: (profileId: string) => [...profileKeys.stats(), profileId] as const,
  activeParticipation: () => [...profileKeys.all, 'active-participation'] as const,
  activeParticipationByProfileId: (profileId: string) => [...profileKeys.activeParticipation(), profileId] as const,
};

// Profile API functions
export const profileApi = {
  // Get all profiles with pagination
  getProfiles: async (
    params: { page?: number; limit?: number } = {}
  ): Promise<PaginatedResponse<Profile>> => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());

    const response = await api.get(`/api/v1/profile?${searchParams.toString()}`);
    return response.data;
  },

  // Get profile by ID
  getProfile: async (id: string): Promise<Profile> => {
    const response = await api.get(`/api/v1/profile/${id}`);
    return response.data;
  },

  // Get profile by user ID
  getProfileByUserId: async (userId: string): Promise<Profile> => {
    const response = await api.get(`/api/v1/profile/user/${userId}`);
    return response.data;
  },

  // Get profile by username
  getProfileByUsername: async (username: string): Promise<Profile> => {
    const response = await api.get(`/api/v1/profile/username/${username}`);
    return response.data;
  },

  // Create profile

  createProfile: async (
    data: z.infer<typeof ProfileInsertSchema>
  ): Promise<ProfileSelectSchemaType> => {
    const response = await api.post('/api/v1/profile', data);
    return response.data;
  },

  // Update profile
  updateProfile: async (id: string, data: UpdateProfileRequest): Promise<Profile> => {
    const response = await api.patch(`/api/v1/profile/${id}`, data);
    return response.data;
  },

  // Delete profile
  deleteProfile: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/api/v1/profile/${id}`);
    return response.data;
  },

  // Upload cover image
  uploadCoverImage: async (id: string, file: File): Promise<Profile> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post(`/api/v1/profile/${id}/upload/cover`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Upload banner image
  uploadBannerImage: async (id: string, file: File): Promise<Profile> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post(`/api/v1/profile/${id}/upload/banner`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Upload profile photos
  uploadProfilePhotos: async (id: string, files: File[]): Promise<Profile> => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    const response = await api.post(`/api/v1/profile/${id}/upload/photos`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Remove profile photo
  removeProfilePhoto: async (id: string, imageId: string): Promise<{ message: string }> => {
    const response = await api.delete(`/api/v1/profile/${id}/images/${imageId}`);
    return response.data;
  },

  // Remove cover image
  removeCoverImage: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/api/v1/profile/${id}/cover`);
    return response.data;
  },

  // Get profile statistics
  getProfileStats: async (profileId: string): Promise<ProfileStats> => {
    const response = await api.get(`/api/v1/profile/${profileId}/stats`);
    return response.data;
  },

  // Get active participation by profile ID
  getActiveParticipation: async (
    profileId: string,
    params: { search?: string; page?: number; limit?: number } = {}
  ): Promise<PaginatedResponse<ContestParticipation>> => {
    const searchParams = new URLSearchParams();
    if (params.search) searchParams.append('search', params.search);
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());

    const response = await api.get(`/api/v1/profile/${profileId}/active-participation?${searchParams.toString()}`);
    return response.data;
  },
};

// Main useProfile hook
export const useProfile = () => {
  const queryClient = useQueryClient();

  // Profile queries
  const useProfileList = (params: { page?: number; limit?: number } = {}) => {
    return useQuery({
      queryKey: profileKeys.list(params),
      queryFn: () => profileApi.getProfiles(params),
    });
  };

  const useProfile = (id: string) => {
    return useQuery({
      queryKey: profileKeys.detail(id),
      queryFn: () => profileApi.getProfile(id),
      enabled: !!id,
    });
  };

  const useProfileByUserId = (userId: string) => {
    return useQuery({
      queryKey: profileKeys.byUserId(userId),
      queryFn: () => profileApi.getProfileByUserId(userId),
      enabled: !!userId,
    });
  };

  const useProfileByUsername = (username: string) => {
    return useQuery({
      queryKey: profileKeys.byUsername(username),
      queryFn: () => profileApi.getProfileByUsername(username),
      enabled: !!username,
    });
  };

  const useProfileStats = (profileId: string) => {
    return useQuery({
      queryKey: profileKeys.statsByProfileId(profileId),
      queryFn: () => profileApi.getProfileStats(profileId),
      enabled: !!profileId,
    });
  };

  const useActiveParticipation = (
    profileId: string,
    params: { search?: string; page?: number; limit?: number } = {}
  ) => {
    return useQuery({
      queryKey: profileKeys.activeParticipationByProfileId(profileId),
      queryFn: () => profileApi.getActiveParticipation(profileId, params),
      enabled: !!profileId,
    });
  };

  // Profile mutations
  const createProfile = useMutation({
    mutationFn: profileApi.createProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.lists() });
      // Invalidate session query to refresh user data with new profileId
      queryClient.invalidateQueries({ queryKey: ['session'] });
    },
  });

  const updateProfile = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProfileRequest }) =>
      profileApi.updateProfile(id, data),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: profileKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: profileKeys.lists() });
    },
  });

  const deleteProfile = useMutation({
    mutationFn: profileApi.deleteProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.lists() });
    },
  });

  const uploadCoverImage = useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) => profileApi.uploadCoverImage(id, file),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: profileKeys.detail(data.id) });
    },
  });

  const uploadBannerImage = useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) =>
      profileApi.uploadBannerImage(id, file),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: profileKeys.detail(data.id) });
    },
  });

  const uploadProfilePhotos = useMutation({
    mutationFn: ({ id, files }: { id: string; files: File[] }) =>
      profileApi.uploadProfilePhotos(id, files),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: profileKeys.detail(data.id) });
    },
  });

  const removeProfilePhoto = useMutation({
    mutationFn: ({ id, imageId }: { id: string; imageId: string }) =>
      profileApi.removeProfilePhoto(id, imageId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: profileKeys.detail(variables.id) });
    },
  });

  const removeCoverImage = useMutation({
    mutationFn: ({ id }: { id: string }) => profileApi.removeCoverImage(id),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: profileKeys.detail(variables.id) });
    },
  });

  return {
    // Profile queries
    useProfileList,
    useProfile,
    useProfileByUserId,
    useProfileByUsername,
    useProfileStats,
    useActiveParticipation,

    // Profile mutations
    createProfile,
    updateProfile,
    deleteProfile,
    uploadCoverImage,
    uploadBannerImage,
    uploadProfilePhotos,
    removeProfilePhoto,
    removeCoverImage,
  };
};