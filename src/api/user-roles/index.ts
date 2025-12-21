import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createBuilder } from "@ibnlanre/builder";

import {
  buildServerQuery,
  getServerQueryDoc,
  getServerQueryDocs,
  serverCollection,
} from "@/client/core-query/server";
import { serverRecord } from "@/utils/server-record";

import {
  USER_ROLES_COLLECTION,
  createUserRoleSchema,
  userRoleFormSchema,
  userRoleSchema,
} from "./schema";
import type { CreateUserRoleData, UserRole } from "./types";
import { role } from "../role";
import { userSchema } from "../user/schema";
import { createVariablesSchema } from "@/client/schema";

const assign = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      id: z.string(),
      data: userRoleFormSchema,
      user: userSchema,
    })
  )
  .handler(async ({ data: { id, data, user } }) => {
    const userRolesRef = serverCollection<CreateUserRoleData>(
      USER_ROLES_COLLECTION
    ).doc(id);

    const existingSnapshot = await userRolesRef.get();

    if (existingSnapshot.exists) {
      throw new Error("User already has this role");
    }

    const validated = createUserRoleSchema.parse({
      ...data,
      assigned: serverRecord(user),
    });

    await userRolesRef.set(validated);
  });

const remove = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data: { id } }) => {
    const docRef = serverCollection<UserRole>(USER_ROLES_COLLECTION).doc(id);
    await docRef.delete();
  });

const list = createServerFn({ method: "GET" })
  .inputValidator(createVariablesSchema(userRoleSchema))
  .handler(async ({ data: variables }) => {
    const userRolesRef = serverCollection<UserRole>(USER_ROLES_COLLECTION);
    const userRolesQuery = buildServerQuery(userRolesRef, variables);
    return await getServerQueryDocs(userRolesQuery, userRoleSchema);
  });

const get = createServerFn({ method: "GET" })
  .inputValidator(z.string())
  .handler(async ({ data: id }) => {
    const userRolesRef = serverCollection<UserRole>(USER_ROLES_COLLECTION).doc(
      id
    );
    return await getServerQueryDoc(userRolesRef, userRoleSchema);
  });

const getUserPermissions = createServerFn({ method: "GET" })
  .inputValidator(z.string())
  .handler(async ({ data: id }) => {
    const snapshot = await get({ data: id });
    if (!snapshot) return [];

    const roleSnapshots = await Promise.all(
      snapshot.roleIds.map((roleId) => role.$use.get({ data: roleId }))
    );
    const permissions = roleSnapshots.filter(Boolean).flatMap((snapshot) => {
      if (!snapshot) return [];
      return snapshot.permissions;
    });

    return Array.from(new Set(permissions));
  });

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
