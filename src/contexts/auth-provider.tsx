import { useEffect, useState, type PropsWithChildren } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";

import { auth } from "@/services/firebase";
import { useCurrentUser } from "@/api/user/hooks";
import { AuthContext } from "./auth-context";

import type { User } from "firebase/auth";
import { useGetRoleByName } from "@/api/role/handlers";

interface AuthProviderProps extends PropsWithChildren {}

export function AuthProvider({ children }: AuthProviderProps) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(true);

  const { data: user = null } = useCurrentUser(firebaseUser?.uid);
  const { data: permissions = [] } = useGetRoleByName(user?.role);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      setIsLoggingIn(false);
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, logout, permissions, isLoggingIn }}>
      {children}
    </AuthContext.Provider>
  );
}
