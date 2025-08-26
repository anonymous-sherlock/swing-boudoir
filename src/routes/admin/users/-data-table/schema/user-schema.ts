import { z } from "zod";
/**
 * Zod schema for User entity with camelCase field names
 * 
 * This schema defines the structure of user data with camelCase formatting:
 * - createdAt instead of created_at
 * - expenseCount instead of expense_count  
 * - totalExpenses instead of total_expenses
 */
export const userCamelCaseSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  image: z.string(),
  createdAt: z.string(),
  username: z.string(),
  profileId: z.string().optional(),
  role: z.enum(["USER", "MODERATOR", "ADMIN"]),
  isActive: z.boolean(),
  emailVerified: z.boolean(),
  hasProfile: z.boolean(),
  type: z.enum(["MODEL", "VOTER"]),
  // New fields
  gender: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  postalCode: z.string().optional(),
  dateOfBirth: z.string().optional(),
  totalContestsWon: z.number().optional(),
  totalContestsParticipated: z.number().optional(),
});

export type UserCamelCase = z.infer<typeof userCamelCaseSchema>;

export const usersCamelCaseResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(userCamelCaseSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total_pages: z.number(),
    total_items: z.number(),
  }),
});