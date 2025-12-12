import { createBuilder } from "@ibnlanre/builder";
import {
  collection,
  doc,
  getDoc,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "@/services/firebase";
import { record } from "@/utils/record";
import { formatDate } from "@/utils/date";
import { buildQuery, getQueryDoc, getQueryDocs } from "@/client/core-query";
import { paymentPartner } from "@/api/payment-partner";
import { mono } from "@/api/mono";
import { mandateCertificate } from "@/api/mandate-certificate";

import {
  MANDATES_COLLECTION,
  createMandateSchema,
  mandateDataSchema,
  mandateSchema,
} from "./schema";
import type {
  CreateMandateData,
  CreateMandateVariables,
  UpdateMandateVariables,
  MandateCollection,
  MandateDocument,
  ListMandateVariables,
  MandateDebitType,
  MandateType,
} from "./types";
import {
  buildSplitConfiguration,
  determineTier,
  generateDebitReference,
  generateMandateReference,
  mapMonoStatus,
} from "./utils";
import { tryCatch } from "@/utils/try-catch";

async function getActive(userId: string) {
  if (!userId) return null;

  const mandatesRef = collection(db, MANDATES_COLLECTION) as MandateCollection;
  const activeQuery = query(
    mandatesRef,
    where("userId", "==", userId),
    where("status", "==", "active")
  );

  return await getQueryDoc(activeQuery, mandateSchema);
}

function mandateRef(mandateId: string) {
  return doc(db, MANDATES_COLLECTION, mandateId) as MandateDocument;
}

async function create(variables: CreateMandateVariables) {
  const { user, data } = variables;

  const validated = createMandateSchema.parse(data);
  const partners = await paymentPartner.$use.getActive();
  const split = buildSplitConfiguration(partners, validated.amount);
  const reference = generateMandateReference(user.id);
  const tier = determineTier(validated.amount);
  const mandateType: MandateType = "emandate";
  const debitType: MandateDebitType = "fixed";
  const startDate = formatDate(data.startDate, "yyyy-MM-dd");
  const endDate = formatDate(data.endDate, "yyyy-MM-dd");

  if (!user.monoCustomerId) {
    throw new Error(
      "You need to be registered as a customer to create a mandate."
    );
  }

  const mandateResponse = await mono.$use.mandate.initiate({
    amount: validated.amount,
    type: "recurring-debit",
    method: "mandate",
    mandate_type: mandateType,
    debit_type: debitType,
    description: `LAUMGA Foundation ${validated.frequency} contribution`,
    reference,
    customer: { id: user.monoCustomerId },
    start_date: startDate,
    end_date: endDate,
    split,
    meta: {
      userId: user.id,
      tier,
      frequency: validated.frequency,
    },
  });

  const mandatesRef = collection(db, MANDATES_COLLECTION) as MandateCollection;
  const docRef = doc(mandatesRef) as MandateDocument;

  const mandateData: CreateMandateData = {
    userId: user.id,
    amount: validated.amount / 100,
    frequency: validated.frequency,
    tier,
    status: "initiated",
    monoMandateId: mandateResponse.data.mandate_id,
    monoCustomerId: user.monoCustomerId,
    monoReference: mandateResponse.data.reference,
    monoUrl: mandateResponse.data.mono_url,
    mandateType,
    debitType,
    startDate: data.startDate,
    endDate: data.endDate,
    created: record(user),
    updated: record(user),
  };

  await setDoc(docRef, mandateData);

  const stored = await getDoc(docRef);
  const createdMandate = mandateSchema.parse({
    id: docRef.id,
    ...stored.data(),
  });

  await mandateCertificate.$use.create({
    mandate: createdMandate,
    user,
  });

  return mandateResponse.data;
}

async function syncStatus(variables: UpdateMandateVariables) {
  const { id, user } = variables;

  const ref = mandateRef(id);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) {
    throw new Error("Mandate not found");
  }

  const mandateData = mandateDataSchema.parse(snapshot.data());
  if (!mandateData.monoMandateId) {
    throw new Error("Mono mandate ID not found");
  }

  const result = await tryCatch(() => {
    return mono.$use.mandate.fetch(mandateData.monoMandateId!);
  });

  if (result.success === false) {
    throw new Error(
      `Failed to fetch mandate status from Mono: ${result.error}`
    );
  }

  const monoDetails = result.data;
  const status = mapMonoStatus(monoDetails.data.status);

  await updateDoc(ref, {
    status,
    updated: record(user),
  });
}

async function debit(variables: UpdateMandateVariables) {
  const { id } = variables;

  const ref = mandateRef(id);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) {
    throw new Error("Mandate not found");
  }

  const mandateData = mandateDataSchema.parse(snapshot.data());

  if (mandateData.status !== "active") {
    throw new Error("Mandate is not active");
  }

  const partners = await paymentPartner.$use.getActive();
  const split = buildSplitConfiguration(partners, mandateData.amount);
  const reference = generateDebitReference(id);

  await mono.$use.mandate.debit(mandateData.monoMandateId!, {
    amount: mandateData.amount,
    reference,
    narration: `LAUMGA Foundation ${mandateData.frequency} contribution`,
    split,
  });

  await updateDoc(ref, {
    status: "active",
    updated: record(variables.user),
  });
}

async function get(id: string) {
  const ref = mandateRef(id);
  return await getQueryDoc(ref, mandateSchema);
}

async function fetchByUserId(userId: string) {
  if (!userId) return null;

  const mandatesRef = collection(db, MANDATES_COLLECTION) as MandateCollection;
  const mandatesQuery = query(mandatesRef, where("userId", "==", userId));

  return await getQueryDoc(mandatesQuery, mandateSchema);
}

async function pause(variables: UpdateMandateVariables) {
  const { id, user } = variables;

  const ref = mandateRef(id);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) {
    throw new Error("Mandate not found");
  }

  const mandateData = mandateDataSchema.parse(snapshot.data());

  if (!mandateData.monoMandateId) {
    throw new Error("Mono mandate ID not found");
  }

  const result = await tryCatch(() => {
    return mono.$use.mandate.pause(mandateData.monoMandateId!);
  });

  if (result.success === false) {
    throw new Error(`Failed to pause mandate with Mono: ${result.error}`);
  }

  await updateDoc(ref, {
    status: "paused",
    updated: record(user),
  });

  return { success: true };
}

async function cancel(variables: UpdateMandateVariables) {
  const { id, user } = variables;

  const ref = mandateRef(id);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) {
    throw new Error("Mandate not found");
  }

  const mandateData = mandateDataSchema.parse(snapshot.data());

  if (!mandateData.monoMandateId) {
    throw new Error("Mono mandate ID not found");
  }

  const result = await tryCatch(() => {
    return mono.$use.mandate.cancel(mandateData.monoMandateId!);
  });

  if (result.success === false) {
    throw new Error(`Failed to cancel mandate with Mono: ${result.error}`);
  }

  await updateDoc(ref, {
    status: "cancelled",
    updated: record(user),
  });
}

async function reinstate(variables: UpdateMandateVariables) {
  const { id, user } = variables;

  const ref = mandateRef(id);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) {
    throw new Error("Mandate not found");
  }

  const mandateData = mandateDataSchema.parse(snapshot.data());

  if (!mandateData.monoMandateId) {
    throw new Error("Mono mandate ID not found");
  }

  const result = await tryCatch(() => {
    return mono.$use.mandate.reinstate(mandateData.monoMandateId!);
  });

  if (result.success === false) {
    throw new Error(`Failed to reinstate mandate with Mono: ${result.error}`);
  }

  await updateDoc(ref, {
    status: "active",
    updated: record(user),
  });
}

async function list(variables?: ListMandateVariables) {
  const mandatesRef = collection(db, MANDATES_COLLECTION) as MandateCollection;
  const mandatesQuery = buildQuery(mandatesRef, variables);
  return await getQueryDocs(mandatesQuery, mandateSchema);
}

export const mandate = createBuilder({
  create,
  get,
  debit,
  pause,
  cancel,
  reinstate,
  syncStatus,
  fetchByUserId,
  getActive,
  list,
});
