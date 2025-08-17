import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

// Types based on the API schema
export interface Profile {
  id: string;
  userId: string;
  bio: string | null;
  avatarUrl: string | null;
  phone: string | null;
  address: string;
  city: string | null;
  country: string | null;
  postalCode: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  hobbiesAndPassions: string | null;
  paidVoterMessage: string | null;
  freeVoterMessage: string | null;
  createdAt: string;
  updatedAt: string;
  lastFreeVoteAt: string | null;
  coverImageId: string | null;
  instagram: string | null;
  tiktok: string | null;
  youtube: string | null;
  facebook: string | null;
  twitter: string | null;
  linkedin: string | null;
  website: string | null;
  other: string | null;
  coverImage?: {
    id: string;
    key: string;
    caption: string | null;
    url: string;
  } | null;
  profilePhotos?: Array<{
    id: string;
    key: string;
    caption: string | null;
    url: string;
  }> | null;
  user: {
    name: string;
    displayName: string;
    username: string;
  };
}

export interface ProfileListResponse {
  data: Profile[];
  pagination: {
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextPage: number | null;
    previousPage: number | null;
  };
}

export interface CreateProfileData {
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
  instagram?: string | null;
  tiktok?: string | null;
  youtube?: string | null;
  facebook?: string | null;
  twitter?: string | null;
  linkedin?: string | null;
  website?: string | null;
  other?: string | null;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UpdateProfileData extends Partial<CreateProfileData> {}

// Hook for getting profile list with pagination
export function useProfiles(page: number = 1, limit: number = 20) {
  return useQuery({
    queryKey: ['profiles', page, limit],
    queryFn: async (): Promise<ProfileListResponse> => {
      const response = await api.get(`/api/v1/profile?page=${page}&limit=${limit}`);
      return response.data;
    },
  });
}

// Hook for getting a single profile by ID
export function useProfile(id: string) {
  return useQuery({
    queryKey: ['profile', id],
    queryFn: async (): Promise<Profile> => {
      const response = await api.get(`/api/v1/profile/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

// Hook for getting profile by user ID
export function useProfileByUserId(userId: string) {
  return useQuery({
    queryKey: ['profile', 'user', userId],
    queryFn: async (): Promise<Profile> => {
      const response = await api.get(`/api/v1/profile/user/${userId}`);
      return response.data;
    },
    enabled: !!userId,
  });
}

// Hook for getting profile by username
export function useProfileByUsername(username: string) {
  return useQuery({
    queryKey: ['profile', 'username', username],
    queryFn: async (): Promise<Profile> => {
      const response = await api.get(`/api/v1/profile/username/${username}`);
      return response.data;
    },
    enabled: !!username,
  });
}

// Hook for creating a new profile
export function useCreateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateProfileData): Promise<Profile> => {
      const response = await api.post('/api/v1/profile', data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch profiles list
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
    },
  });
}

// Hook for updating a profile
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateProfileData }): Promise<Profile> => {
      const response = await api.patch(`/api/v1/profile/${id}`, data);
      return response.data;
    },
    onSuccess: data => {
      // Invalidate and refetch specific profile and profiles list
      queryClient.invalidateQueries({ queryKey: ['profile', data.id] });
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
    },
  });
}

// Hook for deleting a profile
export function useDeleteProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<{ message: string }> => {
      const response = await api.delete(`/api/v1/profile/${id}`);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch profiles list
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
    },
  });
}

// Hook for uploading profile cover image
export function useUploadProfileCover() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, file }: { id: string; file: File }): Promise<Profile> => {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post(`/api/v1/profile/${id}/upload/cover`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: data => {
      // Invalidate and refetch specific profile and profiles list
      queryClient.invalidateQueries({ queryKey: ['profile', data.id] });
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
    },
  });
}

// Hook for uploading profile photos
export function useUploadProfilePhotos() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, files }: { id: string; files: File[] }): Promise<Profile> => {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });

      const response = await api.post(`/api/v1/profile/${id}/upload/photos`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: data => {
      // Invalidate and refetch specific profile and profiles list
      queryClient.invalidateQueries({ queryKey: ['profile', data.id] });
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
    },
  });
}

// Hook for removing profile photos
export function useRemoveProfilePhoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      imageId,
    }: {
      id: string;
      imageId: string;
    }): Promise<{ message: string }> => {
      const response = await api.delete(`/api/v1/profile/${id}/images/${imageId}`);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch profiles list
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
    },
  });
}
