import { z } from "zod";
import { fieldValueSchema, dateSchema } from "@/schema/date";

export const authorSocialLinkSchema = z.object({
  platform: z.string().min(1, "Platform is required"),
  url: z.url("Invalid social link URL"),
  handle: z.string().nullable().optional(),
});

export const authorDataSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  headline: z.string().min(1, "Headline is required"),
  bio: z.string().min(1, "Bio is required"),
  avatarUrl: z.url("Invalid avatar URL"),
  email: z.email("Invalid email address").optional(),
  phone: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  featured: z.boolean().default(false),
  socials: z.array(authorSocialLinkSchema).default([]),
  created: dateSchema,
  published: dateSchema,
  updated: dateSchema,
  archived: dateSchema,
});

export const createAuthorSchema = authorDataSchema.extend({
  created: fieldValueSchema,
  published: fieldValueSchema,
  updated: fieldValueSchema,
  archived: fieldValueSchema,
});

export const updateAuthorSchema = createAuthorSchema.partial();

export const authorSchema = authorDataSchema.extend({
  id: z.string(),
});

export const AUTHORS_COLLECTION = "authors";
