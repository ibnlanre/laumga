import { useEffect, useState, type PropsWithChildren } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";

import { auth } from "@/services/firebase";
import { registerFirebaseAuthServiceWorker } from "@/services/firebase-auth-service-worker";
import { useCurrentUser } from "@/api/user/hooks";
import { AuthContext } from "./auth-context";

import type { User } from "@/api/user/types";

interface AuthProviderProps extends PropsWithChildren {}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const { mutateAsync } = useCurrentUser();

  useEffect(() => {
    registerFirebaseAuthServiceWorker();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const data = await mutateAsync(firebaseUser.uid);
        setUser(data);
      } catch (error) {
        console.error("Error fetching current user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [mutateAsync]);

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
