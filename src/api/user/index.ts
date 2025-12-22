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
import { getFirebaseErrorMessage } from "@/utils/firebase-errors";
import { tryCatch } from "@/utils/try-catch";
import { firebase } from "@/api/firebase";

async function list(variables?: ListUserVariables) {
  const result = await tryCatch(async () => {
    const usersRef = collection(
      db,
      USERS_COLLECTION
    ) as DownstreamUserCollection;

    const usersQuery = buildQuery(usersRef, variables);
    return await getQueryDocs(usersQuery, userSchema);
  });

  if (!result.success) {
    const message = getFirebaseErrorMessage(
      result.error,
      "Couldn't load users. Please try again."
    );
    throw new Error(message);
  }

  return result.data;
}

const get = async (userId: string | null) => {
  if (!userId) return null;

  const result = await tryCatch(async () => {
    const userRef = doc(db, USERS_COLLECTION, userId) as DownstreamUserDocument;
    return await getQueryDoc(userRef, userSchema);
  });

  if (!result.success) {
    const message = getFirebaseErrorMessage(
      result.error,
      "Couldn't load that user. Please try again."
    );
    throw new Error(message);
  }

  return result.data;
};

async function create(variables: CreateUserVariables) {
  const { data } = variables;
  const { password, confirmPassword: _, ...profile } = data;

  const result = await tryCatch(async () => {
    const usersRef = collection(db, USERS_COLLECTION) as UpstreamUserCollection;
    const duplicateQuery = query(usersRef, where("email", "==", profile.email));
    const duplicateSnapshot = await getDocs(duplicateQuery);

    if (!duplicateSnapshot.empty) {
      throw new Error("Email is already registered. Please sign in instead.");
    }

    await setPersistence(auth, browserLocalPersistence);
    const credential = await createUserWithEmailAndPassword(
      auth,
      profile.email,
      password
    );

    const userId = credential.user.uid;
    const userRef = doc(db, USERS_COLLECTION, userId) as UpstreamUserDocument;
    const userData = await getDoc(userRef);

    if (userData.exists()) {
      throw new Error("User already exists");
    }

    const validated = createUserSchema.parse(profile);
    const user = { id: userRef.id, ...validated };

    const payload: CreateUserData = {
      ...validated,
      created: record(user),
      updated: record(user),
    };

    await setDoc(userRef, payload);
  });

  if (!result.success) {
    const message = getFirebaseErrorMessage(
      result.error,
      "Couldn't create your account. Please try again."
    );

    console.error("User creation failed:", result.error);
    throw new Error(message);
  }
}

async function update(variables: UpdateUserVariables) {
  const { id, data, user } = variables;
  const result = await tryCatch(async () => {
    const userRef = doc(db, USERS_COLLECTION, id) as UpstreamUserDocument;
    const validated = updateUserSchema.parse(data);

    const updateData = {
      ...validated,
      updated: record(user),
    };

    await updateDoc(userRef, updateData);
  });

  if (!result.success) {
    const message = getFirebaseErrorMessage(
      result.error,
      "Couldn't update the user. Please try again."
    );
    throw new Error(message);
  }
}

async function login(variables: LoginVariables) {
  const { email, password, rememberMe } = variables;

  const result = await tryCatch(async () => {
    if (rememberMe) await setPersistence(auth, browserLocalPersistence);
    const credential = await signInWithEmailAndPassword(auth, email, password);

    const idToken = await credential.user.getIdToken();
    await firebase.$use.loginUser({ data: { idToken } });

    return credential.user;
  });

  if (!result.success) {
    const message = getFirebaseErrorMessage(
      result.error,
      "Couldn't sign you in. Please try again."
    );
    throw new Error(message);
  }

  return result.data;
}

async function loginWithProvider(provider: AuthProvider) {
  const result = await tryCatch(async () => {
    await setPersistence(auth, browserLocalPersistence);
    const credential = await signInWithPopup(auth, provider);

    const idToken = await credential.user.getIdToken();
    await firebase.$use.loginUser({ data: { idToken } });

    return credential.user;
  });

  if (!result.success) {
    const message = getFirebaseErrorMessage(
      result.error,
      "Couldn't sign you in with the provider. Please try again."
    );
    throw new Error(message);
  }

  return result.data;
}

async function resetPassword(variables: ResetPasswordVariables) {
  const { email } = variables;
  const result = await tryCatch(async () => {
    await sendPasswordResetEmail(auth, email);
  });

  if (!result.success) {
    const message = getFirebaseErrorMessage(
      result.error,
      "Couldn't send password reset email. Please try again."
    );
    throw new Error(message);
  }
}

async function applyPasswordReset(variables: ConfirmPasswordResetVariables) {
  const { token, newPassword } = variables;
  const result = await tryCatch(async () => {
    await confirmPasswordReset(auth, token, newPassword);
  });

  if (!result.success) {
    const message = getFirebaseErrorMessage(
      result.error,
      "Couldn't reset your password. Please try again."
    );
    throw new Error(message);
  }
}

async function logout() {
  const result = await tryCatch(async () => {
    await signOut(auth);
    await firebase.$use.logoutUser();
  });

  if (!result.success) {
    const message = getFirebaseErrorMessage(
      result.error,
      "Couldn't sign you out. Please try again."
    );
    throw new Error(message);
  }
}

export const user = createBuilder(
  {
    list,
    get,
    create,
    update,
    login,
    loginWithProvider,
    resetPassword,
    applyPasswordReset,
    logout,
  },
  { prefix: [USERS_COLLECTION] }
);
