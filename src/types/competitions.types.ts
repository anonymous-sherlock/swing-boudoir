import { Pagination } from './common.types';

/**
 * Award interface for competitions
 */
export interface Award {
  id: string;
  name: string;
  icon: string;
  contestId: string;
}

/**
 * Image interface for competitions
 */
export interface CompetitionImage {
  id: string;
  key: string;
  caption: string | null;
  url: string;
}

/**
 * Competition interface matching the API schema
 */
export interface Competition {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  startDate: string;
  prizePool: number;
  endDate: string;
  winnerProfileId: string | null;
  awards: Award[];
  images: CompetitionImage[];
}

/**
 * Competitions API response with pagination
 */
export interface CompetitionsListResponse {
  data: Competition[];
  pagination: Pagination;
}

