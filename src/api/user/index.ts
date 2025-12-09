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
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
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
  UpstreamUserDocument,
} from "./types";
import { record } from "@/utils/record";

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

  await setPersistence(auth, browserLocalPersistence);
  const credential = await createUserWithEmailAndPassword(
    auth,
    validated.email,
    validated.password
  );

  const userId = credential.user.uid;
  const userRef = doc(db, USERS_COLLECTION, userId) as UpstreamUserDocument;
  const userData = await getDoc(userRef);

  if (userData.exists()) {
    throw new Error("User already exists");
  }

  const user = { id: userRef.id, ...validated };

  const payload: CreateUserData = createUserSchema.parse({
    ...validated,
    created: record(user),
    updated: record(user),
  });

  await setDoc(userRef, payload);
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

  if (rememberMe) await setPersistence(auth, browserLocalPersistence);
  const credential = await signInWithEmailAndPassword(auth, email, password);

  return credential.user;
}

async function loginWithProvider(provider: AuthProvider) {
  await setPersistence(auth, browserLocalPersistence);
  const credential = await signInWithPopup(auth, provider);
  return credential.user;
}

async function resetPassword(variables: ResetPasswordVariables) {
  const { email } = variables;
  await sendPasswordResetEmail(auth, email);
}

async function applyPasswordReset(variables: ConfirmPasswordResetVariables) {
  const { token, newPassword } = variables;
  await confirmPasswordReset(auth, token, newPassword);
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
