import { z } from "zod";

/**
 * Zod schema for Payment entity with camelCase field names
 * 
 * This schema defines the structure of payment data for the admin panel:
 * - Includes payer information
 * - Payment details (amount, status, stripe session)
 * - Associated votes and contests
 * - Payment metadata (createdAt, etc.)
 */
export const paymentSchema = z.object({
  id: z.string(),
  amount: z.number(),
  status: z.enum(["PENDING", "COMPLETED", "FAILED"]),
  stripeSessionId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  payer: z.object({
    id: z.string(),
    user: z.object({
      name: z.string().nullable(),
      username: z.string().nullable(),
      image: z.string().nullable(),
    }),
  }),
  model: z.object({
    id: z.string(),
    user: z.object({
      name: z.string().nullable(),
      username: z.string().nullable(),
      image: z.string().nullable(),
    }),
  }),
  contest: z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
  }).nullable(),
  comment: z.string().nullable(),
  voteCount: z.number().nullable(),
});

export type PaymentData = z.infer<typeof paymentSchema>;

export const paymentsResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(paymentSchema),
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
