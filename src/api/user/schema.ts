import { z } from "zod";

import { dateSchema, fieldValueSchema } from "@/schema/date";
import { registrationSchema } from "../registration/schema";

export const USERS_COLLECTION = "users";

export const genderSchema = z.enum(["male", "female"]);

export const approvalStatusSchema = z.enum([
  "pending",
  "approved",
  "rejected",
  "suspended",
]);

interface NameFields {
  fullName?: string;
  firstName?: string;
  lastName?: string;
}

const createFullName = <T extends NameFields>(data: T) => {
  if (data.fullName) return data;

  const { firstName, lastName } = data;
  const fullName = [firstName, lastName]
    .filter(Boolean)
    .map((value = "") => value.trim())
    .join(" ")
    .trim();

  return {
    ...data,
    fullName,
  };
};

const userBaseSchema = registrationSchema.extend({
  fullName: z.string().default(""),
  chapterId: z.string().nullable().default(null),
  status: approvalStatusSchema.default("pending"),
  created: dateSchema,
  updated: dateSchema,
});

export const userDataSchema = userBaseSchema.omit({ password: true });

const createUserBaseSchema = userBaseSchema.extend({
  created: fieldValueSchema,
  updated: fieldValueSchema,
});

export const createUserSchema = createUserBaseSchema.transform(createFullName);

export const updateUserSchema = createUserBaseSchema
  .partial()
  .transform(createFullName);

export const userSchema = userDataSchema.extend({
  id: z.string(),
});
