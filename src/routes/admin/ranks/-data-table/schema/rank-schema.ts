import { z } from "zod";

/**
 * Zod schema for Model Rank entity with camelCase field names
 * 
 * This schema defines the structure of model rank data for the admin panel:
 * - Includes profile information
 * - Rank details (manual vs automatic)
 * - Vote statistics
 * - Rank metadata
 */
export const rankSchema = z.object({
  id: z.string(),
  rank: z.union([z.number(), z.literal("N/A")]),
  isManualRank: z.boolean().optional().default(false),
  profile: z.object({
    id: z.string(),
    name: z.string(),
    image: z.string(),
    username: z.string(),
    bio: z.string(),
  }),
  stats: z.object({
    freeVotes: z.number(),
    paidVotes: z.number(),
  }),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type RankData = z.infer<typeof rankSchema>;

export const ranksResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(rankSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
    total: z.number(),
    hasNextPage: z.boolean().optional(),
    hasPreviousPage: z.boolean().optional(),
    nextPage: z.number().nullable().optional(),
    previousPage: z.number().nullable().optional(),
  }),
});
