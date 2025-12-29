import type { UserInfo } from "firebase-admin/auth";

export interface SessionData extends Omit<UserInfo, "toJSON"> {
  readonly isAuthenticated: boolean;
}
