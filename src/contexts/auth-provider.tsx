import { useEffect, useState, type PropsWithChildren } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";

import { auth } from "@/services/firebase";
import { useCurrentUser } from "@/api/user/hooks";
import { useGetUserPermissions } from "@/api/user-roles/handlers";
import { AuthContext } from "./auth-context";

import type { User } from "firebase/auth";

interface AuthProviderProps extends PropsWithChildren {}

export function AuthProvider({ children }: AuthProviderProps) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);

  const { data: user = null } = useCurrentUser(firebaseUser?.uid);
  const { data: permissions = [] } = useGetUserPermissions(firebaseUser?.uid);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setFirebaseUser);
    return unsubscribe;
  }, []);

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, logout, permissions }}>
      {children}
    </AuthContext.Provider>
  );
}
