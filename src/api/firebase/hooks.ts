import { useSession } from "@tanstack/react-start/server";
import type { SessionData } from "./types";

export function useAppSession() {
  return useSession<SessionData>({
    name: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    password: import.meta.env.VITE_FIREBASE_API_KEY,
    cookie: {
      secure: import.meta.env.PROD,
      sameSite: "lax",
      httpOnly: true,
    },
  });
}
