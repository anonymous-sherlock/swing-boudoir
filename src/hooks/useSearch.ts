import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

// Search types based on the API specification
export interface SearchParams {
  page?: number;
  limit?: number;
  query?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ProfileSearchParams extends SearchParams {
  city?: string;
  country?: string;
  gender?: string;
  hasAvatar?: boolean;
}

export interface ContestSearchParams extends SearchParams {
  status?: 'active' | 'upcoming' | 'ended' | 'all' | "booked";
  minPrizePool?: number;
  maxPrizePool?: number;
  startDate?: string;
  endDate?: string;
  sortBy?: 'name' | 'startDate' | 'endDate' | 'prizePool' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface UserSearchParams extends SearchParams {
  role?: 'USER' | 'ADMIN' | 'MODERATOR';
  isActive?: boolean;
  hasProfile?: boolean;
}

// Response types
export interface PaginationInfo {
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: number | null;
  previousPage: number | null;
}

export interface ProfileSearchResult {
  id: string;
  userId: string;
  bio: string | null;
  avatarUrl: string | null;
  city: string | null;
  country: string | null;
  gender: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    username: string | null;
    displayUsername: string | null;
    name: string;
    email: string;
    image: string | null;
  };
}

export interface ContestSearchResult {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  prizePool: number;
  winnerProfileId: string | null;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'upcoming' | 'ended';
  slug: string;
  isVotingEnabled: boolean;
}

export interface UserSearchResult {
  id: string;
  username: string | null;
  displayUsername: string | null;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN' | 'MODERATOR';
  isActive: boolean;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  hasProfile: boolean;
}

export interface SearchResponse<T> {
  data: T[];
  pagination: PaginationInfo;
}

// Hook return type
export interface UseSearchReturn<T> {
  data: T[] | undefined;
  pagination: PaginationInfo | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  currentPage: number;
  totalPages: number;
  total: number;
}

// Search functions
const searchProfiles = async (params: ProfileSearchParams): Promise<SearchResponse<ProfileSearchResult>> => {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.append('page', params.page.toString());
  if (params.limit) searchParams.append('limit', params.limit.toString());
  if (params.query) searchParams.append('query', params.query);
  if (params.sortBy) searchParams.append('sortBy', params.sortBy);
  if (params.sortOrder) searchParams.append('sortOrder', params.sortOrder);
  if (params.city) searchParams.append('city', params.city);
  if (params.country) searchParams.append('country', params.country);
  if (params.gender) searchParams.append('gender', params.gender);
  if (params.hasAvatar !== undefined) searchParams.append('hasAvatar', params.hasAvatar.toString());

  const response = await api.get(`/api/v1/search/profiles?${searchParams.toString()}`);
  return response.data;
};

const searchContests = async (params: ContestSearchParams): Promise<SearchResponse<ContestSearchResult>> => {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.append('page', params.page.toString());
  if (params.limit) searchParams.append('limit', params.limit.toString());
  if (params.query) searchParams.append('query', params.query);
  if (params.sortBy) searchParams.append('sortBy', params.sortBy);
  if (params.sortOrder) searchParams.append('sortOrder', params.sortOrder);
  if (params.status) searchParams.append('status', params.status);
  if (params.minPrizePool) searchParams.append('minPrizePool', params.minPrizePool.toString());
  if (params.maxPrizePool) searchParams.append('maxPrizePool', params.maxPrizePool.toString());
  if (params.startDate) searchParams.append('startDate', params.startDate);
  if (params.endDate) searchParams.append('endDate', params.endDate);

  const response = await api.get(`/api/v1/search/contests?${searchParams.toString()}`);
  return response.data;
};

const searchUsers = async (params: UserSearchParams): Promise<SearchResponse<UserSearchResult>> => {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.append('page', params.page.toString());
  if (params.limit) searchParams.append('limit', params.limit.toString());
  if (params.query) searchParams.append('query', params.query);
  if (params.sortBy) searchParams.append('sortBy', params.sortBy);
  if (params.sortOrder) searchParams.append('sortOrder', params.sortOrder);
  if (params.role) searchParams.append('role', params.role);
  if (params.isActive !== undefined) searchParams.append('isActive', params.isActive.toString());
  if (params.hasProfile !== undefined) searchParams.append('hasProfile', params.hasProfile.toString());

  const response = await api.get(`/api/v1/search/users?${searchParams.toString()}`);
  return response.data;
};

// Helper hook for profiles search
const useProfileSearchInternal = (params: ProfileSearchParams, enabled: boolean = true): UseSearchReturn<ProfileSearchResult> => {
  const [currentPage, setCurrentPage] = useState(params.page || 1);

  const {
    data,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: [`search-profiles`, params, currentPage],
    queryFn: () => searchProfiles(params),
    enabled: enabled && !!params.query,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const pagination = data?.pagination;
  const hasNextPage = pagination?.hasNextPage || false;
  const hasPreviousPage = pagination?.hasPreviousPage || false;
  const totalPages = pagination?.totalPages || 0;
  const total = pagination?.total || 0;

  return {
    data: data?.data,
    pagination,
    isLoading,
    error: error as Error | null,
    refetch,
    hasNextPage,
    hasPreviousPage,
    currentPage,
    totalPages,
    total,
  };
};

// Helper hook for contests search
const useContestSearchInternal = (params: ContestSearchParams, enabled: boolean = true): UseSearchReturn<ContestSearchResult> => {
  const [currentPage, setCurrentPage] = useState(params.page || 1);

  const {
    data,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: [`search-contests`, params, currentPage],
    queryFn: () => searchContests(params),
    enabled: enabled && !!params.query,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const pagination = data?.pagination;
  const hasNextPage = pagination?.hasNextPage || false;
  const hasPreviousPage = pagination?.hasPreviousPage || false;
  const totalPages = pagination?.totalPages || 0;
  const total = pagination?.total || 0;

  return {
    data: data?.data,
    pagination,
    isLoading,
    error: error as Error | null,
    refetch,
    hasNextPage,
    hasPreviousPage,
    currentPage,
    totalPages,
    total,
  };
};

// Helper hook for users search
const useUserSearchInternal = (params: UserSearchParams, enabled: boolean = true): UseSearchReturn<UserSearchResult> => {
  const [currentPage, setCurrentPage] = useState(params.page || 1);

  const {
    data,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: [`search-users`, params, currentPage],
    queryFn: () => searchUsers(params),
    enabled: enabled && !!params.query,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const pagination = data?.pagination;
  const hasNextPage = pagination?.hasNextPage || false;
  const hasPreviousPage = pagination?.hasPreviousPage || false;
  const totalPages = pagination?.totalPages || 0;
  const total = pagination?.total || 0;

  return {
    data: data?.data,
    pagination,
    isLoading,
    error: error as Error | null,
    refetch,
    hasNextPage,
    hasPreviousPage,
    currentPage,
    totalPages,
    total,
  };
};

// Specialized hooks for each search type
export const useProfileSearch = (params: ProfileSearchParams, enabled: boolean = true) => {
  return useProfileSearchInternal(params, enabled);
};

export const useContestSearch = (params: ContestSearchParams, enabled: boolean = true) => {
  return useContestSearchInternal(params, enabled);
};

export const useUserSearch = (params: UserSearchParams, enabled: boolean = true) => {
  return useUserSearchInternal(params, enabled);
};

// Utility hook for global search across all types
export const useGlobalSearch = (query: string, enabled: boolean = true) => {
  const profileSearch = useProfileSearch({ query, limit: 5 }, enabled && !!query);
  const contestSearch = useContestSearch({ query, limit: 5 }, enabled && !!query);
  const userSearch = useUserSearch({ query, limit: 5 }, enabled && !!query);

  return {
    profiles: profileSearch,
    contests: contestSearch,
    users: userSearch,
    isLoading: profileSearch.isLoading || contestSearch.isLoading || userSearch.isLoading,
    hasResults: !!(profileSearch.data?.length || contestSearch.data?.length || userSearch.data?.length),
  };
};

