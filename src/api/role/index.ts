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
  ROLES_COLLECTION,
  createRoleSchema,
  roleSchema,
  updateRoleSchema,
} from "./schema";
import type { CreateRoleData, RoleData } from "./types";
import { userSchema } from "../user/schema";
import { createVariablesSchema } from "@/client/schema";

const ensureUniqueRoleName = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      name: z.string(),
      excludeId: z.string().optional(),
    })
  )
  .handler(async ({ data: { name, excludeId } }) => {
    const rolesRef = serverCollection<RoleData>(ROLES_COLLECTION);
    const snapshot = await rolesRef.where("name", "==", name).get();

    const hasConflict = snapshot.docs.some((doc) => doc.id !== excludeId);

    if (hasConflict) {
      throw new Error("A role with this name already exists");
    }
  });

const list = createServerFn({ method: "GET" })
  .inputValidator(createVariablesSchema(roleSchema))
  .handler(async ({ data: variables }) => {
    const rolesRef = serverCollection<RoleData>(ROLES_COLLECTION);
    const rolesQuery = buildServerQuery(rolesRef, variables);
    return await getServerQueryDocs(rolesQuery, roleSchema);
  });

const get = createServerFn({ method: "GET" })
  .inputValidator(z.string())
  .handler(async ({ data: id }) => {
    const roleRef = serverCollection<RoleData>(ROLES_COLLECTION).doc(id);
    return await getServerQueryDoc(roleRef, roleSchema);
  });

const create = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      data: createRoleSchema,
      user: userSchema,
    })
  )
  .handler(async ({ data: { data, user } }) => {
    await ensureUniqueRoleName({ data: { name: data.name } });

    const rolesRef = serverCollection<CreateRoleData>(ROLES_COLLECTION);
    const payload = createRoleSchema.parse({
      ...data,
      created: serverRecord(user),
    });

    await rolesRef.add(payload);
  });

const update = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      id: z.string(),
      data: updateRoleSchema,
      user: userSchema,
    })
  )
  .handler(async ({ data: { id, data, user } }) => {
    if (typeof data.name === "string") {
      await ensureUniqueRoleName({ data: { name: data.name, excludeId: id } });
    }

    const roleRef = serverCollection<RoleData>(ROLES_COLLECTION).doc(id);
    const validated = updateRoleSchema.parse(data);

    await roleRef.update({
      ...validated,
      updated: serverRecord(user),
    });
  });

const remove = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data: { id } }) => {
    const roleRef = serverCollection<RoleData>(ROLES_COLLECTION).doc(id);
    await roleRef.delete();
  });

const getByName = createServerFn({ method: "GET" })
  .inputValidator(z.string())
  .handler(async ({ data: name }) => {
    const rolesRef = serverCollection<RoleData>(ROLES_COLLECTION);
    const snapshot = await rolesRef.where("name", "==", name).get();

    if (snapshot.empty) {
      return null;
    }

    const roleDoc = snapshot.docs[0];
    return roleSchema.parse({ id: roleDoc.id, ...roleDoc.data() });
  });

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
