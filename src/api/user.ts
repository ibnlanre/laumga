import { z } from "zod";
import {
  CollectionReference,
  collection,
  doc,
  DocumentReference,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import {
  browserLocalPersistence,
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  type AuthProvider,
} from "firebase/auth";

import { auth, db } from "@/services/firebase";
import { buildQuery, getQueryDoc, getQueryDocs, type Variables } from "@/client/core-query";

// Schemas
export const genderSchema = z.enum(["male", "female"]);
export const approvalStatusSchema = z.enum([
  "pending",
  "approved",
  "rejected",
  "suspended",
]);

const logEntrySchema = z.object({
  at: z.instanceof(Timestamp),
  by: z.string().nullable(),
  name: z.string().nullable(),
  photoUrl: z.string().nullable(),
});

export const userSchema = z.object({
  id: z.string(),

  // Identity
  email: z.email(),
  title: z.string().nullable(),
  firstName: z.string(),
  lastName: z.string(),
  middleName: z.string().nullable(),
  maidenName: z.string().nullable(),
  nickname: z.string().nullable(),
  gender: genderSchema,
  dateOfBirth: z.string().nullable(),
  phoneNumber: z.string().nullable(),
  address: z.string().nullable(),

  // Membership Data
  membershipId: z.string().nullable(),
  profilePictureUrl: z.string().nullable(),
  countryOfOrigin: z.string().nullable(),
  stateOfOrigin: z.string().nullable(),
  countryOfResidence: z.string().nullable(),
  stateOfResidence: z.string().nullable(),
  chapterId: z.string().nullable(),
  classSet: z.string().nullable(),

  // System
  status: approvalStatusSchema,
  isAdmin: z.boolean(),
  fcmToken: z.string().nullable(),

  // Meta
  created: logEntrySchema.nullable(),
  modified: logEntrySchema.nullable(),
});

export type Gender = z.infer<typeof genderSchema>;
export type ApprovalStatus = z.infer<typeof approvalStatusSchema>;
export type User = z.infer<typeof userSchema>;

export type UserData = Omit<User, "id">;
export type UserCollection = CollectionReference<UserData>;
export type UserDocumentReference = DocumentReference<UserData>;

export interface CreateUserVariables {
  data: UserData;
  password: string;
}

export interface UpdateUserVariables {
  userId: string;
  updates: Partial<UserData>;
}

/**
 * Fetch all users
 */
async function fetchAll(variables?: Variables<UserData>) {
  const usersRef = collection(db, "users") as UserCollection;
  const usersQuery = buildQuery(usersRef, variables);
  return await getQueryDocs(usersQuery);
}

/**
 * Update user
 */
async function update(variables: UpdateUserVariables) {
  const { userId, updates } = variables;
  const userRef = doc(db, "users", userId) as UserDocumentReference;

  // Validate updates
  const partialUserSchema = userSchema.partial();
  const validUpdates = partialUserSchema.parse(updates);

  const updateData = {
    ...validUpdates,
    modified: {
      at: serverTimestamp(),
      by: userId,
      name: updates.firstName || null,
      photoUrl: updates.profilePictureUrl || null,
    },
  };

  await updateDoc(userRef, updateData);
  return await getQueryDoc(userRef);
}

export const user = {
  login: async (variables: { email: string; password: string }) => {
    const { email, password } = variables;

    await setPersistence(auth, browserLocalPersistence);
    const result = await signInWithEmailAndPassword(auth, email, password);

    return result.user;
  },
  loginWithProvider: async (provider: AuthProvider) => {
    await setPersistence(auth, browserLocalPersistence);
    const result = await signInWithPopup(auth, provider);

    // Check if user exists in Firestore
    const userRef = doc(db, "users", result.user.uid) as UserDocumentReference;
    const userDoc = await getDoc(userRef);

    // If user doesn't exist, create a basic profile
    if (!userDoc.exists()) {
      const [firstName = "", ...lastNameParts] =
        result.user.displayName?.split(" ") || [];
      const lastName = lastNameParts.join(" ");

      await setDoc(userRef, {
        email: result.user.email || "",
        firstName,
        lastName,
        title: null,
        middleName: null,
        maidenName: null,
        nickname: null,
        gender: "male" as const,
        dateOfBirth: null,
        phoneNumber: result.user.phoneNumber || null,
        address: null,
        membershipId: null,
        profilePictureUrl: result.user.photoURL || null,
        countryOfOrigin: null,
        stateOfOrigin: null,
        countryOfResidence: null,
        stateOfResidence: null,
        chapterId: null,
        classSet: null,
        status: "pending" as const,
        isAdmin: false,
        fcmToken: null,
        created: {
          at: serverTimestamp(),
          by: result.user.uid,
          name: firstName,
          photoUrl: result.user.photoURL || null,
        },
        modified: null,
      });
    }

    return result.user;
  },
  create: async (variables: CreateUserVariables) => {
    const { data, password } = variables;

    // Validate data
    const validData = userSchema.parse(data);

    await setPersistence(auth, browserLocalPersistence);
    const result = await createUserWithEmailAndPassword(
      auth,
      validData.email,
      password
    );

    const userId = result.user.uid;
    const userRef = doc(db, "users", userId) as UserDocumentReference;

    await setDoc(userRef, {
      ...validData,
      created: {
        at: serverTimestamp(),
        by: userId,
        name: validData.firstName,
        photoUrl: validData.profilePictureUrl,
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
