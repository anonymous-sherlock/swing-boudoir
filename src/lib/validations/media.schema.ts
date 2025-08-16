import z from "zod";

export const File_Status ={
  FAILED: 'FAILED',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED'
} as const ;

export const Media_Type = {
  COVER_IMAGE: 'COVER_IMAGE',
  CONTEST_IMAGE: 'CONTEST_IMAGE',
  CONTEST_PARTICIPATION_COVER: 'CONTEST_PARTICIPATION_COVER',
  PROFILE_IMAGE: 'PROFILE_IMAGE',
  PROFILE_COVER_IMAGE: 'PROFILE_COVER_IMAGE',
  PROFILE_BANNER_IMAGE: 'PROFILE_BANNER_IMAGE'
} as const;

export const MediaSchema = z.object({
  id: z.string(),
  key: z.string(),
  name: z.string(),
  url: z.string(),
  size: z.number().nullable(),
  type: z.string().nullable(),
  status: z.nativeEnum(File_Status),
  mediaType: z.nativeEnum(Media_Type),
  createdAt: z.date(),
  updatedAt: z.date(),
  profileId: z.string().nullable(),
  caption: z.string().nullable(),
  contestId: z.string().nullable(),
})

export const MediaInsertSchema = MediaSchema.pick({
  mediaType: true,
  profileId: true,
});

export const MediaSelectSchema = MediaSchema;
export const MediaSelectPartial = MediaSelectSchema.pick({
  id: true,
  key: true,
  caption: true,
  url: true,
}).nullable();
