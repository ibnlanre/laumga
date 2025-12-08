import { createServerFn } from "@tanstack/react-start";
import { doc, getDoc } from "firebase/firestore";
import { z } from "zod";

import {
  extractAuthTokenFromHeaders,
  initializeServerFirebase,
} from "./firebase-server-app";
import { userSchema } from "../api/user/schema";
import type { User } from "../api/user/types";

const getUserInputSchema = z.object({
  uid: z.string().min(1, "User ID is required"),
});

/**
 * Server function to fetch user data by UID using FirebaseServerApp.
 * Automatically retrieves auth ID token from sessionStorage for authenticated access.
 * Uses server-side Firestore to avoid client SDK errors during SSR.
 */
export const getServerUser = createServerFn({
  method: "POST",
})
  .inputValidator((input: unknown) => {
    return getUserInputSchema.parse(input);
  })
  .handler(async (ctx) => {
    const { uid } = ctx.data;

    const authIdToken = extractAuthTokenFromHeaders(ctx.request?.headers);

    // Initialize FirebaseServerApp using the request's auth token if provided
    const { serverDb } = initializeServerFirebase({
      authIdToken,
      releaseOnDeref: ctx, // Auto-cleanup when handler context is GC'd
    });

    try {
      const userRef = doc(serverDb, "users", uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        throw new Error(`User with ID ${uid} not found`);
      }

      // Validate and parse response using downstream schema
      const data = userSnap.data();
      const user = userSchema.parse({
        id: userSnap.id,
        ...data,
      }) as User;

      return user;
    } catch (error) {
      console.error("Error fetching user from server:", error);
      throw error;
    }
  });
