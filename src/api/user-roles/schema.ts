import { z } from "zod";
import { dateSchema, fieldValueSchema } from "@/schema/date";

export const USER_ROLES_COLLECTION = "userRoles";

export const userRoleFormSchema = z.object({
  roleIds: z
    .array(z.string().min(1, "Role is required"))
    .length(1, "At least one role must be assigned"),
});

export const userRoleDataSchema = userRoleFormSchema.extend({
  assigned: dateSchema,
});

export const createUserRoleSchema = userRoleDataSchema.extend({
  assigned: fieldValueSchema,
});

export const userRoleSchema = userRoleDataSchema.extend({
  id: z.string(),
});

export type UserRoleAssignment = z.infer<typeof userRoleSchema>;
