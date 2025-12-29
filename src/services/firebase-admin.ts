import admin from "firebase-admin";
import { getAuth } from "firebase-admin/auth";

const firebaseServerKey = import.meta.env.VITE_FIREBASE_SERVICE_ACCOUNT;

if (!firebaseServerKey) {
  throw new Error("Firebase service account key is not defined.");
}

const serviceAccount = JSON.parse(
  Buffer.from(firebaseServerKey, "base64").toString("utf-8")
);

export const app = admin.apps.length
  ? admin.app()
  : admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    });

export const auth = getAuth(app);
export const db = admin.firestore(app);
export const storage = admin.storage(app);
