import { Contest_Status, Contest_Visibility } from "@/lib/validations/contest.schema"

export interface Contest {
    id: string
    name: string
    description: string
    prizePool: number
    startDate: string
    endDate: string
    registrationDeadline: string | null
    resultAnnounceDate: string | null
    slug: string
    status: keyof typeof Contest_Status
    visibility: keyof typeof Contest_Visibility
    isFeatured: boolean
    isVerified: boolean
    isVotingEnabled: boolean
    rules: string | null
    requirements: string | null
    winnerProfileId: string | null
    createdAt: string
    updatedAt: string
    awards: Award[]
    images?: ContestImage[] | null
}

export interface Award {
    id: string
    name: string
    icon: string
    contestId: string
}

export interface ContestImage {
    id: string
    key: string
    caption: string | null
    url: string
}

export type UpdateContestData = Partial<Omit<Contest, "id" | "createdAt" | "updatedAt" | "images" | "awards">>

// Contest Participation Types
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

// Contest Participants Types
export interface ContestParticipant {
  id: string
  coverImage: {
    id: string
    key: string
    url: string
    caption: string | null
  } | null
  isApproved: boolean
  isParticipating: boolean | null
  createdAt: string
  updatedAt: string
  profile: {
    id: string
    bio: string | null
    user: {
      id: string
      email: string
      name: string
      image: string | null
      username: string | null
    } | null
  } | null
  totalFreeVotes: number
  totalPaidVotes: number
}

export interface ContestParticipantsResponse {
  data: ContestParticipant[]
  pagination: {
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
    nextPage: number | null
    previousPage: number | null
  }
  contest: {
    totalFreeVotes: number
    totalPaidVotes: number
    totalVotes: number
  }
}

// API Response types for approval toggles
export interface ToggleApprovalResponse {
  participation: ContestParticipation;
  message: string;
}

export interface BulkToggleApprovalResponse {
  updatedCount: number;
  message: string;
}