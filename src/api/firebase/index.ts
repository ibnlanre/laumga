import { createServerFn } from "@tanstack/react-start";
import { useAppSession } from "./hooks";
import { auth } from "@/services/firebase-admin";
import { z } from "zod";
import { createBuilder } from "@ibnlanre/builder";

const loginUser = createServerFn({ method: "POST" })
  .inputValidator(z.object({ idToken: z.string(), user: z.any() }))
  .handler(async ({ data }) => {
    const { idToken, user } = data;
    const session = await useAppSession();

    try {
      await auth.verifyIdToken(idToken);
      await session.update({ ...user, isAuthenticated: true });
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
