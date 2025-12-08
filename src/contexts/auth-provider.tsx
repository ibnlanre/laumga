import { useEffect, useState, type PropsWithChildren } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";

import { auth } from "@/services/firebase";
import { useCurrentUser } from "@/api/user/hooks";
import { AuthContext } from "./auth-context";

import type { User } from "@/api/user/types";

interface AuthProviderProps extends PropsWithChildren {}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const { mutateAsync } = useCurrentUser();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) mutateAsync(user.uid).then(setUser);
      else setUser(null);

      setLoading(false);
    });

    return unsubscribe;
  }, []);

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
