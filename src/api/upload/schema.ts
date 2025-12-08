import { z } from "zod";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024; // 10MB

export const slugCodec = z.string().min(1).slugify();

export const imageFileSchema = z
  .instanceof(File)
  .refine((file) => file.type.startsWith("image/"), {
    message: "File is not an image",
  })
  .refine((file) => file.size <= MAX_IMAGE_SIZE, {
    message: "Image size exceeds 5MB limit",
  });

export const documentFileSchema = z
  .instanceof(File)
  .refine((file) => file.type.startsWith("application/"), {
    message: "File is not a document",
  })
  .refine((file) => file.size <= MAX_DOCUMENT_SIZE, {
    message: "Document size exceeds 10MB limit",
  });