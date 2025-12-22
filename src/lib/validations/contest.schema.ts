import { z } from "zod";

export const Contest_Status = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  ACTIVE: "ACTIVE",
  BOOKED: "BOOKED",
  VOTING: "VOTING",
  JUDGING: "JUDGING",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
  SUSPENDED: "SUSPENDED",
} as const;

export const Contest_Visibility = {
  PUBLIC: "PUBLIC",
  PRIVATE: "PRIVATE",
  INVITE_ONLY: "INVITE_ONLY",
  RESTRICTED: "RESTRICTED",
} as const;

export const ContestSchema = z.object({
  id: z.string(),
  name: z.string({ message: "contest name is required" }).min(3, "contest name must be at least 3 characters"),
  description: z.string().min(10, "contest description must be at least 10 characters"),
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
  votingStartDate: z.date().nullable(),
  rules: z.string().nullable(),
  requirements: z.string().nullable(),
  winnerProfileId: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  awards: z.array(
    z.object({
      name: z.string(),
      icon: z.string(),
    })
  ),
  images: z
    .array(
      z.object({
        id: z.string(),
        key: z.string(),
        url: z.string(),
      })
    )
    .nullable(),
});

export const ContestInsertSchema = ContestSchema.pick({
  name: true,
  description: true,
  prizePool: true,
  slug: true,
  status: true,
  visibility: true,
  registrationDeadline: true,
  resultAnnounceDate: true,
  votingStartDate: true,
})
  .extend({
    startDate: z.date({ required_error: "Start date is required" }),
    endDate: z.date({ required_error: "End date is required" }),
    registrationDeadline: z.date().nullable().optional(),
    resultAnnounceDate: z.date().nullable().optional(),
    votingStartDate: z.date().nullable().optional(),
    slug: z.string().optional(),
    rules: z.string().optional().nullable(),
    requirements: z.string().optional().nullable(),
    prizePool: z.coerce.number({ required_error: "Prize pool is required", invalid_type_error: "Prize pool must be a number" }).min(1, "Prize pool is required"),
    awards: z.array(
      z.object({
        name: z.string().min(1, "Award name is required"),
        icon: z.string(),
        position: z.number(),
      })
    ),
    images: z.array(z.any()).min(1, "At least one image is required"),
  })
  .refine(
    (data) => {
      return data.endDate > data.startDate;
    },
    {
      message: "End date cannot be before start date",
      path: ["endDate"],
    }
  )
  .refine(
    (data) => {
      // Only validate if registrationDeadline is provided
      if (data.registrationDeadline && data.startDate) {
        return data.registrationDeadline >= data.startDate;
      }
      return true;
    },
    {
      message: "Registration deadline must be equal to or after the start date",
      path: ["registrationDeadline"],
    }
  )
  .refine(
    (data) => {
      // Only validate if registrationDeadline is provided
      if (data.registrationDeadline && data.endDate) {
        return data.registrationDeadline < data.endDate;
      }
      return true;
    },
    {
      message: "Registration deadline must be before the end date",
      path: ["registrationDeadline"],
    }
  )
  .refine(
    (data) => {
      // Only validate if both dates are provided
      if (data.endDate && data.resultAnnounceDate) {
        return data.resultAnnounceDate >= data.endDate;
      }
      return true;
    },
    {
      message: "Result announcement date must be after the end date",
      path: ["resultAnnounceDate"],
    }
  )
  .refine(
    (data) => {
      // Only validate if votingStartDate is provided
      if (data.votingStartDate && data.startDate) {
        return data.votingStartDate >= data.startDate;
      }
      return true;
    },
    {
      message: "Voting start date must be equal to or after the start date",
      path: ["votingStartDate"],
    }
  );

export const ContestEditSchema = ContestSchema.partial()
  .refine(
    (data) => {
      // Only validate if both dates are provided
      if (data.startDate && data.endDate) {
        return data.endDate > data.startDate;
      }
      return true;
    },
    {
      message: "End date cannot be before start date",
      path: ["endDate"],
    }
  )
  .refine(
    (data) => {
      // Only validate if both dates are provided
      if (data.startDate && data.registrationDeadline) {
        return data.registrationDeadline >= data.startDate;
      }
      return true;
    },
    {
      message: "Registration deadline must be equal to or after the start date",
      path: ["registrationDeadline"],
    }
  )
  .refine(
    (data) => {
      // Only validate if both dates are provided
      if (data.endDate && data.registrationDeadline) {
        return data.registrationDeadline < data.endDate;
      }
      return true;
    },
    {
      message: "Registration deadline must be before the end date",
      path: ["registrationDeadline"],
    }
  )
  .refine(
    (data) => {
      // Only validate if both dates are provided
      if (data.endDate && data.resultAnnounceDate) {
        return data.resultAnnounceDate >= data.endDate;
      }
      return true;
    },
    {
      message: "Result announcement date must be after or equal to the end date",
      path: ["resultAnnounceDate"],
    }
  )
  .refine(
    (data) => {
      // Only validate if both dates are provided
      if (data.startDate && data.votingStartDate) {
        return data.votingStartDate >= data.startDate;
      }
      return true;
    },
    {
      message: "Voting start date must be equal to or after the start date",
      path: ["votingStartDate"],
    }
  );
