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
