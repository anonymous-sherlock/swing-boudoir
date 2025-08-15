import { useQuery } from "@tanstack/react-query";
import { hc } from "@/lib/api-client";

export interface LeaderboardEntry {
  rank: number;
  profileId: string;
  userId: string;
  username: string;
  displayUsername: string | null;
  avatarUrl: string | null;
  bio: string | null;
  totalVotes: number;
  freeVotes: number;
  paidVotes: number;
  createdAt: string;
}

export interface LeaderboardResponse {
  data: LeaderboardEntry[];
  pagination: {
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextPage: number | null;
    previousPage: number | null;
  };
}

export function useLeaderboard(page: number = 1, limit: number = 50) {
  return useQuery({
    queryKey: ['leaderboard', page, limit],
    queryFn: async () => {
      const response = await hc.getApiv1leaderboard({
        queries: {
          page,
          limit
        }
      });
      return response;
    },
  });
}
