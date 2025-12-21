import { createServerFn } from "@tanstack/react-start";
import { useAppSession } from "./hooks";
import { auth } from "@/services/firebase-admin";
import { z } from "zod";
import { createBuilder } from "@ibnlanre/builder";

const loginUser = createServerFn({ method: "POST" })
  .inputValidator(z.object({ idToken: z.string() }))
  .handler(async ({ data }) => {
    console.log("[Server] loginUser called");
    const { idToken } = data;
    const session = await useAppSession();

    try {
      console.log("[Server] Verifying ID token...");
      const decodedToken = await auth.verifyIdToken(idToken);
      console.log("[Server] Token verified for UID:", decodedToken.uid);

      await session.update({
        userId: decodedToken.uid,
        email: decodedToken.email || "",
      });
      console.log("[Server] Session updated successfully");
    } catch (error) {
      console.error("[Server] Error in loginUser:", error);
      throw new Error("Invalid ID token");
    }
  });

const logoutUser = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useAppSession();
  await session.clear();
});

const getSession = createServerFn({ method: "GET" }).handler(async () => {
  const session = await useAppSession();
  return session.data;
});

export const firebase = createBuilder({
  loginUser,
  logoutUser,
  getSession,
});
