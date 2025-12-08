import { firebaseConfig } from "./firebase";

const SERVICE_WORKER_URL = "/firebase-auth-sw.js";
let registrationPromise: Promise<ServiceWorkerRegistration | null> | null =
  null;
let hasInitialized = false;

async function postFirebaseConfigToWorker(
  registration: ServiceWorkerRegistration
) {
  const worker = registration.active ?? registration.waiting;
  if (!worker) return;

  worker.postMessage({
    type: "INIT_FIREBASE_AUTH",
    config: firebaseConfig,
  });
}

export async function registerFirebaseAuthServiceWorker() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return null;
  }

  if (!registrationPromise) {
    registrationPromise = (async () => {
      try {
        const registration = await navigator.serviceWorker.register(
          SERVICE_WORKER_URL,
          { scope: "/" }
        );

        const readyRegistration = await navigator.serviceWorker.ready;
        await postFirebaseConfigToWorker(readyRegistration);
        hasInitialized = true;

        navigator.serviceWorker.addEventListener(
          "controllerchange",
          async () => {
            if (hasInitialized) {
              const ready = await navigator.serviceWorker.ready;
              await postFirebaseConfigToWorker(ready);
            }
          }
        );

        return readyRegistration;
      } catch (error) {
        console.error("Failed to register Firebase Auth service worker", error);
        return null;
      }
    })();
  }

  return registrationPromise;
}
