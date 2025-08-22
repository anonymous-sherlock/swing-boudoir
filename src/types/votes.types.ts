// Vote types based on actual API structure

export interface Vote {
  id: string;
  type: 'FREE' | 'PAID';
  voterId: string;
  voteeId: string;
  contestId: string;
  count: number;
  paymentId: string | null;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

// Free vote request
export interface FreeVoteRequest {
  voterId: string;
  voteeId: string;
  contestId: string;
  comment?: string | null;
}

// Paid vote request
export interface PaidVoteRequest {
  voteeId: string;
  voterId: string;
  contestId: string;
  voteCount: number;
}

// Free vote availability check
export interface FreeVoteAvailabilityRequest {
  profileId: string;
}

export interface FreeVoteAvailabilityResponse {
  available: boolean;
  nextAvailableAt?: string;
}

// Latest votes response
export interface LatestVote {
  votee: {
    id: string;
    name: string;
    profilePicture: string;
  } | null;
  voter: {
    id: string;
    name: string;
    profilePicture: string;
  } | null;
  totalVotes: number | null;
  comment: string | null;
  createdAt: string;
}

export interface LatestVotesResponse {
  data: LatestVote[];
  pagination: {
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextPage: number | null;
    previousPage: number | null;
  };
}

// Votes by profile
export interface ProfileVote {
  profileId: string;
  username: string;
  name: string;
  contestName: string;
  votedOn: string;
  count: number;
  amount: number | null;
  comment: string | null;
}

export interface ProfileVotesResponse {
  data: ProfileVote[];
  pagination: {
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextPage: number | null;
    previousPage: number | null;
  };
}

// Top voters for a profile
export interface TopVoter {
  rank: number;
  profileId: string;
  userName: string;
  profilePicture: string;
  totalVotesGiven: number;
  comment: string | null;
  lastVoteAt: string;
}

// Vote multiplier periods (admin)
export interface VoteMultiplierPeriod {
  id: string;
  multiplierTimes: number;
  isActive: boolean;
  startTime: string | null;
  endTime: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface CreateVoteMultiplierRequest {
  multiplierTimes: number;
  isActive: boolean;
  startTime?: string | null;
  endTime?: string | null;
}

export interface UpdateVoteMultiplierRequest {
  multiplierTimes: number;
  isActive: boolean;
  startTime?: string | null;
  endTime?: string | null;
}
