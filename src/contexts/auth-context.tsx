import { createContext } from "react";

import type { User } from "@/api/user/types";
import type { Permissions } from "@/schema/permissions";

interface AuthContextType {
  user: User | null;
  permissions: Permissions;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType>(null!);
