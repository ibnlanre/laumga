import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createBuilder } from "@ibnlanre/builder";
import { addMinutes, isAfter } from "date-fns";

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

function isStale(createdAt: Date) {
  return isAfter(new Date(), addMinutes(createdAt, 10));
}

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

    const account = await flutterwave.$use.account.status({
      data: mandate.flutterwaveReference!,
    });

    if (account.data.status === "PENDING") {
      if (isStale(new Date(account.data.created_at))) {
        await ref.delete();
        return null;
      }
    }

    if (account.data.status !== mandate.flutterwaveStatus) {
      mandate.flutterwaveStatus = account.data.status;
      mandate.flutterwaveProcessorResponse = account.data.processor_response;
      mandate.flutterwaveAccountToken = account.data.token;
      mandate.flutterwaveEffectiveDate = account.data.active_on;

      await ref.update(mandate);
    }

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
    const tokenResponse = await flutterwave.$use.account.tokenize({
      data: {
        email: user.email,
        amount: data.amount,
        address: user.address,
        phone_number: user.phoneNumber,
        account_bank: data.bankCode,
        account_number: data.accountNumber,
        start_date: data.startDate,
        end_date: data.endDate!,
        narration: `LAUMGA Foundation ${data.frequency} contribution`,
      },
    });

    const docRef = serverCollection<CreateMandateData>(MANDATES_COLLECTION).doc(
      user.id
    );

    const mandateData: CreateMandateData = {
      userId: user.id,
      amount: data.amount,
      frequency: data.frequency,
      tier: determineTier(data.amount),
      startDate: data.startDate,
      endDate: data.endDate,
      flutterwaveReference: tokenResponse.data.reference,
      flutterwaveAccountId: tokenResponse.data.account_id,
      flutterwaveCustomerId: tokenResponse.data.customer_id,
      flutterwaveStatus: tokenResponse.data.status,
      flutterwaveAccountToken: null,
      flutterwaveMandateConsent: tokenResponse.data.mandate_consent,
      flutterwaveProcessorResponse: tokenResponse.data.processor_response,
      flutterwaveEffectiveDate: null,
      created: serverRecord(user),
      updated: serverRecord(user),
    };

    await docRef.set(mandateData);
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
    if (!mandate?.flutterwaveReference) {
      throw new Error("Mandate has no Flutterwave reference");
    }

    const response = await flutterwave.$use.account.update({
      data: {
        reference: mandate.flutterwaveReference,
        payload: { status: "SUSPENDED" },
      },
    });

    await ref.update({
      flutterwaveStatus: response.data.status,
      flutterwaveProcessorResponse: response.data.processor_response,
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
    if (!mandate?.flutterwaveReference) {
      throw new Error("Mandate has no Flutterwave reference");
    }

    await flutterwave.$use.account.update({
      data: {
        reference: mandate.flutterwaveReference,
        payload: { status: "DELETED" },
      },
    });

    await ref.delete();
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
    if (!mandate?.flutterwaveReference) {
      throw new Error("Mandate has no Flutterwave reference");
    }

    const response = await flutterwave.$use.account.update({
      data: {
        reference: mandate.flutterwaveReference,
        payload: { status: "ACTIVE" },
      },
    });

    await ref.update({
      flutterwaveStatus: response.data.status,
      flutterwaveProcessorResponse: response.data.processor_response,
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
