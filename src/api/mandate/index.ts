import { createBuilder } from "@ibnlanre/builder";
import {
  collection,
  deleteDoc,
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
import { determineTier } from "./utils";
import { addMinutes, isAfter } from "date-fns";
import type { User } from "../user/types";
import type { FlutterwaveStatus } from "../flutterwave/types";

function isStale(createdAt: Date) {
  return isAfter(new Date(), addMinutes(createdAt, 10));
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
  const docRef = mandateRef(user.id);

  const mandateData: CreateMandateData = {
    userId: user.id,
    amount: validated.amount,
    frequency: validated.frequency,
    tier: determineTier(validated.amount),
    startDate: validated.startDate,
    endDate: validated.endDate,
    flutterwaveReference: tokenResponse.data.reference,
    flutterwaveAccountId: tokenResponse.data.account_id,
    flutterwaveCustomerId: tokenResponse.data.customer_id,
    flutterwaveStatus: tokenResponse.data.status,
    flutterwaveMandateConsent: tokenResponse.data.mandate_consent,
    flutterwaveProcessorResponse: tokenResponse.data.processor_response,
    created: record(user),
    updated: record(user),
  };

  await setDoc(docRef, mandateData);
}

async function update(variables: UpdateMandateVariables) {
  const { user, data } = variables;

  const ref = mandateRef(user.id);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) {
    throw new Error("Mandate not found");
  }

  await updateDoc(ref, { ...data, updated: record(user) });
}

async function get(id: string) {
  const ref = mandateRef(id);
  const mandate = await getQueryDoc(ref, mandateSchema);

  if (!mandate) return null;

  if (mandate.flutterwaveStatus !== "PENDING") return mandate;
  if (mandate.created && isStale(mandate.created.at)) {
    await deleteDoc(ref);
    return null;
  }

  return mandate;
}

async function pause(variables: UpdateMandateVariables) {
  const { user } = variables;

  const ref = mandateRef(user.id);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) {
    throw new Error("Mandate not found");
  }

  await updateDoc(ref, {
    flutterwaveStatus: "SUSPENDED",
    updated: record(user),
  });
}

async function cancel(variables: UpdateMandateVariables) {
  const { user } = variables;

  const ref = mandateRef(user.id);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) {
    throw new Error("Mandate not found");
  }

  await deleteDoc(ref);
}

async function reinstate(variables: UpdateMandateVariables) {
  const { user } = variables;

  const ref = mandateRef(user.id);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) {
    throw new Error("Mandate not found");
  }

  await updateDoc(ref, {
    flutterwaveStatus: "ACTIVE",
    updated: record(user),
  });
}

async function list(variables?: ListMandateVariables) {
  const mandatesRef = collection(db, MANDATES_COLLECTION) as MandateCollection;
  const mandatesQuery = buildQuery(mandatesRef, variables);
  return await getQueryDocs(mandatesQuery, mandateSchema);
}

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
