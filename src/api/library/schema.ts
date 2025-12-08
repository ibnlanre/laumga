import { z } from "zod";
import { dateSchema, fieldValueSchema } from "@/schema/date";

export const libraryDataSchema = z.object({
  title: z.string().min(1, "Title is required"),
  year: z.string().min(4, "Year is required"),
  category: z.string().min(1, "Category is required"),
  coverImageUrl: z.url("Invalid cover image URL"),
  description: z.string().min(1, "Description is required"),
  created: dateSchema,
  updated: dateSchema,
});

export const createLibrarySchema = libraryDataSchema.extend({
  created: fieldValueSchema,
  updated: fieldValueSchema,
});

export const updateLibrarySchema = createLibrarySchema.partial();

export const librarySchema = libraryDataSchema.extend({
  id: z.string(),
});

export const LIBRARIES_COLLECTION = "libraries";
