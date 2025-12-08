import { z } from "zod";
import { dateSchema, fieldValueSchema } from "@/schema/date";

export const articleDataSchema = z.object({
  title: z.string().min(1, "Title is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.string().min(1, "Content is required"),
  coverImageUrl: z.url("Invalid cover image URL"),
  authorId: z.string().optional(),
  category: z.enum([
    "news",
    "health",
    "islamic",
    "campus",
    "alumni",
    "community",
  ]),
  tags: z.array(z.string()),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  featured: z.boolean().default(false),
  viewCount: z.number().default(0),
  slug: z.string(),
  created: dateSchema,
  published: dateSchema,
  updated: dateSchema,
  archived: dateSchema,
});

export const createArticleSchema = articleDataSchema.extend({
  created: fieldValueSchema,
  published: fieldValueSchema,
  updated: fieldValueSchema,
  archived: fieldValueSchema,
});

export const updateArticleSchema = createArticleSchema.partial();

export const articleSchema = articleDataSchema.extend({
  id: z.string(),
});

export const ARTICLES_COLLECTION = "articles";
