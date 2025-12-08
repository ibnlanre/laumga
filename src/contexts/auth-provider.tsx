import { useEffect, useState, type PropsWithChildren } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";

import { auth } from "@/services/firebase";
import { useCurrentUser } from "@/api/user/hooks";
import { AuthContext } from "./auth-context";

import type { User } from "@/api/user/types";

interface AuthProviderProps extends PropsWithChildren {}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const { mutateAsync } = useCurrentUser();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) return;
      mutateAsync(firebaseUser.uid).then(setUser)
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
