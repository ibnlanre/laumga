/* eslint-disable no-restricted-globals */
const FIREBASE_SDK_VERSION = "12.6.0";
const INIT_MESSAGE = "INIT_FIREBASE_AUTH";
const AUTH_HEADER = "authorization";
const SSR_HEADER = "x-tsr-redirect";
const SSR_ACCEPT_SIGNATURE = "text/x-component";
const SSR_PATH_HINTS = ["/_server", "/_tsr", "/_ts", "/_rsc"];

self.importScripts(
  `https://www.gstatic.com/firebasejs/${FIREBASE_SDK_VERSION}/firebase-app-compat.js`,
  `https://www.gstatic.com/firebasejs/${FIREBASE_SDK_VERSION}/firebase-auth-compat.js`
);

let initializationPromise = null;
let authStateReadyPromise = null;
let resolveAuthStateReady = null;
let currentIdToken = null;
let tokenRefreshTimeoutId = null;

resetAuthStateReadyPromise();

function resetAuthStateReadyPromise() {
  authStateReadyPromise = new Promise((resolve) => {
    resolveAuthStateReady = resolve;
  });
}

function settleAuthStateReady() {
  if (resolveAuthStateReady) {
    resolveAuthStateReady();
    resolveAuthStateReady = null;
  }
}

function scheduleTokenRefresh(user) {
  if (tokenRefreshTimeoutId) {
    clearTimeout(tokenRefreshTimeoutId);
    tokenRefreshTimeoutId = null;
  }

  if (!user) {
    return;
  }

  tokenRefreshTimeoutId = setTimeout(
    async () => {
      try {
        currentIdToken = await user.getIdToken(true);
      } catch (error) {
        console.error("[firebase-auth-sw] Failed to refresh ID token", error);
        currentIdToken = null;
      } finally {
        scheduleTokenRefresh(user);
      }
    },
    50 * 60 * 1000
  );
}

function initializeFirebaseAuth(config) {
  if (initializationPromise) {
    return initializationPromise;
  }

  initializationPromise = (async () => {
    firebase.initializeApp(config);
    const auth = firebase.auth();
    await auth.setPersistence(firebase.auth.Auth.Persistence.NONE);

    auth.onIdTokenChanged(async (user) => {
      try {
        if (user) {
          currentIdToken = await user.getIdToken();
        } else {
          currentIdToken = null;
        }
      } catch (error) {
        console.error("[firebase-auth-sw] Unable to resolve ID token", error);
        currentIdToken = null;
      } finally {
        scheduleTokenRefresh(user || null);
        settleAuthStateReady();
      }
    });
  })().catch((error) => {
    console.error("[firebase-auth-sw] Firebase initialization failed", error);
    initializationPromise = null;
    resetAuthStateReadyPromise();
    throw error;
  });

  return initializationPromise;
}

function shouldHandleRequest(request) {
  const url = new URL(request.url);

  if (url.origin !== self.location.origin) {
    return false;
  }

  if (url.pathname === "/firebase-auth-sw.js") {
    return false;
  }

  if (request.headers.has(SSR_HEADER)) {
    return true;
  }

  const acceptHeader = request.headers.get("accept") || "";
  if (acceptHeader.includes(SSR_ACCEPT_SIGNATURE)) {
    return true;
  }

  return SSR_PATH_HINTS.some((path) => url.pathname.startsWith(path));
}

async function addAuthHeader(request) {
  await initializationPromise;
  await authStateReadyPromise;

  if (!currentIdToken) {
    return fetch(request);
  }

  const headers = new Headers(request.headers);
  if (!headers.has(AUTH_HEADER)) {
    headers.set("Authorization", `Bearer ${currentIdToken}`);
  }

  const authorizedRequest = new Request(request, { headers });
  return fetch(authorizedRequest);
}

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("message", (event) => {
  if (!event.data || event.data.type !== INIT_MESSAGE) {
    return;
  }

  if (!event.data.config) {
    console.warn("[firebase-auth-sw] Missing Firebase config in INIT message");
    return;
  }

  initializeFirebaseAuth(event.data.config);
});

self.addEventListener("fetch", (event) => {
  if (!initializationPromise || !shouldHandleRequest(event.request)) {
    return;
  }

  event.respondWith(
    (async () => {
      try {
        return await addAuthHeader(event.request);
      } catch (error) {
        console.error(
          "[firebase-auth-sw] Falling back to default fetch",
          error
        );
        return fetch(event.request);
      }
    })()
  );
});
