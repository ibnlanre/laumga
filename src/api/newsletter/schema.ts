import { z } from "zod";

import { dateSchema, fieldValueSchema } from "@/schema/date";

export const issueDataSchema = z.object({
  volume: z.number().int().nonnegative(),
  issueNumber: z.number().int().nonnegative(),
  title: z.string().min(1, "Title is required"),
  pdfUrl: z.url("Invalid PDF URL"),
  coverImageUrl: z.url("Invalid cover image URL"),
  leadStoryTitle: z.string().min(1, "Lead story title is required"),
  highlights: z.array(z.string()),
  downloadCount: z.number().int().nonnegative().default(0),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  archived: dateSchema,
  published: dateSchema,
  created: dateSchema,
  updated: dateSchema,
});

export const createIssueSchema = issueDataSchema.extend({
  archived: fieldValueSchema,
  published: fieldValueSchema,
  created: fieldValueSchema,
  updated: fieldValueSchema,
});

export const updateIssueSchema = createIssueSchema.partial();

export const issueSchema = issueDataSchema.extend({
  id: z.string(),
});

export const NEWSLETTER_ISSUES_COLLECTION = "newsletterIssues";
