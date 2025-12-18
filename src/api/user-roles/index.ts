import { createBuilder } from "@ibnlanre/builder";
import { collection, deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";

import { buildQuery, getQueryDoc, getQueryDocs } from "@/client/core-query";
import { db } from "@/services/firebase";
import { record } from "@/utils/record";

import {
  USER_ROLES_COLLECTION,
  createUserRoleSchema,
  userRoleSchema,
} from "./schema";
import type {
  AssignRoleVariables,
  DownstreamUserRoleCollection,
  DownstreamUserRoleDocument,
  ListUserRoleVariables,
  RemoveRoleVariables,
  UpstreamUserRoleDocument,
} from "./types";
import { role } from "../role";

async function assign(variables: AssignRoleVariables) {
  const { user, data, id } = variables;

  const userRolesRef = doc(
    db,
    USER_ROLES_COLLECTION,
    id
  ) as UpstreamUserRoleDocument;

  const existingSnapshot = await getDoc(userRolesRef);

  if (!existingSnapshot.exists()) {
    throw new Error("User already has this role");
  }

  const validated = createUserRoleSchema.parse(data);

  const userRolesData = {
    ...validated,
    assigned: record(user),
  };

  await setDoc(userRolesRef, userRolesData);
}

async function remove(variables: RemoveRoleVariables) {
  const { id } = variables;

  const docRef = doc(db, USER_ROLES_COLLECTION, id) as UpstreamUserRoleDocument;
  await deleteDoc(docRef);
}

async function list(variables: ListUserRoleVariables) {
  const userRolesRef = collection(
    db,
    USER_ROLES_COLLECTION
  ) as DownstreamUserRoleCollection;

  const userRolesQuery = buildQuery(userRolesRef, variables);
  return await getQueryDocs(userRolesQuery, userRoleSchema);
}

async function get(id: string) {
  const userRolesRef = doc(
    db,
    USER_ROLES_COLLECTION,
    id
  ) as DownstreamUserRoleDocument;

  return await getQueryDoc(userRolesRef, userRoleSchema);
}

async function getUserPermissions(id: string) {
  const snapshot = await get(id);
  if (!snapshot) return [];

  const roleSnapshots = await Promise.all(snapshot.roleIds.map(role.$use.get));
  const permissions = roleSnapshots.filter(Boolean).flatMap((snapshot) => {
    if (!snapshot) return [];
    return snapshot.permissions;
  });

  return Array.from(new Set(permissions));
}

export const userRole = createBuilder(
  {
    get,
    getUserPermissions,
    assign,
    remove,
    list,
  },
  { prefix: [USER_ROLES_COLLECTION] }
);
