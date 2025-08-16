import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

const postApiv1users_Body = z
  .object({
    email: z.string().email(),
    username: z.string().min(3).max(100),
    name: z.string(),
    role: z.enum(["USER", "ADMIN", "MODERATOR"]),
    image: z.string().nullable(),
    password: z.string().min(6),
  })
  .passthrough();
const patchApiv1usersId_Body = z
  .object({
    email: z.string().email(),
    username: z.string().min(3).max(100),
    name: z.string(),
    role: z.enum(["USER", "ADMIN", "MODERATOR"]),
    image: z.string().nullable(),
    password: z.string().min(6),
  })
  .partial()
  .passthrough();
const postApiv1profile_Body = z
  .object({
    userId: z.string(),
    bio: z.string().nullable(),
    phone: z.string().max(20).nullable(),
    address: z.string(),
    city: z.string().max(100).nullable(),
    country: z.string().max(100).nullable(),
    postalCode: z.string().max(20).nullable(),
    dateOfBirth: z.string().nullable(),
    gender: z.string().max(50).nullable(),
    hobbiesAndPassions: z.string().nullable(),
    paidVoterMessage: z.string().nullable(),
    freeVoterMessage: z.string().nullable(),
    lastFreeVoteAt: z.string().nullable(),
    coverImageId: z.string().nullable(),
    instagram: z.string().max(255).nullish(),
    tiktok: z.string().max(255).nullish(),
    youtube: z.string().max(255).nullish(),
    facebook: z.string().max(255).nullish(),
    twitter: z.string().max(255).nullish(),
    linkedin: z.string().max(255).nullish(),
    website: z.string().max(255).nullish(),
    other: z.string().max(255).nullish(),
    bannerImageId: z.string().nullable(),
  })
  .passthrough();
const patchApiv1profileId_Body = z
  .object({
    userId: z.string(),
    bio: z.string().nullable(),
    phone: z.string().max(20).nullable(),
    address: z.string(),
    city: z.string().max(100).nullable(),
    country: z.string().max(100).nullable(),
    postalCode: z.string().max(20).nullable(),
    dateOfBirth: z.string().nullable(),
    gender: z.string().max(50).nullable(),
    hobbiesAndPassions: z.string().nullable(),
    paidVoterMessage: z.string().nullable(),
    freeVoterMessage: z.string().nullable(),
    lastFreeVoteAt: z.string().nullable(),
    coverImageId: z.string().nullable(),
    instagram: z.string().max(255).nullable(),
    tiktok: z.string().max(255).nullable(),
    youtube: z.string().max(255).nullable(),
    facebook: z.string().max(255).nullable(),
    twitter: z.string().max(255).nullable(),
    linkedin: z.string().max(255).nullable(),
    website: z.string().max(255).nullable(),
    other: z.string().max(255).nullable(),
    bannerImageId: z.string().nullable(),
  })
  .partial()
  .passthrough();
const postApiv1profileIduploadphotos_Body = z
  .object({ files: z.union([z.unknown(), z.array(z.unknown())]) })
  .passthrough();
const postApiv1notifications_Body = z
  .object({
    message: z.string(),
    profileId: z.string(),
    icon: z.enum(["WARNING", "SUCESS", "INFO"]).optional(),
    action: z.string().optional(),
  })
  .passthrough();
const putApiv1notificationsId_Body = z
  .object({
    message: z.string(),
    profileId: z.string(),
    isRead: z.boolean().default(false),
    archived: z.boolean().default(false),
    icon: z.enum(["WARNING", "SUCESS", "INFO"]).nullable(),
    action: z.string().nullable(),
  })
  .partial()
  .passthrough();
const postApiv1contest_Body = z
  .object({
    name: z.string().min(3),
    description: z.string(),
    prizePool: z.number(),
    slug: z.string().optional(),
    status: z.enum([
      "DRAFT",
      "PUBLISHED",
      "ACTIVE",
      "VOTING",
      "JUDGING",
      "COMPLETED",
      "CANCELLED",
      "SUSPENDED",
    ]),
    visibility: z.enum(["PUBLIC", "PRIVATE", "INVITE_ONLY", "RESTRICTED"]),
    startDate: z.string().nullish(),
    endDate: z.string().nullish(),
    rules: z.string().nullish(),
    requirements: z.string().nullish(),
    awards: z.array(
      z
        .object({ name: z.string().min(1), icon: z.string().min(1) })
        .passthrough()
    ),
  })
  .passthrough();
const patchApiv1contestId_Body = z
  .object({
    name: z.string().min(3),
    description: z.string(),
    prizePool: z.number(),
    slug: z.string(),
    status: z.enum([
      "DRAFT",
      "PUBLISHED",
      "ACTIVE",
      "VOTING",
      "JUDGING",
      "COMPLETED",
      "CANCELLED",
      "SUSPENDED",
    ]),
    visibility: z.enum(["PUBLIC", "PRIVATE", "INVITE_ONLY", "RESTRICTED"]),
    startDate: z.string().nullable(),
    endDate: z.string().nullable(),
    rules: z.string().nullable(),
    requirements: z.string().nullable(),
  })
  .partial()
  .passthrough();
const postApiv1contestContestIdawards_Body = z.array(
  z.object({ name: z.string().min(1), icon: z.string().min(1) }).passthrough()
);
const patchApiv1awardsId_Body = z
  .object({ name: z.string().min(1), icon: z.string().min(1) })
  .partial()
  .passthrough();
const postApiv1contestjoin_Body = z
  .object({
    profileId: z.string(),
    contestId: z.string(),
    isParticipating: z.boolean().optional(),
  })
  .passthrough();
const postApiv1contestleave_Body = z
  .object({ contestId: z.string(), profileId: z.string() })
  .passthrough();
const postApiv1contestvotefree_Body = z
  .object({ voterId: z.string(), voteeId: z.string(), contestId: z.string() })
  .passthrough();
const postApiv1contestvotepay_Body = z
  .object({
    voteeId: z.string(),
    voterId: z.string(),
    contestId: z.string(),
    voteCount: z.number().int().gt(0),
  })
  .passthrough();
const postApiv1voteMultiplierPeriods_Body = z
  .object({
    multiplierTimes: z.number(),
    isActive: z.boolean(),
    startTime: z.string().nullable(),
    endTime: z.string().nullable(),
  })
  .passthrough();

export const schemas = {
  postApiv1users_Body,
  patchApiv1usersId_Body,
  postApiv1profile_Body,
  patchApiv1profileId_Body,
  postApiv1profileIduploadphotos_Body,
  postApiv1notifications_Body,
  putApiv1notificationsId_Body,
  postApiv1contest_Body,
  patchApiv1contestId_Body,
  postApiv1contestContestIdawards_Body,
  patchApiv1awardsId_Body,
  postApiv1contestjoin_Body,
  postApiv1contestleave_Body,
  postApiv1contestvotefree_Body,
  postApiv1contestvotepay_Body,
  postApiv1voteMultiplierPeriods_Body,
};

const endpoints = makeApi([
  {
    method: "get",
    path: "/api/v1/analytics/contests",
    alias: "getApiv1analyticscontests",
    description: `Get contest-specific analytics including total, active, upcoming contests and prize pool`,
    requestFormat: "json",
    response: z
      .object({
        total: z.number(),
        active: z.number(),
        upcoming: z.number(),
        prizePool: z.number(),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Authentication required`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/analytics/dashboard",
    alias: "getApiv1analyticsdashboard",
    description: `Get comprehensive statistics for admin dashboard including total competitions, users, votes, prize pool, and onboarded users`,
    requestFormat: "json",
    response: z
      .object({
        totalCompetitions: z.number(),
        totalUsers: z.number(),
        totalVotes: z.number(),
        totalPrizePool: z.number(),
        totalOnboardedUsers: z.number(),
        freeVotes: z.number(),
        paidVotes: z.number(),
        activeCompetitions: z.number(),
        completedCompetitions: z.number(),
        totalParticipants: z.number(),
        totalRevenue: z.number(),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Authentication required`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/analytics/detailed",
    alias: "getApiv1analyticsdetailed",
    description: `Get detailed analytics with time-based data and breakdowns`,
    requestFormat: "json",
    parameters: [
      {
        name: "period",
        type: "Query",
        schema: z
          .enum(["7d", "30d", "90d", "1y", "all"])
          .optional()
          .default("30d"),
      },
    ],
    response: z
      .object({
        period: z.string(),
        userGrowth: z
          .object({
            total: z.number(),
            newThisPeriod: z.number(),
            growthRate: z.number(),
          })
          .passthrough(),
        voteActivity: z
          .object({
            total: z.number(),
            thisPeriod: z.number(),
            averagePerDay: z.number(),
            freeVotes: z.number(),
            paidVotes: z.number(),
          })
          .passthrough(),
        competitionMetrics: z
          .object({
            total: z.number(),
            active: z.number(),
            completed: z.number(),
            averagePrizePool: z.number(),
            totalPrizePool: z.number(),
          })
          .passthrough(),
        revenueMetrics: z
          .object({
            total: z.number(),
            thisPeriod: z.number(),
            averagePerVote: z.number(),
            conversionRate: z.number(),
          })
          .passthrough(),
        participationMetrics: z
          .object({
            totalParticipants: z.number(),
            activeParticipants: z.number(),
            averageParticipationRate: z.number(),
          })
          .passthrough(),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Authentication required`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/awards/:id",
    alias: "getApiv1awardsId",
    description: `Get a specific award by ID`,
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z
      .object({
        id: z.string(),
        name: z.string().min(1),
        icon: z.string().min(1),
        contestId: z.string(),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Authentication required`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
      {
        status: 404,
        description: `Resource not found`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: "patch",
    path: "/api/v1/awards/:id",
    alias: "patchApiv1awardsId",
    description: `Update a specific award by ID`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        description: `The award data to update`,
        type: "Body",
        schema: patchApiv1awardsId_Body,
      },
      {
        name: "id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z
      .object({
        id: z.string(),
        name: z.string().min(1),
        icon: z.string().min(1),
        contestId: z.string(),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Authentication required`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
      {
        status: 404,
        description: `Resource not found`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
      {
        status: 422,
        description: `The validation error(s)`,
        schema: z
          .object({
            success: z.boolean(),
            error: z
              .object({
                issues: z.array(
                  z
                    .object({
                      code: z.string(),
                      path: z.array(z.union([z.string(), z.number()])),
                      message: z.string().optional(),
                    })
                    .passthrough()
                ),
                name: z.string(),
              })
              .passthrough(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: "delete",
    path: "/api/v1/awards/:id",
    alias: "deleteApiv1awardsId",
    description: `Delete a specific award by ID`,
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.object({ message: z.string() }).passthrough(),
    errors: [
      {
        status: 401,
        description: `Authentication required`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
      {
        status: 404,
        description: `Resource not found`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/contest",
    alias: "getApiv1contest",
    description: `Get a list of all contest`,
    requestFormat: "json",
    parameters: [
      {
        name: "page",
        type: "Query",
        schema: z.number().nullish().default(1),
      },
      {
        name: "limit",
        type: "Query",
        schema: z.number().nullish().default(20),
      },
    ],
    response: z
      .object({
        data: z.array(
          z
            .object({
              id: z.string(),
              name: z.string().min(3),
              description: z.string(),
              prizePool: z.number(),
              startDate: z.string(),
              endDate: z.string(),
              registrationDeadline: z.string().nullable(),
              resultAnnounceDate: z.string().nullable(),
              slug: z.string(),
              status: z.enum([
                "DRAFT",
                "PUBLISHED",
                "ACTIVE",
                "VOTING",
                "JUDGING",
                "COMPLETED",
                "CANCELLED",
                "SUSPENDED",
              ]),
              visibility: z.enum([
                "PUBLIC",
                "PRIVATE",
                "INVITE_ONLY",
                "RESTRICTED",
              ]),
              isFeatured: z.boolean(),
              isVerified: z.boolean(),
              isVotingEnabled: z.boolean(),
              rules: z.string().nullable(),
              requirements: z.string().nullable(),
              winnerProfileId: z.string().nullable(),
              createdAt: z.string(),
              updatedAt: z.string(),
              awards: z.array(
                z
                  .object({
                    id: z.string(),
                    name: z.string().min(1),
                    icon: z.string().min(1),
                    contestId: z.string(),
                  })
                  .passthrough()
              ),
              images: z
                .array(
                  z
                    .object({
                      id: z.string(),
                      key: z.string(),
                      caption: z.string().nullable(),
                      url: z.string(),
                    })
                    .passthrough()
                )
                .nullable(),
            })
            .passthrough()
        ),
        pagination: z
          .object({
            total: z.number(),
            totalPages: z.number(),
            hasNextPage: z.boolean(),
            hasPreviousPage: z.boolean(),
            nextPage: z.number().nullable(),
            previousPage: z.number().nullable(),
          })
          .passthrough(),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Authentication required`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: "post",
    path: "/api/v1/contest",
    alias: "postApiv1contest",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        description: `The Contest to create`,
        type: "Body",
        schema: postApiv1contest_Body,
      },
    ],
    response: z
      .object({
        id: z.string(),
        name: z.string().min(3),
        description: z.string(),
        prizePool: z.number(),
        startDate: z.string(),
        endDate: z.string(),
        registrationDeadline: z.string().nullable(),
        resultAnnounceDate: z.string().nullable(),
        slug: z.string(),
        status: z.enum([
          "DRAFT",
          "PUBLISHED",
          "ACTIVE",
          "VOTING",
          "JUDGING",
          "COMPLETED",
          "CANCELLED",
          "SUSPENDED",
        ]),
        visibility: z.enum(["PUBLIC", "PRIVATE", "INVITE_ONLY", "RESTRICTED"]),
        isFeatured: z.boolean(),
        isVerified: z.boolean(),
        isVotingEnabled: z.boolean(),
        rules: z.string().nullable(),
        requirements: z.string().nullable(),
        winnerProfileId: z.string().nullable(),
        createdAt: z.string(),
        updatedAt: z.string(),
        awards: z.array(
          z
            .object({
              id: z.string(),
              name: z.string().min(1),
              icon: z.string().min(1),
              contestId: z.string(),
            })
            .passthrough()
        ),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Authentication required`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
      {
        status: 422,
        description: `The validation error(s)`,
        schema: z
          .object({
            success: z.boolean(),
            error: z
              .object({
                issues: z.array(
                  z
                    .object({
                      code: z.string(),
                      path: z.array(z.union([z.string(), z.number()])),
                      message: z.string().optional(),
                    })
                    .passthrough()
                ),
                name: z.string(),
              })
              .passthrough(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: "post",
    path: "/api/v1/contest/:contestId/awards",
    alias: "postApiv1contestContestIdawards",
    description: `Create awards for a specific contest`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        description: `The awards to create for the contest`,
        type: "Body",
        schema: postApiv1contestContestIdawards_Body,
      },
      {
        name: "contestId",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.array(
      z
        .object({
          id: z.string(),
          name: z.string().min(1),
          icon: z.string().min(1),
          contestId: z.string(),
        })
        .passthrough()
    ),
    errors: [
      {
        status: 401,
        description: `Authentication required`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
      {
        status: 404,
        description: `Resource not found`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
      {
        status: 422,
        description: `The validation error(s)`,
        schema: z
          .object({
            success: z.boolean(),
            error: z
              .object({
                issues: z.array(
                  z
                    .object({
                      code: z.string(),
                      path: z.array(z.union([z.string(), z.number()])),
                      message: z.string().optional(),
                    })
                    .passthrough()
                ),
                name: z.string(),
              })
              .passthrough(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/contest/:contestId/awards",
    alias: "getApiv1contestContestIdawards",
    description: `Get all awards for a specific contest`,
    requestFormat: "json",
    parameters: [
      {
        name: "contestId",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.array(
      z
        .object({
          id: z.string(),
          name: z.string().min(1),
          icon: z.string().min(1),
          contestId: z.string(),
        })
        .passthrough()
    ),
    errors: [
      {
        status: 401,
        description: `Authentication required`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
      {
        status: 404,
        description: `Resource not found`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/contest/:contestId/check-participation/:profileId",
    alias: "getApiv1contestContestIdcheckParticipationProfileId",
    description: `Check if a specific profile has joined a contest`,
    requestFormat: "json",
    parameters: [
      {
        name: "contestId",
        type: "Path",
        schema: z.string(),
      },
      {
        name: "profileId",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z
      .object({
        hasJoined: z.boolean(),
        participation: z
          .object({
            id: z.string(),
            profileId: z.string(),
            contestId: z.string(),
            mediaId: z.string().nullable(),
            coverImage: z
              .object({
                id: z.string(),
                key: z.string(),
                name: z.string(),
                url: z.string(),
                size: z.number().nullable(),
                type: z.string().nullable(),
                status: z.enum(["FAILED", "PROCESSING", "COMPLETED"]),
                mediaType: z.enum([
                  "COVER_IMAGE",
                  "CONTEST_IMAGE",
                  "CONTEST_PARTICIPATION_COVER",
                  "PROFILE_IMAGE",
                  "PROFILE_COVER_IMAGE",
                  "PROFILE_BANNER_IMAGE",
                ]),
                createdAt: z.string(),
                updatedAt: z.string(),
                profileId: z.string().nullable(),
                caption: z.string().nullable(),
                contestId: z.string().nullable(),
              })
              .passthrough()
              .nullable(),
            isApproved: z.boolean(),
            isParticipating: z.boolean().nullable(),
            createdAt: z.string(),
            updatedAt: z.string(),
          })
          .passthrough()
          .nullable(),
        contest: z
          .object({
            id: z.string(),
            name: z.string().min(3),
            description: z.string(),
            prizePool: z.number(),
            startDate: z.string(),
            endDate: z.string(),
            registrationDeadline: z.string().nullable(),
            resultAnnounceDate: z.string().nullable(),
            slug: z.string(),
            status: z.enum([
              "DRAFT",
              "PUBLISHED",
              "ACTIVE",
              "VOTING",
              "JUDGING",
              "COMPLETED",
              "CANCELLED",
              "SUSPENDED",
            ]),
            visibility: z.enum([
              "PUBLIC",
              "PRIVATE",
              "INVITE_ONLY",
              "RESTRICTED",
            ]),
            isFeatured: z.boolean(),
            isVerified: z.boolean(),
            isVotingEnabled: z.boolean(),
            rules: z.string().nullable(),
            requirements: z.string().nullable(),
            winnerProfileId: z.string().nullable(),
            createdAt: z.string(),
            updatedAt: z.string(),
          })
          .passthrough(),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Authentication required`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
      {
        status: 404,
        description: `Contest or profile not found`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/contest/:contestId/participants",
    alias: "getApiv1contestContestIdparticipants",
    description: `Get all participants of a specific contest`,
    requestFormat: "json",
    parameters: [
      {
        name: "contestId",
        type: "Path",
        schema: z.string(),
      },
      {
        name: "page",
        type: "Query",
        schema: z.number().nullish().default(1),
      },
      {
        name: "limit",
        type: "Query",
        schema: z.number().nullish().default(20),
      },
    ],
    response: z
      .object({
        data: z.array(
          z
            .object({
              id: z.string(),
              contestId: z.string(),
              mediaId: z.string().nullable(),
              coverImage: z
                .object({
                  id: z.string(),
                  key: z.string(),
                  name: z.string(),
                  url: z.string(),
                  size: z.number().nullable(),
                  type: z.string().nullable(),
                  status: z.enum(["FAILED", "PROCESSING", "COMPLETED"]),
                  mediaType: z.enum([
                    "COVER_IMAGE",
                    "CONTEST_IMAGE",
                    "CONTEST_PARTICIPATION_COVER",
                    "PROFILE_IMAGE",
                    "PROFILE_COVER_IMAGE",
                    "PROFILE_BANNER_IMAGE",
                  ]),
                  createdAt: z.string(),
                  updatedAt: z.string(),
                  profileId: z.string().nullable(),
                  caption: z.string().nullable(),
                  contestId: z.string().nullable(),
                })
                .passthrough()
                .nullable(),
              isApproved: z.boolean(),
              isParticipating: z.boolean().nullable(),
              createdAt: z.string(),
              updatedAt: z.string(),
              profile: z
                .object({
                  id: z.string(),
                  bio: z.string().nullable(),
                  freeVoterMessage: z.string().nullable(),
                  hobbiesAndPassions: z.string().nullable(),
                  paidVoterMessage: z.string().nullable(),
                  user: z
                    .object({
                      id: z.string(),
                      email: z.string().email(),
                      name: z.string(),
                      image: z.string().nullable(),
                    })
                    .passthrough()
                    .nullable(),
                })
                .passthrough()
                .nullable(),
            })
            .passthrough()
        ),
        pagination: z
          .object({
            total: z.number(),
            totalPages: z.number(),
            hasNextPage: z.boolean(),
            hasPreviousPage: z.boolean(),
            nextPage: z.number().nullable(),
            previousPage: z.number().nullable(),
          })
          .passthrough(),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Authentication required`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
      {
        status: 404,
        description: `Contest not found`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/contest/:id",
    alias: "getApiv1contestId",
    description: `Get a specific contest by ID`,
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z
      .object({
        id: z.string(),
        name: z.string().min(3),
        description: z.string(),
        prizePool: z.number(),
        startDate: z.string(),
        endDate: z.string(),
        registrationDeadline: z.string().nullable(),
        resultAnnounceDate: z.string().nullable(),
        slug: z.string(),
        status: z.enum([
          "DRAFT",
          "PUBLISHED",
          "ACTIVE",
          "VOTING",
          "JUDGING",
          "COMPLETED",
          "CANCELLED",
          "SUSPENDED",
        ]),
        visibility: z.enum(["PUBLIC", "PRIVATE", "INVITE_ONLY", "RESTRICTED"]),
        isFeatured: z.boolean(),
        isVerified: z.boolean(),
        isVotingEnabled: z.boolean(),
        rules: z.string().nullable(),
        requirements: z.string().nullable(),
        winnerProfileId: z.string().nullable(),
        createdAt: z.string(),
        updatedAt: z.string(),
        awards: z.array(
          z
            .object({
              id: z.string(),
              name: z.string().min(1),
              icon: z.string().min(1),
              contestId: z.string(),
            })
            .passthrough()
        ),
        images: z
          .array(
            z
              .object({
                id: z.string(),
                key: z.string(),
                caption: z.string().nullable(),
                url: z.string(),
              })
              .passthrough()
          )
          .nullable(),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Authentication required`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
      {
        status: 404,
        description: `Resource not found`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: "patch",
    path: "/api/v1/contest/:id",
    alias: "patchApiv1contestId",
    description: `Update a specific contest by ID`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        description: `The contest data to update`,
        type: "Body",
        schema: patchApiv1contestId_Body,
      },
      {
        name: "id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z
      .object({
        id: z.string(),
        name: z.string().min(3),
        description: z.string(),
        prizePool: z.number(),
        startDate: z.string(),
        endDate: z.string(),
        registrationDeadline: z.string().nullable(),
        resultAnnounceDate: z.string().nullable(),
        slug: z.string(),
        status: z.enum([
          "DRAFT",
          "PUBLISHED",
          "ACTIVE",
          "VOTING",
          "JUDGING",
          "COMPLETED",
          "CANCELLED",
          "SUSPENDED",
        ]),
        visibility: z.enum(["PUBLIC", "PRIVATE", "INVITE_ONLY", "RESTRICTED"]),
        isFeatured: z.boolean(),
        isVerified: z.boolean(),
        isVotingEnabled: z.boolean(),
        rules: z.string().nullable(),
        requirements: z.string().nullable(),
        winnerProfileId: z.string().nullable(),
        createdAt: z.string(),
        updatedAt: z.string(),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Authentication required`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
      {
        status: 404,
        description: `Resource not found`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
      {
        status: 422,
        description: `The validation error(s)`,
        schema: z
          .object({
            success: z.boolean(),
            error: z
              .object({
                issues: z.array(
                  z
                    .object({
                      code: z.string(),
                      path: z.array(z.union([z.string(), z.number()])),
                      message: z.string().optional(),
                    })
                    .passthrough()
                ),
                name: z.string(),
              })
              .passthrough(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: "delete",
    path: "/api/v1/contest/:id",
    alias: "deleteApiv1contestId",
    description: `Delete a specific contest by ID`,
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.object({ message: z.string() }).passthrough(),
    errors: [
      {
        status: 401,
        description: `Authentication required`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
      {
        status: 404,
        description: `Resource not found`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: "delete",
    path: "/api/v1/contest/:id/images/:imageId",
    alias: "deleteApiv1contestIdimagesImageId",
    description: `Remove a specific image from a contest`,
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string(),
      },
      {
        name: "imageId",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.object({ message: z.string() }).passthrough(),
    errors: [
      {
        status: 400,
        description: `Failed to remove image`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
      {
        status: 404,
        description: `Contest or image not found`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/contest/:id/leaderboard",
    alias: "getApiv1contestIdleaderboard",
    description: `Get leaderboard for a specific contest`,
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string(),
      },
      {
        name: "page",
        type: "Query",
        schema: z.number().nullish().default(1),
      },
      {
        name: "limit",
        type: "Query",
        schema: z.number().nullish().default(20),
      },
    ],
    response: z
      .object({
        data: z.array(
          z
            .object({
              rank: z.number(),
              profileId: z.string(),
              username: z.string(),
              displayUsername: z.string().nullable(),
              avatarUrl: z.string().nullable(),
              bio: z.string().nullable(),
              totalVotes: z.number(),
              freeVotes: z.number(),
              paidVotes: z.number(),
              isParticipating: z.boolean(),
              coverImage: z.string().nullable(),
              isApproved: z.boolean(),
            })
            .passthrough()
        ),
        pagination: z
          .object({
            total: z.number(),
            totalPages: z.number(),
            hasNextPage: z.boolean(),
            hasPreviousPage: z.boolean(),
            nextPage: z.number().nullable(),
            previousPage: z.number().nullable(),
          })
          .passthrough(),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Authentication required`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
      {
        status: 404,
        description: `Contest not found`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/contest/:id/stats",
    alias: "getApiv1contestIdstats",
    description: `Get statistics for a specific contest`,
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z
      .object({
        contestId: z.string(),
        contestName: z.string(),
        totalParticipants: z.number(),
        totalVotes: z.number(),
        freeVotes: z.number(),
        paidVotes: z.number(),
        totalPrizePool: z.number(),
        startDate: z.string(),
        endDate: z.string(),
        isActive: z.boolean(),
        daysRemaining: z.number().optional(),
        participationRate: z.number(),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Authentication required`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
      {
        status: 404,
        description: `Contest not found`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: "post",
    path: "/api/v1/contest/:id/upload/images",
    alias: "postApiv1contestIduploadimages",
    description: `Upload single or multiple images for a specific contest`,
    requestFormat: "form-data",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: postApiv1profileIduploadphotos_Body,
      },
      {
        name: "id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z
      .object({
        id: z.string(),
        name: z.string().min(3),
        description: z.string(),
        prizePool: z.number(),
        startDate: z.string(),
        endDate: z.string(),
        registrationDeadline: z.string().nullable(),
        resultAnnounceDate: z.string().nullable(),
        slug: z.string(),
        status: z.enum([
          "DRAFT",
          "PUBLISHED",
          "ACTIVE",
          "VOTING",
          "JUDGING",
          "COMPLETED",
          "CANCELLED",
          "SUSPENDED",
        ]),
        visibility: z.enum(["PUBLIC", "PRIVATE", "INVITE_ONLY", "RESTRICTED"]),
        isFeatured: z.boolean(),
        isVerified: z.boolean(),
        isVotingEnabled: z.boolean(),
        rules: z.string().nullable(),
        requirements: z.string().nullable(),
        winnerProfileId: z.string().nullable(),
        createdAt: z.string(),
        updatedAt: z.string(),
        awards: z.array(
          z
            .object({
              id: z.string(),
              name: z.string().min(1),
              icon: z.string().min(1),
              contestId: z.string(),
            })
            .passthrough()
        ),
      })
      .passthrough(),
    errors: [
      {
        status: 400,
        description: `Upload failed`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
      {
        status: 404,
        description: `Contest not found`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/contest/:id/winner",
    alias: "getApiv1contestIdwinner",
    description: `Get the winner of a specific contest`,
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z
      .object({
        winner: z
          .object({
            id: z.string(),
            userId: z.string(),
            bio: z.string().nullable(),
            phone: z.string().max(20).nullable(),
            address: z.string(),
            city: z.string().max(100).nullable(),
            country: z.string().max(100).nullable(),
            postalCode: z.string().max(20).nullable(),
            dateOfBirth: z.string().nullable(),
            gender: z.string().max(50).nullable(),
            hobbiesAndPassions: z.string().nullable(),
            paidVoterMessage: z.string().nullable(),
            freeVoterMessage: z.string().nullable(),
            createdAt: z.string(),
            updatedAt: z.string(),
            lastFreeVoteAt: z.string().nullable(),
            coverImageId: z.string().nullable(),
            instagram: z.string().max(255).nullable(),
            tiktok: z.string().max(255).nullable(),
            youtube: z.string().max(255).nullable(),
            facebook: z.string().max(255).nullable(),
            twitter: z.string().max(255).nullable(),
            linkedin: z.string().max(255).nullable(),
            website: z.string().max(255).nullable(),
            other: z.string().max(255).nullable(),
            bannerImageId: z.string().nullable(),
          })
          .passthrough()
          .nullable(),
        totalParticipants: z.number(),
        totalVotes: z.number(),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Authentication required`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
      {
        status: 404,
        description: `Contest not found`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: "post",
    path: "/api/v1/contest/:id/winner",
    alias: "postApiv1contestIdwinner",
    description: `Set the winner of a specific contest`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        description: `The winner profile ID`,
        type: "Body",
        schema: z.object({ profileId: z.string() }).passthrough(),
      },
      {
        name: "id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z
      .object({
        contest: z
          .object({
            id: z.string(),
            name: z.string().min(3),
            description: z.string(),
            prizePool: z.number(),
            startDate: z.string(),
            endDate: z.string(),
            registrationDeadline: z.string().nullable(),
            resultAnnounceDate: z.string().nullable(),
            slug: z.string(),
            status: z.enum([
              "DRAFT",
              "PUBLISHED",
              "ACTIVE",
              "VOTING",
              "JUDGING",
              "COMPLETED",
              "CANCELLED",
              "SUSPENDED",
            ]),
            visibility: z.enum([
              "PUBLIC",
              "PRIVATE",
              "INVITE_ONLY",
              "RESTRICTED",
            ]),
            isFeatured: z.boolean(),
            isVerified: z.boolean(),
            isVotingEnabled: z.boolean(),
            rules: z.string().nullable(),
            requirements: z.string().nullable(),
            winnerProfileId: z.string().nullable(),
            createdAt: z.string(),
            updatedAt: z.string(),
            awards: z.array(
              z
                .object({
                  id: z.string(),
                  name: z.string().min(1),
                  icon: z.string().min(1),
                  contestId: z.string(),
                })
                .passthrough()
            ),
          })
          .passthrough(),
        winner: z
          .object({
            id: z.string(),
            userId: z.string(),
            bio: z.string().nullable(),
            phone: z.string().max(20).nullable(),
            address: z.string(),
            city: z.string().max(100).nullable(),
            country: z.string().max(100).nullable(),
            postalCode: z.string().max(20).nullable(),
            dateOfBirth: z.string().nullable(),
            gender: z.string().max(50).nullable(),
            hobbiesAndPassions: z.string().nullable(),
            paidVoterMessage: z.string().nullable(),
            freeVoterMessage: z.string().nullable(),
            createdAt: z.string(),
            updatedAt: z.string(),
            lastFreeVoteAt: z.string().nullable(),
            coverImageId: z.string().nullable(),
            instagram: z.string().max(255).nullable(),
            tiktok: z.string().max(255).nullable(),
            youtube: z.string().max(255).nullable(),
            facebook: z.string().max(255).nullable(),
            twitter: z.string().max(255).nullable(),
            linkedin: z.string().max(255).nullable(),
            website: z.string().max(255).nullable(),
            other: z.string().max(255).nullable(),
            bannerImageId: z.string().nullable(),
          })
          .passthrough()
          .nullable(),
        totalParticipants: z.number(),
        totalVotes: z.number(),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Authentication required`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
      {
        status: 404,
        description: `Contest not found`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
      {
        status: 422,
        description: `The validation error(s)`,
        schema: z
          .object({
            success: z.boolean(),
            error: z
              .object({
                issues: z.array(
                  z
                    .object({
                      code: z.string(),
                      path: z.array(z.union([z.string(), z.number()])),
                      message: z.string().optional(),
                    })
                    .passthrough()
                ),
                name: z.string(),
              })
              .passthrough(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/contest/:profileId/available",
    alias: "getApiv1contestProfileIdavailable",
    description: `Get contests that the user hasn&#x27;t joined and are available`,
    requestFormat: "json",
    parameters: [
      {
        name: "profileId",
        type: "Path",
        schema: z.string(),
      },
      {
        name: "page",
        type: "Query",
        schema: z.number().nullish().default(1),
      },
      {
        name: "limit",
        type: "Query",
        schema: z.number().nullish().default(20),
      },
    ],
    response: z
      .object({
        data: z.array(
          z
            .object({
              id: z.string(),
              name: z.string().min(3),
              description: z.string(),
              prizePool: z.number(),
              startDate: z.string(),
              endDate: z.string(),
              registrationDeadline: z.string().nullable(),
              resultAnnounceDate: z.string().nullable(),
              slug: z.string(),
              status: z.enum([
                "DRAFT",
                "PUBLISHED",
                "ACTIVE",
                "VOTING",
                "JUDGING",
                "COMPLETED",
                "CANCELLED",
                "SUSPENDED",
              ]),
              visibility: z.enum([
                "PUBLIC",
                "PRIVATE",
                "INVITE_ONLY",
                "RESTRICTED",
              ]),
              isFeatured: z.boolean(),
              isVerified: z.boolean(),
              isVotingEnabled: z.boolean(),
              rules: z.string().nullable(),
              requirements: z.string().nullable(),
              winnerProfileId: z.string().nullable(),
              createdAt: z.string(),
              updatedAt: z.string(),
              awards: z.array(
                z
                  .object({
                    id: z.string(),
                    name: z.string().min(1),
                    icon: z.string().min(1),
                    contestId: z.string(),
                  })
                  .passthrough()
              ),
              images: z
                .array(
                  z
                    .object({
                      id: z.string(),
                      key: z.string(),
                      caption: z.string().nullable(),
                      url: z.string(),
                    })
                    .passthrough()
                )
                .nullable(),
            })
            .passthrough()
        ),
        pagination: z
          .object({
            total: z.number(),
            totalPages: z.number(),
            hasNextPage: z.boolean(),
            hasPreviousPage: z.boolean(),
            nextPage: z.number().nullable(),
            previousPage: z.number().nullable(),
          })
          .passthrough(),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Authentication required`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
      {
        status: 404,
        description: `Profile not found`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/contest/:profileId/joined",
    alias: "getApiv1contestProfileIdjoined",
    description: `Get contests that the user has joined`,
    requestFormat: "json",
    parameters: [
      {
        name: "profileId",
        type: "Path",
        schema: z.string(),
      },
      {
        name: "page",
        type: "Query",
        schema: z.number().nullish().default(1),
      },
      {
        name: "limit",
        type: "Query",
        schema: z.number().nullish().default(20),
      },
    ],
    response: z
      .object({
        data: z.array(
          z
            .object({
              id: z.string(),
              name: z.string().min(3),
              description: z.string(),
              prizePool: z.number(),
              startDate: z.string(),
              endDate: z.string(),
              registrationDeadline: z.string().nullable(),
              resultAnnounceDate: z.string().nullable(),
              slug: z.string(),
              status: z.enum([
                "DRAFT",
                "PUBLISHED",
                "ACTIVE",
                "VOTING",
                "JUDGING",
                "COMPLETED",
                "CANCELLED",
                "SUSPENDED",
              ]),
              visibility: z.enum([
                "PUBLIC",
                "PRIVATE",
                "INVITE_ONLY",
                "RESTRICTED",
              ]),
              isFeatured: z.boolean(),
              isVerified: z.boolean(),
              isVotingEnabled: z.boolean(),
              rules: z.string().nullable(),
              requirements: z.string().nullable(),
              winnerProfileId: z.string().nullable(),
              createdAt: z.string(),
              updatedAt: z.string(),
              awards: z.array(
                z
                  .object({
                    id: z.string(),
                    name: z.string().min(1),
                    icon: z.string().min(1),
                    contestId: z.string(),
                  })
                  .passthrough()
              ),
              images: z
                .array(
                  z
                    .object({
                      id: z.string(),
                      key: z.string(),
                      caption: z.string().nullable(),
                      url: z.string(),
                    })
                    .passthrough()
                )
                .nullable(),
            })
            .passthrough()
        ),
        pagination: z
          .object({
            total: z.number(),
            totalPages: z.number(),
            hasNextPage: z.boolean(),
            hasPreviousPage: z.boolean(),
            nextPage: z.number().nullable(),
            previousPage: z.number().nullable(),
          })
          .passthrough(),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Authentication required`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
      {
        status: 404,
        description: `Profile not found`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: "post",
    path: "/api/v1/contest/join",
    alias: "postApiv1contestjoin",
    description: `Join a user (profile) to a contest.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        description: `The join contest payload (profileId, contestId, coverImage)`,
        type: "Body",
        schema: postApiv1contestjoin_Body,
      },
    ],
    response: z
      .object({
        id: z.string(),
        profileId: z.string(),
        contestId: z.string(),
        mediaId: z.string().nullable(),
        coverImage: z
          .object({
            id: z.string(),
            key: z.string(),
            name: z.string(),
            url: z.string(),
            size: z.number().nullable(),
            type: z.string().nullable(),
            status: z.enum(["FAILED", "PROCESSING", "COMPLETED"]),
            mediaType: z.enum([
              "COVER_IMAGE",
              "CONTEST_IMAGE",
              "CONTEST_PARTICIPATION_COVER",
              "PROFILE_IMAGE",
              "PROFILE_COVER_IMAGE",
              "PROFILE_BANNER_IMAGE",
            ]),
            createdAt: z.string(),
            updatedAt: z.string(),
            profileId: z.string().nullable(),
            caption: z.string().nullable(),
            contestId: z.string().nullable(),
          })
          .passthrough()
          .nullable(),
        isApproved: z.boolean(),
        isParticipating: z.boolean().nullable(),
        createdAt: z.string(),
        updatedAt: z.string(),
        contest: z
          .object({
            id: z.string(),
            name: z.string().min(3),
            description: z.string(),
            prizePool: z.number(),
            startDate: z.string(),
            endDate: z.string(),
            registrationDeadline: z.string().nullable(),
            resultAnnounceDate: z.string().nullable(),
            slug: z.string(),
            status: z.enum([
              "DRAFT",
              "PUBLISHED",
              "ACTIVE",
              "VOTING",
              "JUDGING",
              "COMPLETED",
              "CANCELLED",
              "SUSPENDED",
            ]),
            visibility: z.enum([
              "PUBLIC",
              "PRIVATE",
              "INVITE_ONLY",
              "RESTRICTED",
            ]),
            isFeatured: z.boolean(),
            isVerified: z.boolean(),
            isVotingEnabled: z.boolean(),
            rules: z.string().nullable(),
            requirements: z.string().nullable(),
            winnerProfileId: z.string().nullable(),
            createdAt: z.string(),
            updatedAt: z.string(),
          })
          .passthrough(),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Authentication required`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
      {
        status: 404,
        description: `Resource not found`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
      {
        status: 409,
        description: `Participant already joined the contest`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
      {
        status: 422,
        description: `The validation error(s)`,
        schema: z
          .object({
            success: z.boolean(),
            error: z
              .object({
                issues: z.array(
                  z
                    .object({
                      code: z.string(),
                      path: z.array(z.union([z.string(), z.number()])),
                      message: z.string().optional(),
                    })
                    .passthrough()
                ),
                name: z.string(),
              })
              .passthrough(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: "post",
    path: "/api/v1/contest/leave",
    alias: "postApiv1contestleave",
    description: `Leave a contest by removing the participation record.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        description: `The leave contest payload (profileId, contestId)`,
        type: "Body",
        schema: postApiv1contestleave_Body,
      },
    ],
    response: z
      .object({
        id: z.string(),
        profileId: z.string(),
        contestId: z.string(),
        mediaId: z.string().nullable(),
        coverImage: z
          .object({
            id: z.string(),
            key: z.string(),
            name: z.string(),
            url: z.string(),
            size: z.number().nullable(),
            type: z.string().nullable(),
            status: z.enum(["FAILED", "PROCESSING", "COMPLETED"]),
            mediaType: z.enum([
              "COVER_IMAGE",
              "CONTEST_IMAGE",
              "CONTEST_PARTICIPATION_COVER",
              "PROFILE_IMAGE",
              "PROFILE_COVER_IMAGE",
              "PROFILE_BANNER_IMAGE",
            ]),
            createdAt: z.string(),
            updatedAt: z.string(),
            profileId: z.string().nullable(),
            caption: z.string().nullable(),
            contestId: z.string().nullable(),
          })
          .passthrough()
          .nullable(),
        isApproved: z.boolean(),
        isParticipating: z.boolean().nullable(),
        createdAt: z.string(),
        updatedAt: z.string(),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Authentication required`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
      {
        status: 404,
        description: `Contest participation not found`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
      {
        status: 422,
        description: `The validation error(s)`,
        schema: z
          .object({
            success: z.boolean(),
            error: z
              .object({
                issues: z.array(
                  z
                    .object({
                      code: z.string(),
                      path: z.array(z.union([z.string(), z.number()])),
                      message: z.string().optional(),
                    })
                    .passthrough()
                ),
                name: z.string(),
              })
              .passthrough(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: "post",
    path: "/api/v1/contest/participation/:participationId/upload/cover-image",
    alias: "postApiv1contestparticipationParticipationIduploadcoverImage",
    description: `Upload a single cover image for contest participation`,
    requestFormat: "form-data",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ file: z.unknown() }).passthrough(),
      },
      {
        name: "participationId",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z
      .object({
        id: z.string(),
        profileId: z.string(),
        contestId: z.string(),
        mediaId: z.string().nullable(),
        coverImage: z
          .object({
            id: z.string(),
            key: z.string(),
            name: z.string(),
            url: z.string(),
            size: z.number().nullable(),
            type: z.string().nullable(),
            status: z.enum(["FAILED", "PROCESSING", "COMPLETED"]),
            mediaType: z.enum([
              "COVER_IMAGE",
              "CONTEST_IMAGE",
              "CONTEST_PARTICIPATION_COVER",
              "PROFILE_IMAGE",
              "PROFILE_COVER_IMAGE",
              "PROFILE_BANNER_IMAGE",
            ]),
            createdAt: z.string(),
            updatedAt: z.string(),
            profileId: z.string().nullable(),
            caption: z.string().nullable(),
            contestId: z.string().nullable(),
          })
          .passthrough()
          .nullable(),
        isApproved: z.boolean(),
        isParticipating: z.boolean().nullable(),
        createdAt: z.string(),
        updatedAt: z.string(),
        contest: z
          .object({
            id: z.string(),
            name: z.string().min(3),
            description: z.string(),
            prizePool: z.number(),
            startDate: z.string(),
            endDate: z.string(),
            registrationDeadline: z.string().nullable(),
            resultAnnounceDate: z.string().nullable(),
            slug: z.string(),
            status: z.enum([
              "DRAFT",
              "PUBLISHED",
              "ACTIVE",
              "VOTING",
              "JUDGING",
              "COMPLETED",
              "CANCELLED",
              "SUSPENDED",
            ]),
            visibility: z.enum([
              "PUBLIC",
              "PRIVATE",
              "INVITE_ONLY",
              "RESTRICTED",
            ]),
            isFeatured: z.boolean(),
            isVerified: z.boolean(),
            isVotingEnabled: z.boolean(),
            rules: z.string().nullable(),
            requirements: z.string().nullable(),
            winnerProfileId: z.string().nullable(),
            createdAt: z.string(),
            updatedAt: z.string(),
          })
          .passthrough(),
      })
      .passthrough(),
    errors: [
      {
        status: 400,
        description: `Upload failed`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
      {
        status: 404,
        description: `Contest participation not found`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/contest/slug/:slug",
    alias: "getApiv1contestslugSlug",
    description: `Get a specific contest by slug`,
    requestFormat: "json",
    parameters: [
      {
        name: "slug",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z
      .object({
        id: z.string(),
        name: z.string().min(3),
        description: z.string(),
        prizePool: z.number(),
        startDate: z.string(),
        endDate: z.string(),
        registrationDeadline: z.string().nullable(),
        resultAnnounceDate: z.string().nullable(),
        slug: z.string(),
        status: z.enum([
          "DRAFT",
          "PUBLISHED",
          "ACTIVE",
          "VOTING",
          "JUDGING",
          "COMPLETED",
          "CANCELLED",
          "SUSPENDED",
        ]),
        visibility: z.enum(["PUBLIC", "PRIVATE", "INVITE_ONLY", "RESTRICTED"]),
        isFeatured: z.boolean(),
        isVerified: z.boolean(),
        isVotingEnabled: z.boolean(),
        rules: z.string().nullable(),
        requirements: z.string().nullable(),
        winnerProfileId: z.string().nullable(),
        createdAt: z.string(),
        updatedAt: z.string(),
        awards: z.array(
          z
            .object({
              id: z.string(),
              name: z.string().min(1),
              icon: z.string().min(1),
              contestId: z.string(),
            })
            .passthrough()
        ),
        images: z
          .array(
            z
              .object({
                id: z.string(),
                key: z.string(),
                caption: z.string().nullable(),
                url: z.string(),
              })
              .passthrough()
          )
          .nullable(),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Authentication required`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
      {
        status: 404,
        description: `Contest not found`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/contest/upcoming",
    alias: "getApiv1contestupcoming",
    description: `Get all upcoming contests`,
    requestFormat: "json",
    parameters: [
      {
        name: "page",
        type: "Query",
        schema: z.number().nullish().default(1),
      },
      {
        name: "limit",
        type: "Query",
        schema: z.number().nullish().default(20),
      },
    ],
    response: z
      .object({
        data: z.array(
          z
            .object({
              id: z.string(),
              name: z.string().min(3),
              description: z.string(),
              prizePool: z.number(),
              startDate: z.string(),
              endDate: z.string(),
              registrationDeadline: z.string().nullable(),
              resultAnnounceDate: z.string().nullable(),
              slug: z.string(),
              status: z.enum([
                "DRAFT",
                "PUBLISHED",
                "ACTIVE",
                "VOTING",
                "JUDGING",
                "COMPLETED",
                "CANCELLED",
                "SUSPENDED",
              ]),
              visibility: z.enum([
                "PUBLIC",
                "PRIVATE",
                "INVITE_ONLY",
                "RESTRICTED",
              ]),
              isFeatured: z.boolean(),
              isVerified: z.boolean(),
              isVotingEnabled: z.boolean(),
              rules: z.string().nullable(),
              requirements: z.string().nullable(),
              winnerProfileId: z.string().nullable(),
              createdAt: z.string(),
              updatedAt: z.string(),
              awards: z.array(
                z
                  .object({
                    id: z.string(),
                    name: z.string().min(1),
                    icon: z.string().min(1),
                    contestId: z.string(),
                  })
                  .passthrough()
              ),
              images: z
                .array(
                  z
                    .object({
                      id: z.string(),
                      key: z.string(),
                      caption: z.string().nullable(),
                      url: z.string(),
                    })
                    .passthrough()
                )
                .nullable(),
            })
            .passthrough()
        ),
        pagination: z
          .object({
            total: z.number(),
            totalPages: z.number(),
            hasNextPage: z.boolean(),
            hasPreviousPage: z.boolean(),
            nextPage: z.number().nullable(),
            previousPage: z.number().nullable(),
          })
          .passthrough(),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Authentication required`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: "post",
    path: "/api/v1/contest/vote/free",
    alias: "postApiv1contestvotefree",
    description: `Give a free vote in a contest for a profile. Free votes are limited to one per 24 hours per contest.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        description: `The vote payload (voterId, voteeId, contestId, type)`,
        type: "Body",
        schema: postApiv1contestvotefree_Body,
      },
    ],
    response: z
      .object({
        id: z.string(),
        type: z.enum(["FREE", "PAID"]),
        voterId: z.string(),
        voteeId: z.string(),
        contestId: z.string(),
        count: z.number(),
        paymentId: z.string().nullable(),
        createdAt: z.string(),
        updatedAt: z.string(),
      })
      .passthrough(),
    errors: [
      {
        status: 422,
        description: `The validation error(s)`,
        schema: z
          .object({
            success: z.boolean(),
            error: z
              .object({
                issues: z.array(
                  z
                    .object({
                      code: z.string(),
                      path: z.array(z.union([z.string(), z.number()])),
                      message: z.string().optional(),
                    })
                    .passthrough()
                ),
                name: z.string(),
              })
              .passthrough(),
          })
          .passthrough(),
      },
      {
        status: 429,
        description: `Too many request`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: "post",
    path: "/api/v1/contest/vote/pay",
    alias: "postApiv1contestvotepay",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        description: `The validation error`,
        type: "Body",
        schema: postApiv1contestvotepay_Body,
      },
    ],
    response: z.object({ url: z.string() }).passthrough(),
    errors: [
      {
        status: 404,
        description: `Resource not found`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
      {
        status: 503,
        description: `Service Unavailable`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/leaderboard",
    alias: "getApiv1leaderboard",
    description: `Get the leaderboard of model profiles ranked by total votes received`,
    requestFormat: "json",
    parameters: [
      {
        name: "page",
        type: "Query",
        schema: z.number().nullish().default(1),
      },
      {
        name: "limit",
        type: "Query",
        schema: z.number().lte(100).nullish().default(50),
      },
    ],
    response: z
      .object({
        data: z.array(
          z
            .object({
              rank: z.number(),
              profileId: z.string(),
              userId: z.string(),
              username: z.string(),
              displayUsername: z.string().nullable(),
              coverImage: z.string().nullable(),
              bio: z.string().nullable(),
              totalVotes: z.number(),
              freeVotes: z.number(),
              paidVotes: z.number(),
              createdAt: z.string(),
            })
            .passthrough()
        ),
        pagination: z
          .object({
            total: z.number(),
            totalPages: z.number(),
            hasNextPage: z.boolean(),
            hasPreviousPage: z.boolean(),
            nextPage: z.number().nullable(),
            previousPage: z.number().nullable(),
          })
          .passthrough(),
      })
      .passthrough(),
  },
  {
    method: "get",
    path: "/api/v1/notifications",
    alias: "getApiv1notifications",
    description: `Get paginated list of notifications for the authenticated user.`,
    requestFormat: "json",
    parameters: [
      {
        name: "page",
        type: "Query",
        schema: z.number().nullish().default(1),
      },
      {
        name: "limit",
        type: "Query",
        schema: z.number().optional().default(10),
      },
      {
        name: "isRead",
        type: "Query",
        schema: z.boolean().optional(),
      },
      {
        name: "archived",
        type: "Query",
        schema: z.boolean().optional(),
      },
      {
        name: "profileId",
        type: "Query",
        schema: z.string().min(4),
      },
    ],
    response: z
      .object({
        notifications: z.array(
          z
            .object({
              id: z.string(),
              message: z.string(),
              profileId: z.string(),
              createdAt: z.string(),
              updatedAt: z.string(),
              isRead: z.boolean(),
              archived: z.boolean(),
              icon: z.enum(["WARNING", "SUCESS", "INFO"]).nullable(),
              action: z.string().nullable(),
            })
            .passthrough()
        ),
        pagination: z
          .object({
            total: z.number(),
            totalPages: z.number(),
            hasNextPage: z.boolean(),
            hasPreviousPage: z.boolean(),
            nextPage: z.number().nullable(),
            previousPage: z.number().nullable(),
          })
          .passthrough(),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Authentication required`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
      {
        status: 404,
        description: `Notifications not found`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: "post",
    path: "/api/v1/notifications",
    alias: "postApiv1notifications",
    description: `Create a new notification.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        description: `The notification payload`,
        type: "Body",
        schema: postApiv1notifications_Body,
      },
    ],
    response: z
      .object({
        id: z.string(),
        message: z.string(),
        profileId: z.string(),
        createdAt: z.string(),
        updatedAt: z.string(),
        isRead: z.boolean(),
        archived: z.boolean(),
        icon: z.enum(["WARNING", "SUCESS", "INFO"]).nullable(),
        action: z.string().nullable(),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Authentication required`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
      {
        status: 404,
        description: `Profile not found`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
      {
        status: 422,
        description: `The validation error(s)`,
        schema: z
          .object({
            success: z.boolean(),
            error: z
              .object({
                issues: z.array(
                  z
                    .object({
                      code: z.string(),
                      path: z.array(z.union([z.string(), z.number()])),
                      message: z.string().optional(),
                    })
                    .passthrough()
                ),
                name: z.string(),
              })
              .passthrough(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/notifications/:id",
    alias: "getApiv1notificationsId",
    description: `Get a specific notification by ID.`,
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z
      .object({
        id: z.string(),
        message: z.string(),
        profileId: z.string(),
        createdAt: z.string(),
        updatedAt: z.string(),
        isRead: z.boolean(),
        archived: z.boolean(),
        icon: z.enum(["WARNING", "SUCESS", "INFO"]).nullable(),
        action: z.string().nullable(),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Authentication required`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
      {
        status: 404,
        description: `Notification not found`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: "put",
    path: "/api/v1/notifications/:id",
    alias: "putApiv1notificationsId",
    description: `Update a notification by ID.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        description: `The notification update payload`,
        type: "Body",
        schema: putApiv1notificationsId_Body,
      },
      {
        name: "id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z
      .object({
        id: z.string(),
        message: z.string(),
        profileId: z.string(),
        createdAt: z.string(),
        updatedAt: z.string(),
        isRead: z.boolean(),
        archived: z.boolean(),
        icon: z.enum(["WARNING", "SUCESS", "INFO"]).nullable(),
        action: z.string().nullable(),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Authentication required`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
      {
        status: 404,
        description: `Notification not found`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
      {
        status: 422,
        description: `The validation error(s)`,
        schema: z
          .object({
            success: z.boolean(),
            error: z
              .object({
                issues: z.array(
                  z
                    .object({
                      code: z.string(),
                      path: z.array(z.union([z.string(), z.number()])),
                      message: z.string().optional(),
                    })
                    .passthrough()
                ),
                name: z.string(),
              })
              .passthrough(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: "delete",
    path: "/api/v1/notifications/:id",
    alias: "deleteApiv1notificationsId",
    description: `Delete a notification by ID.`,
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z
      .object({
        id: z.string(),
        message: z.string(),
        profileId: z.string(),
        createdAt: z.string(),
        updatedAt: z.string(),
        isRead: z.boolean(),
        archived: z.boolean(),
        icon: z.enum(["WARNING", "SUCESS", "INFO"]).nullable(),
        action: z.string().nullable(),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Authentication required`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
      {
        status: 404,
        description: `Notification not found`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: "patch",
    path: "/api/v1/notifications/:id/read",
    alias: "patchApiv1notificationsIdread",
    description: `Mark a notification as read.`,
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z
      .object({
        id: z.string(),
        message: z.string(),
        profileId: z.string(),
        createdAt: z.string(),
        updatedAt: z.string(),
        isRead: z.boolean(),
        archived: z.boolean(),
        icon: z.enum(["WARNING", "SUCESS", "INFO"]).nullable(),
        action: z.string().nullable(),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Authentication required`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
      {
        status: 404,
        description: `Notification not found`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: "patch",
    path: "/api/v1/notifications/:profileId/read-all",
    alias: "patchApiv1notificationsProfileIdreadAll",
    description: `Mark all notifications as read for the authenticated user.`,
    requestFormat: "json",
    parameters: [
      {
        name: "profileId",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z
      .object({ message: z.string(), updatedCount: z.number() })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Authentication required`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
      {
        status: 404,
        description: `Profile not found`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/payments",
    alias: "getApiv1payments",
    description: `Retrieve paginated list of all payments in the system`,
    requestFormat: "json",
    parameters: [
      {
        name: "page",
        type: "Query",
        schema: z.number().nullish().default(1),
      },
      {
        name: "limit",
        type: "Query",
        schema: z.number().nullish().default(20),
      },
    ],
    response: z
      .object({
        data: z.array(
          z
            .object({
              id: z.string(),
              amount: z.number(),
              status: z.enum(["PENDING", "COMPLETED", "FAILED"]),
              stripeSessionId: z.string(),
              createdAt: z.string(),
              payer: z
                .object({
                  id: z.string(),
                  user: z.object({ name: z.string() }).passthrough(),
                })
                .passthrough(),
              votes: z.array(
                z
                  .object({
                    id: z.string(),
                    type: z.enum(["FREE", "PAID"]),
                    contest: z.object({ name: z.string() }).passthrough(),
                    count: z.number().nullable(),
                    votee: z
                      .object({
                        id: z.string(),
                        user: z.object({ name: z.string() }).passthrough(),
                      })
                      .passthrough(),
                    createdAt: z.string(),
                  })
                  .passthrough()
              ),
            })
            .passthrough()
        ),
        pagination: z
          .object({
            total: z.number(),
            totalPages: z.number(),
            hasNextPage: z.boolean(),
            hasPreviousPage: z.boolean(),
            nextPage: z.number().nullable(),
            previousPage: z.number().nullable(),
          })
          .passthrough(),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Authentication required`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
      {
        status: 403,
        description: `Insufficient permissions`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/payments/:profileId/history",
    alias: "getApiv1paymentsProfileIdhistory",
    description: `Retrieve paginated payment history for a specific user`,
    requestFormat: "json",
    parameters: [
      {
        name: "profileId",
        type: "Path",
        schema: z.string(),
      },
      {
        name: "page",
        type: "Query",
        schema: z.number().nullish().default(1),
      },
      {
        name: "limit",
        type: "Query",
        schema: z.number().nullish().default(20),
      },
    ],
    response: z
      .object({
        data: z.array(
          z
            .object({
              id: z.string(),
              amount: z.number(),
              status: z.enum(["PENDING", "COMPLETED", "FAILED"]),
              stripeSessionId: z.string(),
              createdAt: z.string(),
              payer: z
                .object({
                  id: z.string(),
                  user: z.object({ name: z.string() }).passthrough(),
                })
                .passthrough(),
              votes: z.array(
                z
                  .object({
                    id: z.string(),
                    type: z.enum(["FREE", "PAID"]),
                    contest: z.object({ name: z.string() }).passthrough(),
                    count: z.number().nullable(),
                    votee: z
                      .object({
                        id: z.string(),
                        user: z.object({ name: z.string() }).passthrough(),
                      })
                      .passthrough(),
                    createdAt: z.string(),
                  })
                  .passthrough()
              ),
            })
            .passthrough()
        ),
        pagination: z
          .object({
            total: z.number(),
            totalPages: z.number(),
            hasNextPage: z.boolean(),
            hasPreviousPage: z.boolean(),
            nextPage: z.number().nullable(),
            previousPage: z.number().nullable(),
          })
          .passthrough(),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Authentication required`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
      {
        status: 403,
        description: `Insufficient permissions`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
      {
        status: 404,
        description: `Resource not found`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/profile",
    alias: "getApiv1profile",
    description: `Get a list of all profiles`,
    requestFormat: "json",
    parameters: [
      {
        name: "page",
        type: "Query",
        schema: z.number().nullish().default(1),
      },
      {
        name: "limit",
        type: "Query",
        schema: z.number().nullish().default(20),
      },
    ],
    response: z
      .object({
        data: z.array(
          z
            .object({
              id: z.string(),
              userId: z.string(),
              bio: z.string().nullable(),
              phone: z.string().max(20).nullable(),
              address: z.string(),
              city: z.string().max(100).nullable(),
              country: z.string().max(100).nullable(),
              postalCode: z.string().max(20).nullable(),
              dateOfBirth: z.string().nullable(),
              gender: z.string().max(50).nullable(),
              hobbiesAndPassions: z.string().nullable(),
              paidVoterMessage: z.string().nullable(),
              freeVoterMessage: z.string().nullable(),
              createdAt: z.string(),
              updatedAt: z.string(),
              lastFreeVoteAt: z.string().nullable(),
              coverImageId: z.string().nullable(),
              instagram: z.string().max(255).nullable(),
              tiktok: z.string().max(255).nullable(),
              youtube: z.string().max(255).nullable(),
              facebook: z.string().max(255).nullable(),
              twitter: z.string().max(255).nullable(),
              linkedin: z.string().max(255).nullable(),
              website: z.string().max(255).nullable(),
              other: z.string().max(255).nullable(),
              bannerImageId: z.string().nullable(),
              coverImage: z
                .object({
                  id: z.string(),
                  key: z.string(),
                  caption: z.string().nullable(),
                  url: z.string(),
                })
                .passthrough()
                .nullable(),
              bannerImage: z
                .object({
                  id: z.string(),
                  key: z.string(),
                  caption: z.string().nullable(),
                  url: z.string(),
                })
                .passthrough()
                .nullable(),
            })
            .passthrough()
        ),
        pagination: z
          .object({
            total: z.number(),
            totalPages: z.number(),
            hasNextPage: z.boolean(),
            hasPreviousPage: z.boolean(),
            nextPage: z.number().nullable(),
            previousPage: z.number().nullable(),
          })
          .passthrough(),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Authentication required`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: "post",
    path: "/api/v1/profile",
    alias: "postApiv1profile",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        description: `The Profile to create`,
        type: "Body",
        schema: postApiv1profile_Body,
      },
    ],
    response: z
      .object({
        id: z.string(),
        userId: z.string(),
        bio: z.string().nullable(),
        phone: z.string().max(20).nullable(),
        address: z.string(),
        city: z.string().max(100).nullable(),
        country: z.string().max(100).nullable(),
        postalCode: z.string().max(20).nullable(),
        dateOfBirth: z.string().nullable(),
        gender: z.string().max(50).nullable(),
        hobbiesAndPassions: z.string().nullable(),
        paidVoterMessage: z.string().nullable(),
        freeVoterMessage: z.string().nullable(),
        createdAt: z.string(),
        updatedAt: z.string(),
        lastFreeVoteAt: z.string().nullable(),
        coverImageId: z.string().nullable(),
        instagram: z.string().max(255).nullable(),
        tiktok: z.string().max(255).nullable(),
        youtube: z.string().max(255).nullable(),
        facebook: z.string().max(255).nullable(),
        twitter: z.string().max(255).nullable(),
        linkedin: z.string().max(255).nullable(),
        website: z.string().max(255).nullable(),
        other: z.string().max(255).nullable(),
        bannerImageId: z.string().nullable(),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Authentication required`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
      {
        status: 422,
        description: `The validation error(s)`,
        schema: z
          .object({
            success: z.boolean(),
            error: z
              .object({
                issues: z.array(
                  z
                    .object({
                      code: z.string(),
                      path: z.array(z.union([z.string(), z.number()])),
                      message: z.string().optional(),
                    })
                    .passthrough()
                ),
                name: z.string(),
              })
              .passthrough(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/profile/:id",
    alias: "getApiv1profileId",
    description: `Get a specific profile by ID`,
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z
      .object({
        id: z.string(),
        userId: z.string(),
        bio: z.string().nullable(),
        phone: z.string().max(20).nullable(),
        address: z.string(),
        city: z.string().max(100).nullable(),
        country: z.string().max(100).nullable(),
        postalCode: z.string().max(20).nullable(),
        dateOfBirth: z.string().nullable(),
        gender: z.string().max(50).nullable(),
        hobbiesAndPassions: z.string().nullable(),
        paidVoterMessage: z.string().nullable(),
        freeVoterMessage: z.string().nullable(),
        createdAt: z.string(),
        updatedAt: z.string(),
        lastFreeVoteAt: z.string().nullable(),
        coverImageId: z.string().nullable(),
        instagram: z.string().max(255).nullable(),
        tiktok: z.string().max(255).nullable(),
        youtube: z.string().max(255).nullable(),
        facebook: z.string().max(255).nullable(),
        twitter: z.string().max(255).nullable(),
        linkedin: z.string().max(255).nullable(),
        website: z.string().max(255).nullable(),
        other: z.string().max(255).nullable(),
        bannerImageId: z.string().nullable(),
        coverImage: z
          .object({
            id: z.string(),
            key: z.string(),
            caption: z.string().nullable(),
            url: z.string(),
          })
          .passthrough()
          .nullable(),
        bannerImage: z
          .object({
            id: z.string(),
            key: z.string(),
            caption: z.string().nullable(),
            url: z.string(),
          })
          .passthrough()
          .nullable(),
        profilePhotos: z
          .array(
            z
              .object({
                id: z.string(),
                key: z.string(),
                caption: z.string().nullable(),
                url: z.string(),
              })
              .passthrough()
          )
          .nullable(),
      })
      .passthrough(),
    errors: [
      {
        status: 404,
        description: `Profile not found`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: "patch",
    path: "/api/v1/profile/:id",
    alias: "patchApiv1profileId",
    description: `Update a specific profile by ID`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        description: `The profile data to update`,
        type: "Body",
        schema: patchApiv1profileId_Body,
      },
      {
        name: "id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z
      .object({
        id: z.string(),
        userId: z.string(),
        bio: z.string().nullable(),
        phone: z.string().max(20).nullable(),
        address: z.string(),
        city: z.string().max(100).nullable(),
        country: z.string().max(100).nullable(),
        postalCode: z.string().max(20).nullable(),
        dateOfBirth: z.string().nullable(),
        gender: z.string().max(50).nullable(),
        hobbiesAndPassions: z.string().nullable(),
        paidVoterMessage: z.string().nullable(),
        freeVoterMessage: z.string().nullable(),
        createdAt: z.string(),
        updatedAt: z.string(),
        lastFreeVoteAt: z.string().nullable(),
        coverImageId: z.string().nullable(),
        instagram: z.string().max(255).nullable(),
        tiktok: z.string().max(255).nullable(),
        youtube: z.string().max(255).nullable(),
        facebook: z.string().max(255).nullable(),
        twitter: z.string().max(255).nullable(),
        linkedin: z.string().max(255).nullable(),
        website: z.string().max(255).nullable(),
        other: z.string().max(255).nullable(),
        bannerImageId: z.string().nullable(),
      })
      .passthrough(),
    errors: [
      {
        status: 404,
        description: `Profile not found`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
      {
        status: 422,
        description: `The validation error(s)`,
        schema: z
          .object({
            success: z.boolean(),
            error: z
              .object({
                issues: z.array(
                  z
                    .object({
                      code: z.string(),
                      path: z.array(z.union([z.string(), z.number()])),
                      message: z.string().optional(),
                    })
                    .passthrough()
                ),
                name: z.string(),
              })
              .passthrough(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: "delete",
    path: "/api/v1/profile/:id",
    alias: "deleteApiv1profileId",
    description: `Delete a specific profile by ID`,
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.object({ message: z.string() }).passthrough(),
    errors: [
      {
        status: 404,
        description: `Profile not found`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: "delete",
    path: "/api/v1/profile/:id/images/:imageId",
    alias: "deleteApiv1profileIdimagesImageId",
    description: `Remove a specific image from a profile`,
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string(),
      },
      {
        name: "imageId",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.object({ message: z.string() }).passthrough(),
    errors: [
      {
        status: 400,
        description: `Failed to remove image`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
      {
        status: 404,
        description: `Profile or image not found`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: "post",
    path: "/api/v1/profile/:id/upload/banner",
    alias: "postApiv1profileIduploadbanner",
    description: `Upload a banner image for a specific profile`,
    requestFormat: "form-data",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ file: z.unknown() }).passthrough(),
      },
      {
        name: "id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z
      .object({
        id: z.string(),
        userId: z.string(),
        bio: z.string().nullable(),
        phone: z.string().max(20).nullable(),
        address: z.string(),
        city: z.string().max(100).nullable(),
        country: z.string().max(100).nullable(),
        postalCode: z.string().max(20).nullable(),
        dateOfBirth: z.string().nullable(),
        gender: z.string().max(50).nullable(),
        hobbiesAndPassions: z.string().nullable(),
        paidVoterMessage: z.string().nullable(),
        freeVoterMessage: z.string().nullable(),
        createdAt: z.string(),
        updatedAt: z.string(),
        lastFreeVoteAt: z.string().nullable(),
        coverImageId: z.string().nullable(),
        instagram: z.string().max(255).nullable(),
        tiktok: z.string().max(255).nullable(),
        youtube: z.string().max(255).nullable(),
        facebook: z.string().max(255).nullable(),
        twitter: z.string().max(255).nullable(),
        linkedin: z.string().max(255).nullable(),
        website: z.string().max(255).nullable(),
        other: z.string().max(255).nullable(),
        bannerImageId: z.string().nullable(),
      })
      .passthrough(),
    errors: [
      {
        status: 400,
        description: `Upload failed`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
      {
        status: 404,
        description: `Profile not found`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: "post",
    path: "/api/v1/profile/:id/upload/cover",
    alias: "postApiv1profileIduploadcover",
    description: `Upload a cover image for a specific profile`,
    requestFormat: "form-data",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ file: z.unknown() }).passthrough(),
      },
      {
        name: "id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z
      .object({
        id: z.string(),
        userId: z.string(),
        bio: z.string().nullable(),
        phone: z.string().max(20).nullable(),
        address: z.string(),
        city: z.string().max(100).nullable(),
        country: z.string().max(100).nullable(),
        postalCode: z.string().max(20).nullable(),
        dateOfBirth: z.string().nullable(),
        gender: z.string().max(50).nullable(),
        hobbiesAndPassions: z.string().nullable(),
        paidVoterMessage: z.string().nullable(),
        freeVoterMessage: z.string().nullable(),
        createdAt: z.string(),
        updatedAt: z.string(),
        lastFreeVoteAt: z.string().nullable(),
        coverImageId: z.string().nullable(),
        instagram: z.string().max(255).nullable(),
        tiktok: z.string().max(255).nullable(),
        youtube: z.string().max(255).nullable(),
        facebook: z.string().max(255).nullable(),
        twitter: z.string().max(255).nullable(),
        linkedin: z.string().max(255).nullable(),
        website: z.string().max(255).nullable(),
        other: z.string().max(255).nullable(),
        bannerImageId: z.string().nullable(),
      })
      .passthrough(),
    errors: [
      {
        status: 400,
        description: `Upload failed`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
      {
        status: 404,
        description: `Profile not found`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: "post",
    path: "/api/v1/profile/:id/upload/photos",
    alias: "postApiv1profileIduploadphotos",
    description: `Upload gallery photos for a specific profile, Each file must have a key name files`,
    requestFormat: "form-data",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: postApiv1profileIduploadphotos_Body,
      },
      {
        name: "id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z
      .object({
        id: z.string(),
        userId: z.string(),
        bio: z.string().nullable(),
        phone: z.string().max(20).nullable(),
        address: z.string(),
        city: z.string().max(100).nullable(),
        country: z.string().max(100).nullable(),
        postalCode: z.string().max(20).nullable(),
        dateOfBirth: z.string().nullable(),
        gender: z.string().max(50).nullable(),
        hobbiesAndPassions: z.string().nullable(),
        paidVoterMessage: z.string().nullable(),
        freeVoterMessage: z.string().nullable(),
        createdAt: z.string(),
        updatedAt: z.string(),
        lastFreeVoteAt: z.string().nullable(),
        coverImageId: z.string().nullable(),
        instagram: z.string().max(255).nullable(),
        tiktok: z.string().max(255).nullable(),
        youtube: z.string().max(255).nullable(),
        facebook: z.string().max(255).nullable(),
        twitter: z.string().max(255).nullable(),
        linkedin: z.string().max(255).nullable(),
        website: z.string().max(255).nullable(),
        other: z.string().max(255).nullable(),
        bannerImageId: z.string().nullable(),
      })
      .passthrough(),
    errors: [
      {
        status: 400,
        description: `Upload failed`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
      {
        status: 404,
        description: `Profile not found`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/profile/user/:userId",
    alias: "getApiv1profileuserUserId",
    description: `Get a specific profile by user ID`,
    requestFormat: "json",
    parameters: [
      {
        name: "userId",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z
      .object({
        id: z.string(),
        userId: z.string(),
        bio: z.string().nullable(),
        phone: z.string().max(20).nullable(),
        address: z.string(),
        city: z.string().max(100).nullable(),
        country: z.string().max(100).nullable(),
        postalCode: z.string().max(20).nullable(),
        dateOfBirth: z.string().nullable(),
        gender: z.string().max(50).nullable(),
        hobbiesAndPassions: z.string().nullable(),
        paidVoterMessage: z.string().nullable(),
        freeVoterMessage: z.string().nullable(),
        createdAt: z.string(),
        updatedAt: z.string(),
        lastFreeVoteAt: z.string().nullable(),
        coverImageId: z.string().nullable(),
        instagram: z.string().max(255).nullable(),
        tiktok: z.string().max(255).nullable(),
        youtube: z.string().max(255).nullable(),
        facebook: z.string().max(255).nullable(),
        twitter: z.string().max(255).nullable(),
        linkedin: z.string().max(255).nullable(),
        website: z.string().max(255).nullable(),
        other: z.string().max(255).nullable(),
        bannerImageId: z.string().nullable(),
        coverImage: z
          .object({
            id: z.string(),
            key: z.string(),
            caption: z.string().nullable(),
            url: z.string(),
          })
          .passthrough()
          .nullable(),
        bannerImage: z
          .object({
            id: z.string(),
            key: z.string(),
            caption: z.string().nullable(),
            url: z.string(),
          })
          .passthrough()
          .nullable(),
        profilePhotos: z
          .array(
            z
              .object({
                id: z.string(),
                key: z.string(),
                caption: z.string().nullable(),
                url: z.string(),
              })
              .passthrough()
          )
          .nullable(),
      })
      .passthrough(),
    errors: [
      {
        status: 404,
        description: `Profile not found`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/profile/username/:username",
    alias: "getApiv1profileusernameUsername",
    description: `Get a specific profile by username with cover image and profile photos`,
    requestFormat: "json",
    parameters: [
      {
        name: "username",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z
      .object({
        id: z.string(),
        userId: z.string(),
        bio: z.string().nullable(),
        phone: z.string().max(20).nullable(),
        address: z.string(),
        city: z.string().max(100).nullable(),
        country: z.string().max(100).nullable(),
        postalCode: z.string().max(20).nullable(),
        dateOfBirth: z.string().nullable(),
        gender: z.string().max(50).nullable(),
        hobbiesAndPassions: z.string().nullable(),
        paidVoterMessage: z.string().nullable(),
        freeVoterMessage: z.string().nullable(),
        createdAt: z.string(),
        updatedAt: z.string(),
        lastFreeVoteAt: z.string().nullable(),
        coverImageId: z.string().nullable(),
        instagram: z.string().max(255).nullable(),
        tiktok: z.string().max(255).nullable(),
        youtube: z.string().max(255).nullable(),
        facebook: z.string().max(255).nullable(),
        twitter: z.string().max(255).nullable(),
        linkedin: z.string().max(255).nullable(),
        website: z.string().max(255).nullable(),
        other: z.string().max(255).nullable(),
        bannerImageId: z.string().nullable(),
        coverImage: z
          .object({
            id: z.string(),
            key: z.string(),
            caption: z.string().nullable(),
            url: z.string(),
          })
          .passthrough()
          .nullable(),
        bannerImage: z
          .object({
            id: z.string(),
            key: z.string(),
            caption: z.string().nullable(),
            url: z.string(),
          })
          .passthrough()
          .nullable(),
        profilePhotos: z
          .array(
            z
              .object({
                id: z.string(),
                key: z.string(),
                caption: z.string().nullable(),
                url: z.string(),
              })
              .passthrough()
          )
          .nullable(),
      })
      .passthrough(),
    errors: [
      {
        status: 404,
        description: `Profile not found`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/ranks",
    alias: "getApiv1ranks",
    requestFormat: "json",
    parameters: [
      {
        name: "limit",
        type: "Query",
        schema: z.number().nullish().default(2),
      },
      {
        name: "page",
        type: "Query",
        schema: z.number().nullish().default(1),
      },
    ],
    response: z.array(
      z
        .object({
          name: z.string(),
          votesRecieved: z.number().nullable(),
          profileId: z.string(),
        })
        .passthrough()
    ),
    errors: [
      {
        status: 422,
        description: `The validation error(s)`,
        schema: z
          .object({
            success: z.boolean(),
            error: z
              .object({
                issues: z.array(
                  z
                    .object({
                      code: z.string(),
                      path: z.array(z.union([z.string(), z.number()])),
                      message: z.string().optional(),
                    })
                    .passthrough()
                ),
                name: z.string(),
              })
              .passthrough(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/search/contests",
    alias: "getApiv1searchcontests",
    description: `Search and filter contests with pagination support`,
    requestFormat: "json",
    parameters: [
      {
        name: "page",
        type: "Query",
        schema: z.number().nullish().default(1),
      },
      {
        name: "limit",
        type: "Query",
        schema: z.number().nullish().default(20),
      },
      {
        name: "query",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "sortBy",
        type: "Query",
        schema: z.enum(["name", "createdAt"]).optional().default("createdAt"),
      },
      {
        name: "sortOrder",
        type: "Query",
        schema: z.enum(["asc", "desc"]).optional().default("desc"),
      },
      {
        name: "status",
        type: "Query",
        schema: z.enum(["active", "upcoming", "ended"]).optional(),
      },
      {
        name: "minPrizePool",
        type: "Query",
        schema: z.number().nullish(),
      },
      {
        name: "maxPrizePool",
        type: "Query",
        schema: z.number().nullish(),
      },
      {
        name: "startDate",
        type: "Query",
        schema: z.string().nullish(),
      },
      {
        name: "endDate",
        type: "Query",
        schema: z.string().nullish(),
      },
    ],
    response: z
      .object({
        data: z.array(
          z
            .object({
              id: z.string(),
              name: z.string(),
              description: z.string(),
              startDate: z.string(),
              endDate: z.string(),
              prizePool: z.number(),
              winnerProfileId: z.string().nullable(),
              createdAt: z.string(),
              updatedAt: z.string(),
              status: z.enum(["active", "upcoming", "ended"]),
            })
            .passthrough()
        ),
        pagination: z
          .object({
            total: z.number(),
            totalPages: z.number(),
            hasNextPage: z.boolean(),
            hasPreviousPage: z.boolean(),
            nextPage: z.number().nullable(),
            previousPage: z.number().nullable(),
          })
          .passthrough(),
      })
      .passthrough(),
    errors: [
      {
        status: 400,
        description: `Invalid search parameters`,
        schema: z
          .object({
            success: z.boolean(),
            error: z
              .object({
                issues: z.array(
                  z
                    .object({
                      code: z.string(),
                      path: z.array(z.union([z.string(), z.number()])),
                      message: z.string().optional(),
                    })
                    .passthrough()
                ),
                name: z.string(),
              })
              .passthrough(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/search/profiles",
    alias: "getApiv1searchprofiles",
    description: `Search and filter profiles with pagination support`,
    requestFormat: "json",
    parameters: [
      {
        name: "page",
        type: "Query",
        schema: z.number().nullish().default(1),
      },
      {
        name: "limit",
        type: "Query",
        schema: z.number().nullish().default(20),
      },
      {
        name: "query",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "sortBy",
        type: "Query",
        schema: z
          .enum(["name", "username", "createdAt"])
          .optional()
          .default("createdAt"),
      },
      {
        name: "sortOrder",
        type: "Query",
        schema: z.enum(["asc", "desc"]).optional().default("desc"),
      },
      {
        name: "city",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "country",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "gender",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "hasAvatar",
        type: "Query",
        schema: z.boolean().nullish(),
      },
    ],
    response: z
      .object({
        data: z.array(
          z
            .object({
              id: z.string(),
              userId: z.string(),
              bio: z.string().nullable(),
              coverImage: z.string().nullable(),
              city: z.string().nullable(),
              country: z.string().nullable(),
              gender: z.string().nullable(),
              createdAt: z.string(),
              updatedAt: z.string(),
              user: z
                .object({
                  id: z.string(),
                  username: z.string().nullable(),
                  displayUsername: z.string().nullable(),
                  name: z.string(),
                  email: z.string(),
                  image: z.string().nullable(),
                })
                .passthrough(),
            })
            .passthrough()
        ),
        pagination: z
          .object({
            total: z.number(),
            totalPages: z.number(),
            hasNextPage: z.boolean(),
            hasPreviousPage: z.boolean(),
            nextPage: z.number().nullable(),
            previousPage: z.number().nullable(),
          })
          .passthrough(),
      })
      .passthrough(),
    errors: [
      {
        status: 400,
        description: `Invalid search parameters`,
        schema: z
          .object({
            success: z.boolean(),
            error: z
              .object({
                issues: z.array(
                  z
                    .object({
                      code: z.string(),
                      path: z.array(z.union([z.string(), z.number()])),
                      message: z.string().optional(),
                    })
                    .passthrough()
                ),
                name: z.string(),
              })
              .passthrough(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/search/users",
    alias: "getApiv1searchusers",
    description: `Search and filter users with pagination support`,
    requestFormat: "json",
    parameters: [
      {
        name: "page",
        type: "Query",
        schema: z.number().nullish().default(1),
      },
      {
        name: "limit",
        type: "Query",
        schema: z.number().nullish().default(20),
      },
      {
        name: "query",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "sortBy",
        type: "Query",
        schema: z
          .enum(["name", "username", "createdAt"])
          .optional()
          .default("createdAt"),
      },
      {
        name: "sortOrder",
        type: "Query",
        schema: z.enum(["asc", "desc"]).optional().default("desc"),
      },
      {
        name: "role",
        type: "Query",
        schema: z.enum(["USER", "ADMIN", "MODERATOR"]).optional(),
      },
      {
        name: "isActive",
        type: "Query",
        schema: z.boolean().optional(),
      },
      {
        name: "hasProfile",
        type: "Query",
        schema: z.boolean().nullish(),
      },
      {
        name: "search",
        type: "Query",
        schema: z.string().optional(),
      },
    ],
    response: z
      .object({
        data: z.array(
          z
            .object({
              id: z.string(),
              username: z.string().nullable(),
              displayUsername: z.string().nullable(),
              name: z.string(),
              email: z.string(),
              role: z.enum(["USER", "ADMIN", "MODERATOR"]),
              isActive: z.boolean(),
              image: z.string().nullable(),
              createdAt: z.string(),
              updatedAt: z.string(),
              hasProfile: z.boolean(),
            })
            .passthrough()
        ),
        pagination: z
          .object({
            total: z.number(),
            totalPages: z.number(),
            hasNextPage: z.boolean(),
            hasPreviousPage: z.boolean(),
            nextPage: z.number().nullable(),
            previousPage: z.number().nullable(),
          })
          .passthrough(),
      })
      .passthrough(),
    errors: [
      {
        status: 400,
        description: `Invalid search parameters`,
        schema: z
          .object({
            success: z.boolean(),
            error: z
              .object({
                issues: z.array(
                  z
                    .object({
                      code: z.string(),
                      path: z.array(z.union([z.string(), z.number()])),
                      message: z.string().optional(),
                    })
                    .passthrough()
                ),
                name: z.string(),
              })
              .passthrough(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/users",
    alias: "getApiv1users",
    requestFormat: "json",
    parameters: [
      {
        name: "page",
        type: "Query",
        schema: z.number().nullish().default(1),
      },
      {
        name: "limit",
        type: "Query",
        schema: z.number().nullish().default(20),
      },
    ],
    response: z
      .object({
        data: z.array(
          z
            .object({
              id: z.string(),
              email: z.string().email(),
              emailVerified: z.boolean(),
              username: z.string().max(100).nullable(),
              displayUsername: z.string().nullable(),
              name: z.string(),
              role: z.enum(["USER", "ADMIN", "MODERATOR"]),
              isActive: z.boolean(),
              image: z.string().nullable(),
              createdAt: z.string(),
              updatedAt: z.string(),
            })
            .passthrough()
        ),
        pagination: z
          .object({
            total: z.number(),
            totalPages: z.number(),
            hasNextPage: z.boolean(),
            hasPreviousPage: z.boolean(),
            nextPage: z.number().nullable(),
            previousPage: z.number().nullable(),
          })
          .passthrough(),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Authentication required`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: "post",
    path: "/api/v1/users",
    alias: "postApiv1users",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        description: `The User to create`,
        type: "Body",
        schema: postApiv1users_Body,
      },
    ],
    response: z
      .object({
        id: z.string(),
        email: z.string().email(),
        emailVerified: z.boolean(),
        username: z.string().max(100).nullable(),
        displayUsername: z.string().nullable(),
        name: z.string(),
        role: z.enum(["USER", "ADMIN", "MODERATOR"]),
        isActive: z.boolean(),
        image: z.string().nullable(),
        createdAt: z.string(),
        updatedAt: z.string(),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Authentication required`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
      {
        status: 404,
        description: `User not found`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
      {
        status: 422,
        description: `The validation error(s)`,
        schema: z
          .object({
            success: z.boolean(),
            error: z
              .object({
                issues: z.array(
                  z
                    .object({
                      code: z.string(),
                      path: z.array(z.union([z.string(), z.number()])),
                      message: z.string().optional(),
                    })
                    .passthrough()
                ),
                name: z.string(),
              })
              .passthrough(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/users/:id",
    alias: "getApiv1usersId",
    description: `Get a specific user by ID`,
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z
      .object({
        id: z.string(),
        email: z.string().email(),
        emailVerified: z.boolean(),
        username: z.string().max(100).nullable(),
        displayUsername: z.string().nullable(),
        name: z.string(),
        role: z.enum(["USER", "ADMIN", "MODERATOR"]),
        isActive: z.boolean(),
        image: z.string().nullable(),
        createdAt: z.string(),
        updatedAt: z.string(),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Authentication required`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
      {
        status: 404,
        description: `User not found`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: "patch",
    path: "/api/v1/users/:id",
    alias: "patchApiv1usersId",
    description: `Update a specific user by ID`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        description: `The user data to update`,
        type: "Body",
        schema: patchApiv1usersId_Body,
      },
      {
        name: "id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z
      .object({
        id: z.string(),
        email: z.string().email(),
        emailVerified: z.boolean(),
        username: z.string().max(100).nullable(),
        displayUsername: z.string().nullable(),
        name: z.string(),
        role: z.enum(["USER", "ADMIN", "MODERATOR"]),
        isActive: z.boolean(),
        image: z.string().nullable(),
        createdAt: z.string(),
        updatedAt: z.string(),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Authentication required`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
      {
        status: 403,
        description: `Insufficient permissions`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
      {
        status: 404,
        description: `User not found`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
      {
        status: 422,
        description: `The validation error(s)`,
        schema: z
          .object({
            success: z.boolean(),
            error: z
              .object({
                issues: z.array(
                  z
                    .object({
                      code: z.string(),
                      path: z.array(z.union([z.string(), z.number()])),
                      message: z.string().optional(),
                    })
                    .passthrough()
                ),
                name: z.string(),
              })
              .passthrough(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: "delete",
    path: "/api/v1/users/:id",
    alias: "deleteApiv1usersId",
    description: `Delete a specific user by ID`,
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.object({ message: z.string() }).passthrough(),
    errors: [
      {
        status: 401,
        description: `Authentication required`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
      {
        status: 403,
        description: `Insufficient permissions`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
      {
        status: 404,
        description: `User not found`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/users/:id/profile",
    alias: "getApiv1usersIdprofile",
    description: `Get a specific user&#x27;s profile by user ID`,
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z
      .object({
        id: z.string(),
        userId: z.string(),
        bio: z.string().nullable(),
        phone: z.string().max(20).nullable(),
        address: z.string(),
        city: z.string().max(100).nullable(),
        country: z.string().max(100).nullable(),
        postalCode: z.string().max(20).nullable(),
        dateOfBirth: z.string().nullable(),
        gender: z.string().max(50).nullable(),
        hobbiesAndPassions: z.string().nullable(),
        paidVoterMessage: z.string().nullable(),
        freeVoterMessage: z.string().nullable(),
        createdAt: z.string(),
        updatedAt: z.string(),
        lastFreeVoteAt: z.string().nullable(),
        coverImageId: z.string().nullable(),
        instagram: z.string().max(255).nullable(),
        tiktok: z.string().max(255).nullable(),
        youtube: z.string().max(255).nullable(),
        facebook: z.string().max(255).nullable(),
        twitter: z.string().max(255).nullable(),
        linkedin: z.string().max(255).nullable(),
        website: z.string().max(255).nullable(),
        other: z.string().max(255).nullable(),
        bannerImageId: z.string().nullable(),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Authentication required`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
      {
        status: 404,
        description: `User not found`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/users/email/:email",
    alias: "getApiv1usersemailEmail",
    description: `Get a specific user by email address`,
    requestFormat: "json",
    parameters: [
      {
        name: "email",
        type: "Path",
        schema: z.string().email(),
      },
    ],
    response: z
      .object({
        id: z.string(),
        email: z.string().email(),
        emailVerified: z.boolean(),
        username: z.string().max(100).nullable(),
        displayUsername: z.string().nullable(),
        name: z.string(),
        role: z.enum(["USER", "ADMIN", "MODERATOR"]),
        isActive: z.boolean(),
        image: z.string().nullable(),
        createdAt: z.string(),
        updatedAt: z.string(),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Authentication required`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
      {
        status: 404,
        description: `User not found`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/users/username/:username",
    alias: "getApiv1usersusernameUsername",
    description: `Get a specific user by username`,
    requestFormat: "json",
    parameters: [
      {
        name: "username",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z
      .object({
        id: z.string(),
        email: z.string().email(),
        emailVerified: z.boolean(),
        username: z.string().max(100).nullable(),
        displayUsername: z.string().nullable(),
        name: z.string(),
        role: z.enum(["USER", "ADMIN", "MODERATOR"]),
        isActive: z.boolean(),
        image: z.string().nullable(),
        createdAt: z.string(),
        updatedAt: z.string(),
      })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Authentication required`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
      {
        status: 404,
        description: `User not found`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: "post",
    path: "/api/v1/vote-multiplier-periods",
    alias: "postApiv1voteMultiplierPeriods",
    description: `Create a new vote multiplier period for paid votes`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        description: `The Vote Multiplier to create`,
        type: "Body",
        schema: postApiv1voteMultiplierPeriods_Body,
      },
    ],
    response: z
      .object({
        id: z.string(),
        multiplierTimes: z.number(),
        isActive: z.boolean(),
        startTime: z.string().nullable(),
        endTime: z.string().nullable(),
        createdAt: z.string().nullable(),
        updatedAt: z.string().nullable(),
      })
      .passthrough(),
    errors: [
      {
        status: 400,
        description: `Something Went wrong`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
      {
        status: 409,
        description: `Vote multiplier period already exists for this time range`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/vote-multiplier-periods",
    alias: "getApiv1voteMultiplierPeriods",
    description: `Retrieve all vote multiplier periods with pagination`,
    requestFormat: "json",
    parameters: [
      {
        name: "page",
        type: "Query",
        schema: z.number().nullish().default(1),
      },
      {
        name: "limit",
        type: "Query",
        schema: z.number().nullish().default(20),
      },
    ],
    response: z
      .object({
        data: z.array(
          z
            .object({
              id: z.string(),
              multiplierTimes: z.number(),
              isActive: z.boolean(),
              startTime: z.string().nullable(),
              endTime: z.string().nullable(),
              createdAt: z.string().nullable(),
              updatedAt: z.string().nullable(),
            })
            .passthrough()
        ),
        pagination: z
          .object({
            total: z.number(),
            totalPages: z.number(),
            hasNextPage: z.boolean(),
            hasPreviousPage: z.boolean(),
            nextPage: z.number().nullable(),
            previousPage: z.number().nullable(),
          })
          .passthrough(),
      })
      .passthrough(),
    errors: [
      {
        status: 409,
        description: `already has active vote multplier`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: "put",
    path: "/api/v1/vote-multiplier-periods/:id",
    alias: "putApiv1voteMultiplierPeriodsId",
    description: `Update an existing vote multiplier period`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        description: `The Vote Multiplier to update`,
        type: "Body",
        schema: postApiv1voteMultiplierPeriods_Body,
      },
      {
        name: "id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z
      .object({
        id: z.string(),
        multiplierTimes: z.number(),
        isActive: z.boolean(),
        startTime: z.string().nullable(),
        endTime: z.string().nullable(),
        createdAt: z.string().nullable(),
        updatedAt: z.string().nullable(),
      })
      .passthrough(),
    errors: [
      {
        status: 400,
        description: `End time must be after start time`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
      {
        status: 404,
        description: `Vote multiplier not found`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
      {
        status: 409,
        description: `A vote multiplier period already existss`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: "delete",
    path: "/api/v1/vote-multiplier-periods/:id",
    alias: "deleteApiv1voteMultiplierPeriodsId",
    description: `Delete an existing vote multiplier period`,
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.object({ message: z.string() }).passthrough(),
    errors: [
      {
        status: 404,
        description: `Vote multiplier not found`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/vote-multiplier-periods/active",
    alias: "getApiv1voteMultiplierPeriodsactive",
    description: `Get the currently active vote multiplier period`,
    requestFormat: "json",
    response: z
      .object({
        id: z.string(),
        multiplierTimes: z.number(),
        isActive: z.boolean(),
        startTime: z.string().nullable(),
        endTime: z.string().nullable(),
        createdAt: z.string().nullable(),
        updatedAt: z.string().nullable(),
      })
      .passthrough()
      .nullable(),
  },
  {
    method: "get",
    path: "/api/v1/votes/:profileId",
    alias: "getApiv1votesProfileId",
    description: `Get votes for a user by profile id`,
    requestFormat: "json",
    parameters: [
      {
        name: "profileId",
        type: "Path",
        schema: z.string(),
      },
      {
        name: "page",
        type: "Query",
        schema: z.number().nullish().default(1),
      },
      {
        name: "limit",
        type: "Query",
        schema: z.number().nullish().default(20),
      },
    ],
    response: z
      .object({
        data: z.array(
          z
            .object({
              profileId: z.string(),
              userName: z.string(),
              contestName: z.string(),
              votedOn: z.string(),
              count: z.number(),
            })
            .passthrough()
        ),
        pagination: z
          .object({
            total: z.number(),
            totalPages: z.number(),
            hasNextPage: z.boolean(),
            hasPreviousPage: z.boolean(),
            nextPage: z.number().nullable(),
            previousPage: z.number().nullable(),
          })
          .passthrough(),
      })
      .passthrough(),
    errors: [
      {
        status: 404,
        description: `Resource not found`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
    ],
  },
  {
    method: "post",
    path: "/api/v1/votes/is-free-vote-available",
    alias: "postApiv1votesisFreeVoteAvailable",
    description: `Returns whether a free vote is available for the given profileId, and if not, when it will be available.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        description: `The profile ID to check free vote availability for`,
        type: "Body",
        schema: z.object({ profileId: z.string() }).passthrough(),
      },
    ],
    response: z
      .object({
        available: z.boolean(),
        nextAvailableAt: z.string().optional(),
      })
      .passthrough(),
    errors: [
      {
        status: 404,
        description: `Profile not found.`,
        schema: z
          .object({
            message: z.string(),
            statusText: z.string(),
            status: z.number(),
          })
          .passthrough(),
      },
      {
        status: 422,
        description: `Missing or invalid profileId.`,
        schema: z.object({ error: z.string() }).passthrough(),
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/votes/latest-votes",
    alias: "getApiv1voteslatestVotes",
    description: `Get a list of latest votes`,
    requestFormat: "json",
    parameters: [
      {
        name: "page",
        type: "Query",
        schema: z.number().nullish().default(1),
      },
      {
        name: "limit",
        type: "Query",
        schema: z.number().optional().default(20),
      },
    ],
    response: z
      .object({
        data: z.array(
          z
            .array(
              z
                .object({
                  votee: z
                    .object({
                      id: z.string(),
                      name: z.string(),
                      profilePicture: z.string(),
                    })
                    .passthrough()
                    .nullable(),
                  voter: z
                    .object({
                      id: z.string(),
                      name: z.string(),
                      profilePicture: z.string(),
                    })
                    .passthrough()
                    .nullable(),
                  totalVotes: z.number().nullable(),
                  createdAt: z.string(),
                })
                .passthrough()
            )
            .nullable()
        ),
        pagination: z
          .object({
            total: z.number(),
            totalPages: z.number(),
            hasNextPage: z.boolean(),
            hasPreviousPage: z.boolean(),
            nextPage: z.number().nullable(),
            previousPage: z.number().nullable(),
          })
          .passthrough(),
      })
      .passthrough(),
  },
]);

export const api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
