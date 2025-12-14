import { createBuilder } from "@ibnlanre/builder";
import {
  browserLocalPersistence,
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type AuthProvider,
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "@/services/firebase";

import { buildQuery, getQueryDoc, getQueryDocs } from "@/client/core-query";

import {
  USERS_COLLECTION,
  userSchema,
  createUserSchema,
  createUserRecordSchema,
  updateUserSchema,
} from "./schema";
import type {
  ConfirmPasswordResetVariables,
  CreateUserData,
  CreateUserVariables,
  DownstreamUserCollection,
  DownstreamUserDocument,
  ListUserVariables,
  LoginVariables,
  ResetPasswordVariables,
  UpdateUserVariables,
  UpstreamUserCollection,
  UpstreamUserDocument,
} from "./types";
import { record } from "@/utils/record";
import { getFirebaseAuthErrorMessage } from "@/utils/firebase-auth-errors";
import { tryCatch } from "@/utils/try-catch";

async function list(variables?: ListUserVariables) {
  const usersRef = collection(db, USERS_COLLECTION) as DownstreamUserCollection;

  const usersQuery = buildQuery(usersRef, variables);
  return await getQueryDocs(usersQuery, userSchema);
}

const get = async (userId: string | null) => {
  if (!userId) return null;

  const userRef = doc(db, USERS_COLLECTION, userId) as DownstreamUserDocument;
  return await getQueryDoc(userRef, userSchema);
};

async function create(variables: CreateUserVariables) {
  const { data } = variables;

  const validated = createUserSchema.parse(data);
  const { password, ...profile } = validated;

  const result = await tryCatch(async () => {
    const usersRef = collection(db, USERS_COLLECTION) as UpstreamUserCollection;
    const duplicateQuery = query(
      usersRef,
      where("email", "==", validated.email)
    );
    const duplicateSnapshot = await getDocs(duplicateQuery);

    if (!duplicateSnapshot.empty) {
      throw new Error(
        "That email is already registered. Please sign in instead."
      );
    }

    await setPersistence(auth, browserLocalPersistence);
    const credential = await createUserWithEmailAndPassword(
      auth,
      validated.email,
      password
    );

    const userId = credential.user.uid;
    const userRef = doc(db, USERS_COLLECTION, userId) as UpstreamUserDocument;
    const userData = await getDoc(userRef);

    if (userData.exists()) {
      throw new Error("User already exists");
    }

    const user = { id: userRef.id, ...profile };

    const payload: CreateUserData = createUserRecordSchema.parse({
      ...profile,
      created: record(user),
      updated: record(user),
    });

    await setDoc(userRef, payload);
  });

  if (!result.success) {
    const friendlyMessage = getFirebaseAuthErrorMessage(
      result.error,
      "Couldn't create your account. Please try again."
    );
    throw new Error(friendlyMessage);
  }
}

async function update(variables: UpdateUserVariables) {
  const { id, data, user } = variables;

  const userRef = doc(db, USERS_COLLECTION, id) as UpstreamUserDocument;
  const validated = updateUserSchema.parse(data);

  const updateData = {
    ...validated,
    updated: record(user),
  };

  await updateDoc(userRef, updateData);
}

async function login(variables: LoginVariables) {
  const { email, password, rememberMe } = variables;

  const result = await tryCatch(async () => {
    if (rememberMe) await setPersistence(auth, browserLocalPersistence);
    const credential = await signInWithEmailAndPassword(auth, email, password);

    return credential.user;
  });

  if (!result.success) {
    const friendlyMessage = getFirebaseAuthErrorMessage(
      result.error,
      "Couldn't sign you in. Please try again."
    );

    throw new Error(friendlyMessage);
  }

  return result.data;
}

async function loginWithProvider(provider: AuthProvider) {
  const result = await tryCatch(async () => {
    await setPersistence(auth, browserLocalPersistence);
    const credential = await signInWithPopup(auth, provider);
    return credential.user;
  });

  if (!result.success) {
    const friendlyMessage = getFirebaseAuthErrorMessage(
      result.error,
      "Couldn't sign you in with the provider. Please try again."
    );
    throw new Error(friendlyMessage);
  }

  return result.data;
}

async function resetPassword(variables: ResetPasswordVariables) {
  const { email } = variables;
  const result = await tryCatch(async () => {
    await sendPasswordResetEmail(auth, email);
  });

  if (!result.success) {
    const friendlyMessage = getFirebaseAuthErrorMessage(
      result.error,
      "Couldn't send password reset email. Please try again."
    );
    throw new Error(friendlyMessage);
  }
}

async function applyPasswordReset(variables: ConfirmPasswordResetVariables) {
  const { token, newPassword } = variables;
  const result = await tryCatch(async () => {
    await confirmPasswordReset(auth, token, newPassword);
  });

  if (!result.success) {
    const friendlyMessage = getFirebaseAuthErrorMessage(
      result.error,
      "Couldn't reset your password. Please try again."
    );
    throw new Error(friendlyMessage);
  }
}

async function logout() {
  await signOut(auth);
}

export const user = createBuilder({
  list,
  get,
  create,
  update,
  login,
  loginWithProvider,
  resetPassword,
  applyPasswordReset,
  logout,
});
