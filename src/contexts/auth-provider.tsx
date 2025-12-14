import type { PropsWithChildren } from "react";

import { AuthContext } from "./auth-context";

import type { User } from "@/api/user/types";
import type { Permissions } from "@/schema/permissions";

interface AuthProviderProps extends PropsWithChildren {
  user: User | null;
  permissions: Permissions;
}

export function AuthProvider({
  children,
  user,
  permissions,
}: AuthProviderProps) {
  return (
    <AuthContext.Provider value={{ user, permissions }}>
      {children}
    </AuthContext.Provider>
  );
}
