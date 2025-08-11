import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { CompetitionsListResponse } from '@/types/competitions.types';
import { useAuth } from '@/contexts/AuthContext';

const fetchCompetitions = async (): Promise<CompetitionsListResponse> => {
  const response = await api.get<CompetitionsListResponse>('/api/v1/contest');
  return response.data;
};

const fetchJoinedCompetitions = async (profileId: string): Promise<CompetitionsListResponse> => {
  const response = await api.get<CompetitionsListResponse>(`/api/v1/contest/${profileId}/joined`);
  return response.data;
};

// Join contest function
const joinContest = async (data: { profileId: string; contestId: string; coverImage?: string }) => {
  const response = await api.post('/api/v1/contest/join', { ...data, coverImage: data.coverImage || '' });
  return response.data;
};

// Leave contest function
const leaveContest = async (data: { profileId: string; contestId: string }) => {
  const response = await api.post('/api/v1/contest/leave', data);
  return response.data;
};

export const useCompetitions = () => {
  const { user, session, isAuthenticated } = useAuth();
  const profileId = session?.profileId || user?.profileId;
  const queryClient = useQueryClient();

  // Check if user needs to create a profile
  const needsProfileSetup = isAuthenticated && !profileId;

  const {
    data,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['competitions'],
    queryFn: fetchCompetitions,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });

  const competitions = data?.data || [];

  const {
    data: joinedData,
    isLoading: isLoadingJoined,
    error: joinedError,
    refetch: refetchJoined,
  } = useQuery({
    queryKey: ['competitions', 'joined', profileId],
    queryFn: () => fetchJoinedCompetitions(profileId as string),
    enabled: !!profileId,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  const joinedCompetitions = joinedData?.data || [];

  // Join contest mutation
  const joinContestMutation = useMutation({
    mutationFn: joinContest,
    onSuccess: () => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: ['competitions', 'joined', profileId] });
      queryClient.invalidateQueries({ queryKey: ['competitions'] });
    },
    onError: (error) => {
      console.error('Failed to join contest:', error);
    },
  });

  // Leave contest mutation
  const leaveContestMutation = useMutation({
    mutationFn: leaveContest,
    onSuccess: () => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: ['competitions', 'joined', profileId] });
      queryClient.invalidateQueries({ queryKey: ['competitions'] });
    },
    onError: (error) => {
      console.error('Failed to leave contest:', error);
    },
  });

  // Helper function to join a contest
  const handleJoinContest = async (contestId: string, coverImage?: string) => {
    if (!isAuthenticated) {
      throw new Error('You must be logged in to join a contest');
    }

    if (!profileId) {
      throw new Error('Profile setup required. Please complete your profile before joining contests. You can create a profile in your account settings.');
    }

    return joinContestMutation.mutateAsync({
      profileId,
      contestId,
      coverImage,
    });
  };

  // Helper function to leave a contest
  const handleLeaveContest = async (contestId: string) => {
    if (!isAuthenticated) {
      throw new Error('You must be logged in to leave a contest');
    }

    if (!profileId) {
      throw new Error('Profile setup required. Please complete your profile before leaving contests. You can create a profile in your account settings.');
    }

    return leaveContestMutation.mutateAsync({
      profileId,
      contestId,
    });
  };

  const getActiveCompetitions = () => {
    const now = new Date();
    return competitions.filter(comp => {
      const startDate = new Date(comp.startDate);
      const endDate = new Date(comp.endDate);
      return now >= startDate && now <= endDate;
    });
  };

  const getComingSoonCompetitions = () => {
    const now = new Date();
    return competitions.filter(comp => {
      const startDate = new Date(comp.startDate);
      return now < startDate;
    });
  };

  const getCompletedCompetitions = () => {
    const now = new Date();
    return competitions.filter(comp => {
      const endDate = new Date(comp.endDate);
      return now > endDate;
    });
  };

  // Check if user has joined a specific contest
  const hasJoinedContest = (contestId: string) => {
    return joinedCompetitions.some(comp => comp.id === contestId);
  };

  return {
    competitions,
    isLoading,
    error,
    refetch,
    joinedCompetitions,
    isLoadingJoined,
    joinedError,
    refetchJoined,
    getActiveCompetitions,
    getComingSoonCompetitions,
    getCompletedCompetitions,
    // Join/Leave functionality
    joinContest: handleJoinContest,
    leaveContest: handleLeaveContest,
    isJoining: joinContestMutation.isPending,
    isLeaving: leaveContestMutation.isPending,
    joinError: joinContestMutation.error,
    leaveError: leaveContestMutation.error,
    hasJoinedContest,
    // Profile status
    needsProfileSetup,
    profileId,
  };
}; 