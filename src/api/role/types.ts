import type {
  CollectionReference,
  DocumentReference,
} from "firebase/firestore";
import type z from "zod";

import type { Variables } from "@/client/core-query";
import type { User } from "../user/types";
import type {
  createRoleSchema,
  roleDataSchema,
  roleFormSchema,
  roleSchema,
  updateRoleSchema,
} from "./schema";

export type RoleData = z.infer<typeof roleDataSchema>;
export type Role = z.infer<typeof roleSchema>;
export type RoleForm = z.infer<typeof roleFormSchema>;
export type CreateRoleData = z.infer<typeof createRoleSchema>;
export type UpdateRoleData = z.infer<typeof updateRoleSchema>;

export type UpstreamRoleCollection = CollectionReference<CreateRoleData>;
export type UpstreamRoleDocument = DocumentReference<CreateRoleData>;
export type DownstreamRoleCollection = CollectionReference<RoleData>;
export type DownstreamRoleDocument = DocumentReference<RoleData>;

export type ListRoleVariables = Variables<RoleData>;

export interface CreateRoleVariables {
  user: User;
  data: RoleForm;
}

export interface UpdateRoleVariables {
  user: User;
  id: string;
  data: RoleForm;
}
