import { z } from "zod";

import { dateSchema, fieldValueSchema } from "@/schema/date";
import { permissionSchema } from "@/schema/permissions";

export const ROLES_COLLECTION = "roles";

const roleNameSchema = z
  .string()
  .min(1, "Role name is required")
  .max(120, "Role name is too long");

const permissionsArraySchema = z
  .array(permissionSchema)
  .min(1, "Select at least one permission")
  .transform((values) => Array.from(new Set(values)).sort());

export const roleFormSchema = z.object({
  name: roleNameSchema,
  description: z
    .string()
    .max(280, "Description is too long")
    .default("")
    .transform((value) => value.trim()),
  isSystemRole: z.boolean().default(false),
  permissions: permissionsArraySchema,
});

export const roleDataSchema = roleFormSchema.extend({
  created: dateSchema,
  updated: dateSchema,
});

export const createRoleSchema = roleFormSchema.extend({
  created: fieldValueSchema,
  updated: fieldValueSchema,
});

export const updateRoleSchema = createRoleSchema.partial();

export const roleSchema = roleDataSchema.extend({
  id: z.string(),
});
