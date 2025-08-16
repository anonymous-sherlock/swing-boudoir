import { z } from 'zod';

export const Contest_Status = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  ACTIVE: 'ACTIVE',
  VOTING: 'VOTING',
  JUDGING: 'JUDGING',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  SUSPENDED: 'SUSPENDED',
} as const;

export const Contest_Visibility = {
  PUBLIC: 'PUBLIC',
  PRIVATE: 'PRIVATE',
  INVITE_ONLY: 'INVITE_ONLY',
  RESTRICTED: 'RESTRICTED',
} as const;

export const ContestSchema = z.object({
  id: z.string(),
  name: z.string({ message: 'contest name is required' }).min(3),
  description: z.string(),
  prizePool: z.number(),
  startDate: z.date(),
  endDate: z.date(),
  registrationDeadline: z.date().nullable(),
  resultAnnounceDate: z.date().nullable(),
  slug: z.string(),
  status: z.nativeEnum(Contest_Status),
  visibility: z.nativeEnum(Contest_Visibility),
  isFeatured: z.boolean(),
  isVerified: z.boolean(),
  isVotingEnabled: z.boolean(),
  rules: z.string().nullable(),
  requirements: z.string().nullable(),
  winnerProfileId: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const ContestInsertSchema = ContestSchema.pick({
  name: true,
  description: true,
  prizePool: true,
  slug: true,
  status: true,
  visibility: true,
}).extend({
  startDate: z.preprocess(val => (val ? new Date(val as string) : new Date()), z.date()),
  endDate: z.preprocess(val => (val ? new Date(val as string) : new Date()), z.date()),
  slug: z.string().optional(),
  rules: z.string().optional().nullable(),
  requirements: z.string().optional().nullable(),
  prizePool: z.coerce.number(),
  awards: z.array(
    z.object({
      name: z.string(),
      icon: z.string(),
      position: z.number(),
    })
  ),
  tags: z.array(z.string()),
});
