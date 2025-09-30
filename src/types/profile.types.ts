import { User_Type } from "./auth.types";

// Profile types
export interface Profile {
    id: string;
    userId: string;
    bio: string | null;
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
    bannerImageId: string | null;
    // Social media links
    instagram: string | null;
    tiktok: string | null;
    youtube: string | null;
    facebook: string | null;
    twitter: string | null;
    linkedin: string | null;
    website: string | null;
    other: string | null;
    // Image objects
    coverImage?: {
        id: string;
        key: string;
        caption: string | null;
        url: string;
    } | null;
    bannerImage?: {
        id: string;
        key: string;
        caption: string | null;
        url: string;
    } | null;
    profilePhotos?:
    | {
        id: string;
        key: string;
        caption: string | null;
        url: string;
    }[]
    | null;
    user: {
        name: string;
        displayName: string;
        username: string;
        email: string;
        type: User_Type
    };
    rank: number | "N/A";
}

// Profile Stats interface
export interface ProfileStats {
    currentRank: number;
    totalCompetitions: number;
    totalEarnings: number;
    activeContests: number;
    totalVotesGiven: number;
    totalVotesReceived: number;
    winRate: number;
    totalParticipants: number;
    freeVotesReceived: number;
    paidVotesReceived: number;
}