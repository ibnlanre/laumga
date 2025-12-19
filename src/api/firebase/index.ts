import { createServerFn } from "@tanstack/react-start";
import { zodValidator } from "@tanstack/zod-adapter";
import { useAppSession } from "./hooks";
import { auth } from "@/services/firebase-admin";
import { z } from "zod";

export const loginUser = createServerFn({ method: "POST" })
  .inputValidator(zodValidator(z.object({ idToken: z.string() })))
  .handler(async ({ data }) => {
    const { idToken } = data;
    const session = await useAppSession();

    try {
      const decodedToken = await auth.verifyIdToken(idToken);

      await session.update({
        userId: decodedToken.uid,
        email: decodedToken.email || "",
      });
    } catch (error) {
      throw new Error("Invalid ID token");
    }
  });

export const logoutUser = createServerFn({ method: "POST" }).handler(
  async () => {
    const session = await useAppSession();
    await session.clear();
  }
);

export const getSession = createServerFn({ method: "GET" }).handler(
  async () => {
    const session = await useAppSession();
    return session.data;
  }
);
