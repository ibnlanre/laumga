import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createBuilder } from "@ibnlanre/builder";

import { serverRecord } from "@/utils/server-record";
import {
  buildServerQuery,
  getServerQueryDoc,
  getServerQueryDocs,
  serverCollection,
} from "@/client/core-query/server";
import { createVariablesSchema } from "@/client/schema";

import {
  MANDATES_COLLECTION,
  createMandateSchema,
  mandateSchema,
  updateMandateSchema,
} from "./schema";
import type { CreateMandateData, Mandate } from "./types";
import { determineTier } from "./utils";
import { flutterwave } from "../flutterwave";
import { userSchema, USERS_COLLECTION } from "../user/schema";
import type { User } from "../user/types";
import { feed } from "../feed";
import { FieldValue } from "firebase-admin/firestore";

const list = createServerFn({ method: "GET" })
  .inputValidator(createVariablesSchema(mandateSchema))
  .handler(async ({ data: variables }) => {
    const mandatesRef = serverCollection<Mandate>(MANDATES_COLLECTION);
    const query = buildServerQuery(mandatesRef, variables);
    const mandates = await getServerQueryDocs(query, mandateSchema);

    const userIds = [...new Set(mandates.map((m) => m.userId))];

    if (userIds.length === 0) return mandates;

    const usersRef = serverCollection<User>(USERS_COLLECTION);
    const userDocs = await Promise.all(
      userIds.map((id) => usersRef.doc(id).get())
    );

    const userMap = new Map(
      userDocs
        .filter((doc) => doc.exists)
        .map((doc) => [doc.id, userSchema.parse({ id: doc.id, ...doc.data() })])
    );

    return mandates.map((m) => ({
      ...m,
      user: userMap.get(m.userId),
    }));
  });

const get = createServerFn({ method: "GET" })
  .inputValidator(z.string())
  .handler(async ({ data: id }) => {
    const ref = serverCollection<Mandate>(MANDATES_COLLECTION).doc(id);
    const mandate = await getServerQueryDoc(ref, mandateSchema);

    if (!mandate) return null;

    return mandate;
  });

const create = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      user: userSchema,
      data: createMandateSchema,
    })
  )
  .handler(async ({ data: { user, data } }) => {
    const docRef = serverCollection<CreateMandateData>(MANDATES_COLLECTION).doc(
      user.id
    );

    const snapshot = await docRef.get();

    if (snapshot.exists) {
      throw new Error("Mandate already exists for this user");
    }

    await docRef.set({
      userId: user.id,
      amount: data.amount,
      frequency: data.frequency,
      tier: determineTier(data.amount),
      status: "active",
      paymentPlanId: data.paymentPlanId,
      transactionId: data.transactionId,
      transactionReference: data.transactionReference,
      subscriptionId: data.subscriptionId,
      customerEmail: data.customerEmail,
      created: serverRecord(user),
      updated: null,
    });

    await feed.$use.create({
      data: {
        location: user.branch,
        timestamp: FieldValue.serverTimestamp(),
        amount: data.amount,
        gender: user.gender,
        userId: user.id,
        type: "donation",
      },
    });
  });

const update = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      user: userSchema,
      data: updateMandateSchema,
    })
  )
  .handler(async ({ data: { user, data } }) => {
    const ref = serverCollection<Mandate>(MANDATES_COLLECTION).doc(user.id);
    const snapshot = await ref.get();

    if (!snapshot.exists) {
      throw new Error("Mandate not found");
    }

    await ref.update({ ...data, updated: serverRecord(user) });
  });

const pause = createServerFn({ method: "POST" })
  .inputValidator(z.object({ user: userSchema }))
  .handler(async ({ data: { user } }) => {
    const ref = serverCollection<Mandate>(MANDATES_COLLECTION).doc(user.id);
    const snapshot = await ref.get();

    if (!snapshot.exists) {
      throw new Error("Mandate not found");
    }

    const mandate = snapshot.data();
    if (!mandate?.subscriptionId) {
      throw new Error("Mandate has no subscription ID");
    }

    await flutterwave.$use.subscription.cancel({
      data: mandate.subscriptionId,
    });

    await ref.update({
      status: "paused",
      updated: serverRecord(user),
    });
  });

const cancel = createServerFn({ method: "POST" })
  .inputValidator(z.object({ user: userSchema }))
  .handler(async ({ data: { user } }) => {
    const ref = serverCollection<Mandate>(MANDATES_COLLECTION).doc(user.id);
    const snapshot = await ref.get();

    if (!snapshot.exists) {
      throw new Error("Mandate not found");
    }

    const mandate = snapshot.data();
    if (!mandate?.subscriptionId) {
      throw new Error("Mandate has no subscription ID");
    }

    await flutterwave.$use.subscription
      .cancel({
        data: mandate.subscriptionId,
      })
      .finally(async () => {
        await ref.delete();
      });
  });

const reinstate = createServerFn({ method: "POST" })
  .inputValidator(z.object({ user: userSchema }))
  .handler(async ({ data: { user } }) => {
    const ref = serverCollection<Mandate>(MANDATES_COLLECTION).doc(user.id);
    const snapshot = await ref.get();

    if (!snapshot.exists) {
      throw new Error("Mandate not found");
    }

    const mandate = snapshot.data();
    if (!mandate?.subscriptionId) {
      throw new Error("Mandate has no subscription ID");
    }

    await flutterwave.$use.subscription.activate({
      data: mandate.subscriptionId,
    });

    await ref.update({
      status: "active",
      updated: serverRecord(user),
    });
  });

export const mandate = createBuilder(
  {
    create,
    get,
    pause,
    cancel,
    reinstate,
    update,
    list,
  },
  { prefix: [MANDATES_COLLECTION] }
);
