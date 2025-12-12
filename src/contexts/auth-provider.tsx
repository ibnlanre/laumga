import { useEffect, useState, type PropsWithChildren } from "react";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "@/services/firebase";
import { useCurrentUser } from "@/api/user/hooks";
import { useGetUserPermissions } from "@/api/user-roles/handlers";
import { AuthContext } from "./auth-context";

import type { User } from "firebase/auth";

interface AuthProviderProps extends PropsWithChildren {}

export function AuthProvider({ children }: AuthProviderProps) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);

  const { data: permissions = [] } = useGetUserPermissions(firebaseUser?.uid);
  const { data: user = null, isLoading } = useCurrentUser(firebaseUser?.uid);

  useEffect(() => onAuthStateChanged(auth, setFirebaseUser), []);

  return (
    <AuthContext.Provider value={{ user, permissions, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
