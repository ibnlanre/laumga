import { createContext } from "react";

import type { User } from "@/api/user/types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>(null!);
