import {
  initializeServerApp,
  type FirebaseServerApp,
  type FirebaseServerAppSettings,
} from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  appId: process.env.VITE_FIREBASE_APP_ID,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
};

export interface ServerAppContext {
  serverApp: FirebaseServerApp;
  serverAuth: Auth;
  serverDb: Firestore;
}

/**
 * Initialize a FirebaseServerApp instance with optional auth ID token from request headers.
 * Uses releaseOnDeref to automatically clean up when the release ref is garbage collected.
 *
 * Can be called with:
 * 1. An explicit authIdToken
 * 2. No token (will try to retrieve from sessionStorage if available)
 * 3. A releaseOnDeref object for automatic cleanup
 */
export function initializeServerFirebase(options?: {
  authIdToken?: string;
  releaseOnDeref?: object;
}): ServerAppContext {
  const settings: FirebaseServerAppSettings = {
    authIdToken: options?.authIdToken,
  };

  if (options?.releaseOnDeref) {
    settings.releaseOnDeref = options.releaseOnDeref;
  }

  const serverApp = initializeServerApp(firebaseConfig, settings);
  const serverAuth = getAuth(serverApp);
  const serverDb = getFirestore(serverApp);

  return {
    serverApp,
    serverAuth,
    serverDb,
  };
}

/**
 * Extract auth ID token from request headers.
 * Expects "Authorization: Bearer <token>" format.
 */
export function extractAuthTokenFromHeaders(
  headers?: Headers | Record<string, string>
): string | undefined {
  if (!headers) return undefined;

  const getHeader = (name: string) => {
    if (typeof Headers !== "undefined" && headers instanceof Headers) {
      return headers.get(name);
    }

    const record = headers as Record<string, string>;
    return record?.[name.toLowerCase()] ?? record?.[name];
  };

  const authHeader = getHeader("authorization");
  if (!authHeader) return undefined;

  const parts = authHeader.split(" ");
  if (parts[0] !== "Bearer" || parts.length !== 2) return undefined;

  return parts[1];
}
