import { z } from "zod";

/**
 * Zod schema for Vote entity with camelCase field names
 * 
 * This schema defines the structure of vote data for the admin panel:
 * - Includes voter and votee information
 * - Contest details
 * - Payment information for paid votes
 * - Vote metadata (type, count, comment, etc.)
 */
export const voteSchema = z.object({
  id: z.string(),
  type: z.enum(["FREE", "PAID"]),
  count: z.number(),
  comment: z.string().nullable(),
  createdAt: z.string(),
  contest: z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
  }),
  voter: z.object({
    id: z.string(),
    username: z.string(),
    name: z.string(),
    profilePicture: z.string(),
  }),
  votee: z.object({
    id: z.string(),
    username: z.string(),
    name: z.string(),
    profilePicture: z.string(),
  }),
  payment: z.object({
    id: z.string(),
    amount: z.number(),
    status: z.string(),
  }).nullable(),
});

export type VoteData = z.infer<typeof voteSchema>;

export const votesResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(voteSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total_pages: z.number(),
    total_items: z.number(),
    hasNextPage: z.boolean().optional(),
    hasPreviousPage: z.boolean().optional(),
    nextPage: z.number().nullable().optional(),
    previousPage: z.number().nullable().optional(),
  }),
});
