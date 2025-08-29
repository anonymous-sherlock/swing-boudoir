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
  role: z.enum(["USER", "MODERATOR", "ADMIN"]),
  type: z.enum(["MODEL", "VOTER"]),
  isActive: z.boolean(),
  image: z.string(),
  phone: z.string(),
  createdAt: z.string(),
  username: z.string(),
  profileId: z.string().optional(),
  emailVerified: z.boolean(),
  hasProfile: z.boolean(),
  // New fields
  gender: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  postalCode: z.string().optional(),
  dateOfBirth: z.string().optional(),
  totalContestsWon: z.number().optional(),
  totalContestsParticipated: z.number().optional(),

  profile: z.object({
    id: z.string().optional().nullable(),
    socialMedia: z.object({
      instagram: z.string().optional().nullable(),
      tiktok: z.string().optional().nullable(),
      youtube: z.string().optional().nullable(),
      twitter: z.string().optional().nullable(),
      facebook: z.string().optional().nullable(),
      linkedin: z.string().optional().nullable(),
      website: z.string().optional().nullable(),
      other: z.string().optional().nullable(),
    }),
  }),
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