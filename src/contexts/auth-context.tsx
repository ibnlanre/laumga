import { createContext } from "react";

import type { User } from "@/api/user/types";
import type { Permissions } from "@/schema/permissions";

interface AuthContextType {
  user: User | null;
  logout: () => Promise<void>;
  permissions: Permissions;
  isLoggingIn: boolean;
}

export const AuthContext = createContext<AuthContextType>(null!);
