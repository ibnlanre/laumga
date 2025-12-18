import { createBuilder } from "@ibnlanre/builder";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

import { buildQuery, getQueryDoc, getQueryDocs } from "@/client/core-query";
import { db } from "@/services/firebase";
import { record } from "@/utils/record";

import {
  ROLES_COLLECTION,
  createRoleSchema,
  roleSchema,
  updateRoleSchema,
} from "./schema";
import type {
  CreateRoleVariables,
  DownstreamRoleCollection,
  DownstreamRoleDocument,
  ListRoleVariables,
  UpdateRoleVariables,
  UpstreamRoleCollection,
  UpstreamRoleDocument,
} from "./types";

async function ensureUniqueRoleName(
  rolesRef: UpstreamRoleCollection,
  name: string,
  excludeId?: string
) {
  const nameQuery = query(rolesRef, where("name", "==", name));
  const snapshot = await getDocs(nameQuery);

  const hasConflict = snapshot.docs.some((doc) => doc.id !== excludeId);

  if (hasConflict) {
    throw new Error("A role with this name already exists");
  }
}

async function list(variables?: ListRoleVariables) {
  const rolesRef = collection(db, ROLES_COLLECTION) as DownstreamRoleCollection;
  const rolesQuery = buildQuery(rolesRef, variables);
  return await getQueryDocs(rolesQuery, roleSchema);
}

async function get(id: string) {
  const roleRef = doc(db, ROLES_COLLECTION, id) as DownstreamRoleDocument;
  return await getQueryDoc(roleRef, roleSchema);
}

async function create(variables: CreateRoleVariables) {
  const { user, data } = variables;

  const rolesRef = collection(db, ROLES_COLLECTION) as UpstreamRoleCollection;
  await ensureUniqueRoleName(rolesRef, data.name);

  const payload = createRoleSchema.parse({
    ...data,
    created: record(user),
    updated: record(user),
  });

  await addDoc(rolesRef, payload);
}

async function update(variables: UpdateRoleVariables) {
  const { id, data, user } = variables;

  const rolesRef = collection(db, ROLES_COLLECTION) as UpstreamRoleCollection;
  const roleRef = doc(db, ROLES_COLLECTION, id) as UpstreamRoleDocument;

  if (typeof data.name === "string") {
    await ensureUniqueRoleName(rolesRef, data.name, id);
  }

  const validated = updateRoleSchema.parse(data);

  await updateDoc(roleRef, {
    ...validated,
    updated: record(user),
  });
}

async function remove(id: string) {
  const roleRef = doc(db, ROLES_COLLECTION, id) as UpstreamRoleDocument;
  await deleteDoc(roleRef);
}

async function getByName(name: string) {
  const rolesRef = collection(db, ROLES_COLLECTION) as DownstreamRoleCollection;
  const nameQuery = query(rolesRef, where("name", "==", name));
  const snapshot = await getDocs(nameQuery);

  if (snapshot.empty) {
    return null;
  }

  const roleDoc = snapshot.docs[0];
  return roleSchema.parse({ id: roleDoc.id, ...roleDoc.data() });
}

export const role = createBuilder(
  {
    list,
    get,
    create,
    update,
    remove,
    getByName,
  },
  { prefix: [ROLES_COLLECTION] }
);
