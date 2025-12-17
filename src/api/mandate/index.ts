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
import { buildQuery, getQueryDoc, getQueryDocs } from "@/client/core-query";
import { mandateCertificate } from "@/api/mandate-certificate";

import {
  MANDATES_COLLECTION,
  createMandateSchema,
  mandateSchema,
} from "./schema";
import type {
  CreateMandateData,
  CreateMandateVariables,
  UpdateMandateVariables,
  MandateCollection,
  MandateDocument,
  ListMandateVariables,
} from "./types";
import { determineTier, mapFlutterwaveStatus } from "./utils";

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
  const { user, data, tokenResponse } = variables;

  if (!tokenResponse) {
    throw new Error("Token response is required to create mandate");
  }

  const validated = createMandateSchema.parse(data);
  const mandatesRef = collection(db, MANDATES_COLLECTION) as MandateCollection;
  const docRef = doc(mandatesRef) as MandateDocument;

  const mandateData: CreateMandateData = {
    userId: user.id,
    amount: validated.amount,
    frequency: validated.frequency,
    tier: determineTier(validated.amount),
    status: mapFlutterwaveStatus(tokenResponse.data.status),
    startDate: validated.startDate,
    endDate: validated.endDate,
    flutterwaveReference: tokenResponse.data.reference,
    flutterwaveAccountId: tokenResponse.data.account_id,
    flutterwaveCustomerId: tokenResponse.data.customer_id,
    flutterwaveStatus: tokenResponse.data.status,
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

  return {
    reference: tokenResponse.data.reference,
    status: tokenResponse.data.status,
    processor_response: tokenResponse.data.processor_response,
    mandate_consent: tokenResponse.data.mandate_consent ?? null,
  };
}

async function syncStatus(variables: UpdateMandateVariables) {
  const { id, user, tokenDetails } = variables;

  const ref = mandateRef(id);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) {
    throw new Error("Mandate not found");
  }

  if (!tokenDetails) {
    throw new Error("Token details are required to sync status");
  }

  await updateDoc(ref, {
    status: mapFlutterwaveStatus(tokenDetails.status),
    flutterwaveStatus: tokenDetails.status,
    updated: record(user),
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

  await updateDoc(ref, {
    status: "paused",
    flutterwaveStatus: "SUSPENDED",
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

  await updateDoc(ref, {
    status: "cancelled",
    flutterwaveStatus: "DELETED",
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

  await updateDoc(ref, {
    status: "active",
    flutterwaveStatus: "ACTIVE",
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
  pause,
  cancel,
  reinstate,
  syncStatus,
  fetchByUserId,
  getActive,
  list,
});
