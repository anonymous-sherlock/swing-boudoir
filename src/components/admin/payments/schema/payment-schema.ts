import { z } from "zod";

/**
 * Zod schema for Payment entity with camelCase field names
 * 
 * This schema defines the structure of payment data with camelCase formatting:
 * - createdAt instead of created_at
 * - stripeSessionId instead of stripe_session_id
 */
export const paymentCamelCaseSchema = z.object({
  id: z.string(),
  amount: z.number(),
  status: z.enum(['PENDING', 'COMPLETED', 'FAILED']),
  stripeSessionId: z.string(),
  createdAt: z.string(),
  payer: z.object({
    id: z.string(),
    user: z.object({
      name: z.string(),
    }),
  }),
  votes: z.array(z.object({
    id: z.string(),
    type: z.enum(['FREE', 'PAID']),
    contest: z.object({
      name: z.string(),
    }),
    count: z.number().nullable(),
    votee: z.object({
      id: z.string(),
      user: z.object({
        name: z.string(),
      }),
    }),
    createdAt: z.string(),
  })),
});

export type PaymentCamelCase = z.infer<typeof paymentCamelCaseSchema>;

export const paymentsCamelCaseResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(paymentCamelCaseSchema),
  pagination: z.object({
    page: z.number(),   
    limit: z.number(),
    total_pages: z.number(),
    total_items: z.number(),
  }),
});
