import type {
  CollectionReference,
  DocumentReference,
} from "firebase/firestore";
import type z from "zod";

import type { User } from "../user/types";
import type { createUserRoleSchema, userRoleDataSchema, userRoleFormSchema, userRoleSchema } from "./schema";
import type { Variables } from "@/client/core-query";

export type UserRole = z.infer<typeof userRoleSchema>;
export type UserRoleData = z.infer<typeof userRoleDataSchema>;
export type UserRoleFormData = z.infer<typeof userRoleFormSchema>;
export type CreateUserRoleData = z.infer<typeof createUserRoleSchema>;

export type UpstreamUserRoleCollection =
  CollectionReference<CreateUserRoleData>;
export type UpstreamUserRoleDocument = DocumentReference<CreateUserRoleData>;
export type DownstreamUserRoleCollection =
  CollectionReference<UserRole>;
export type DownstreamUserRoleDocument = DocumentReference<UserRole>;

export type ListUserRoleVariables = Variables<UserRole>;

export interface AssignRoleVariables {
  user: User;
  data: UserRoleFormData;
  id: string;
}

export interface RemoveRoleVariables {
  id: string;
}
