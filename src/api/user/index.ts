import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
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
  updateCurrentUser,
  type AuthProvider,
} from "firebase/auth";
import { auth } from "@/services/firebase";

import { createVariablesSchema } from "@/client/schema";

import {
  USERS_COLLECTION,
  userSchema,
  updateUserSchema,
  userDataSchema,
  createFullName,
} from "./schema";
import type {
  User,
  ConfirmPasswordResetVariables,
  CreateUserVariables,
  LoginVariables,
  ResetPasswordVariables,
} from "./types";
import { getFirebaseErrorMessage } from "@/utils/firebase-errors";
import { tryCatch } from "@/utils/try-catch";
import { firebase } from "@/api/firebase";
import {
  buildServerQuery,
  getServerQueryDoc,
  getServerQueryDocs,
  serverCollection,
} from "@/client/core-query/server";
import { serverRecord } from "@/utils/server-record";

const list = createServerFn({ method: "GET" })
  .inputValidator(createVariablesSchema(userSchema))
  .handler(async ({ data: variables }) => {
    const usersRef = serverCollection<User>(USERS_COLLECTION);
    const query = buildServerQuery(usersRef, variables);
    return getServerQueryDocs(query, userSchema);
  });

const get = createServerFn({ method: "GET" })
  .inputValidator(z.string())
  .handler(async ({ data: userId }) => {
    const docRef = serverCollection<User>(USERS_COLLECTION).doc(userId);
    return getServerQueryDoc(docRef, userSchema);
  });

const update = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      id: z.string(),
      data: updateUserSchema,
      user: userSchema,
    })
  )
  .handler(async ({ data: { id, data, user } }) => {
    const docRef = serverCollection<User>(USERS_COLLECTION).doc(id);
    const updateData = { ...data, updated: serverRecord(user) };
    await docRef.update(updateData);
  });

const checkEmail = createServerFn({ method: "POST" })
  .inputValidator(z.string())
  .handler(async ({ data: email }) => {
    const usersRef = serverCollection<User>(USERS_COLLECTION);
    const snapshot = await usersRef.where("email", "==", email).get();
    return !snapshot.empty;
  });

const createUserDoc = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      id: z.string(),
      data: userDataSchema.transform(createFullName),
    })
  )
  .handler(async ({ data: { id, data } }) => {
    const userRef = serverCollection<User>(USERS_COLLECTION).doc(id);
    const userData = await userRef.get();

    if (userData.exists) {
      throw new Error("User already exists");
    }

    const user = { id: userRef.id, ...data };
    const payload = { ...user, created: serverRecord(user) };

    if (auth.currentUser) {
      updateCurrentUser(auth, {
        ...auth.currentUser,
        displayName: data.fullName,
        phoneNumber: data.phoneNumber,
        photoURL: data.photoUrl,
      });
    }

    await userRef.set(payload);
  });

async function create(variables: CreateUserVariables) {
  const { data } = variables;
  const { password, confirmPassword: _, ...profile } = data;

  const result = await tryCatch(async () => {
    const emailExists = await checkEmail({ data: profile.email });

    if (emailExists) {
      throw new Error("Email is already registered. Please sign in instead.");
    }

    await setPersistence(auth, browserLocalPersistence);
    const credential = await createUserWithEmailAndPassword(
      auth,
      profile.email,
      password
    );

    const userId = credential.user.uid;
    await createUserDoc({ data: { id: userId, data: profile } });
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

async function login(variables: LoginVariables) {
  const { email, password, rememberMe } = variables;

  const result = await tryCatch(async () => {
    if (rememberMe) await setPersistence(auth, browserLocalPersistence);

    const credential = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await credential.user.getIdToken();
    const user = credential.user.toJSON();

    await firebase.$use.loginUser({ data: { idToken, user } });
    return user;
  });

  if (!result.success) {
    console.error("[Client] Login failed:", result.error);
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
    const user = credential.user.toJSON();

    await firebase.$use.loginUser({ data: { idToken, user } });
    return user;
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
