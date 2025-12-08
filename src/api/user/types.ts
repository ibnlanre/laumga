import type {
  CollectionReference,
  DocumentReference,
} from "firebase/firestore";
import type z from "zod";
import type { AuthProvider } from "firebase/auth";

import type { Variables } from "@/client/core-query";

import type {
  approvalStatusSchema,
  createUserSchema,
  genderSchema,
  updateUserSchema,
  userDataSchema,
  userSchema,
  userRoleSchema,
} from "./schema";
import type { LoginFormValues } from "../login/types";

export type Gender = z.infer<typeof genderSchema>;
export type ApprovalStatus = z.infer<typeof approvalStatusSchema>;
export type UserRole = z.infer<typeof userRoleSchema>;

export type UserProfile = z.infer<typeof userDataSchema>;
export type UserProfileInput = z.input<typeof userDataSchema>;
export type UserData = z.infer<typeof userDataSchema>;
export type User = z.infer<typeof userSchema>;
export type CreateUserData = z.infer<typeof createUserSchema>;
export type UpdateUserData = z.infer<typeof updateUserSchema>;

export type UpstreamUserCollection = CollectionReference<CreateUserData>;
export type UpstreamUserDocument = DocumentReference<CreateUserData>;
export type DownstreamUserCollection = CollectionReference<UserData>;
export type DownstreamUserDocument = DocumentReference<UserData>;

export type ListUserVariables = Variables<UserData>;

export interface CreateUserVariables {
  data: UserProfileInput;
}

export interface UpdateUserVariables {
  id: string;
  data: UpdateUserData;
  user: User;
}

export interface LoginVariables extends LoginFormValues {}

export type LoginWithProviderVariables = AuthProvider;

export interface ResetPasswordVariables {
  email: string;
}

export interface ConfirmPasswordResetVariables {
  token: string;
  newPassword: string;
}
