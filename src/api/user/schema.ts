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

export const userRoleSchema = z.enum(["member", "admin"]);

const userBaseSchema = registrationSchema.extend({
  fullName: z.string().default(""),
  chapterId: z.string().nullable().default(null),
  status: approvalStatusSchema.default("pending"),
  role: userRoleSchema.default("member"),
  created: dateSchema,
  updated: dateSchema,
});

export const userDataSchema = userBaseSchema.omit({ password: true });

const createUserBaseSchema = userBaseSchema.extend({
  created: fieldValueSchema,
  updated: fieldValueSchema,
});

export const createUserSchema = createUserBaseSchema.transform((data) => {
  if (data.fullName) return data;

  const { firstName, lastName } = data;
  console.log({ firstName, lastName });
  const fullName = [firstName, lastName]
    .filter(Boolean)
    .map((value) => value.trim())
    .join(" ");

  return {
    ...data,
    fullName,
  };
});

export const updateUserSchema = createUserBaseSchema
  .partial()
  .transform((data) => {
    if (data.fullName) return data;

    const { firstName, lastName } = data;
    const fullName = [firstName, lastName]
      .filter(Boolean)
      .map((value = "") => value.trim())
      .join(" ");

    return {
      ...data,
      fullName,
    };
  });

export const userSchema = userDataSchema.extend({
  id: z.string(),
});
