import {
  CollectionReference,
  collection,
  doc,
  DocumentReference,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  browserLocalPersistence,
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { auth, db } from "@/services/firebase";
import type { NullableExcept, LogEntry, WithId } from "@/services/types";

export type Gender = "male" | "female"; // Mapped to Brother/Sister in UI
export type ApprovalStatus = "pending" | "approved" | "rejected" | "suspended";
export type User = NullableExcept<
  {
    // Identity
    email: string;
    title: string; // Optional
    firstName: string;
    lastName: string;
    middleName: string; // Optional
    maidenName: string; // Optional
    nickname: string; // Optional, auto-generated
    gender: Gender;
    dateOfBirth: string;
    nationality: string;
    phoneNumber: string;
    address: string; // Residential address

    // Membership Data
    membershipId: string; // Generated (e.g., LAU/19/001)
    passportUrl: string; // The uploaded ID photo
    stateOfOrigin: string;
    stateOfResidence: string;
    chapterId: string; // Linked to Chapters collection

    // System
    status: ApprovalStatus;
    isAdmin: boolean;
    fcmToken: string; // For push notifications

    // Meta
    created: LogEntry;
    modified: LogEntry;
  },
  "email" | "firstName" | "lastName" | "gender" | "status"
>;

export type UserCollection = CollectionReference<User>;
export type UserDocumentReference = DocumentReference<User>;
export type UserData = WithId<User>;

export interface CreateUserVariables {
  data: User;
  password: string;
}

export interface UpdateUserVariables {
  userId: string;
  updates: Partial<User>; // Flexible updates for profile edits
}

/**
 * Fetch all users
 */
async function fetchAll(filters?: {
  status?: ApprovalStatus;
}): Promise<UserData[]> {
  const usersRef = collection(db, "users");
  let usersQuery = query(usersRef);

  if (filters?.status) {
    usersQuery = query(usersRef, where("status", "==", filters.status));
  }

  const snapshot = await getDocs(usersQuery);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as UserData[];
}

/**
 * Update user
 */
async function update(
  userId: string,
  updates: Partial<User>
): Promise<UserData> {
  const userRef = doc(db, "users", userId) as UserDocumentReference;

  const updateData = {
    ...updates,
    modified: {
      at: serverTimestamp(),
      by: userId,
      name: updates.firstName || null,
      photoUrl: updates.passportUrl || null,
    },
  };

  await updateDoc(userRef, updateData);

  const userDoc = await getDoc(userRef);
  if (!userDoc.exists()) {
    throw new Error("User not found after update");
  }

  return { id: userDoc.id, ...userDoc.data() } as UserData;
}

export const user = {
  login: async (variables: { email: string; password: string }) => {
    const { email, password } = variables;

    await setPersistence(auth, browserLocalPersistence);
    const result = await signInWithEmailAndPassword(auth, email, password);

    return result.user;
  },
  create: async (variables: CreateUserVariables) => {
    const { data, password } = variables;

    await setPersistence(auth, browserLocalPersistence);
    const result = await createUserWithEmailAndPassword(
      auth,
      data.email,
      password
    );

    const userId = result.user.uid;
    const userRef = doc(db, "users", userId) as UserDocumentReference;

    await setDoc(userRef, {
      ...data,
      created: {
        at: serverTimestamp(),
        by: userId,
        name: data.firstName,
        photoUrl: data.passportUrl,
      },
    });

    return result.user;
  },
  fetch: async (userId: string | null) => {
    if (!userId) return null;

    const userRef = doc(db, "users", userId) as UserDocumentReference;
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() };
    }

    return null;
  },
  resetPassword: async (variables: { email: string }) => {
    const { email } = variables;
    await sendPasswordResetEmail(auth, email);
  },
  confirmPasswordReset: async (variables: {
    token: string;
    newPassword: string;
  }) => {
    const { token, newPassword } = variables;
    await confirmPasswordReset(auth, token, newPassword);
  },
  fetchAll,
  update,
};
