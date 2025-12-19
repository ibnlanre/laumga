import { createBuilder } from "@ibnlanre/builder";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/services/firebase";
import { record } from "@/utils/record";
import { buildQuery, getQueryDoc, getQueryDocs } from "@/client/core-query";

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
import { flutterwave } from "../flutterwave";

function isStale(createdAt: Date) {
  return isAfter(new Date(), addMinutes(createdAt, 10));
}

function mandateRef(mandateId: string) {
  return doc(db, MANDATES_COLLECTION, mandateId) as MandateDocument;
}

async function create(variables: CreateMandateVariables) {
  const { user, data } = variables;

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
    flutterwaveAccountToken: null,
    flutterwaveMandateConsent: tokenResponse.data.mandate_consent,
    flutterwaveProcessorResponse: tokenResponse.data.processor_response,
    flutterwaveEffectiveDate: null,
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

  const account = await flutterwave.$use.account.status({
    data: mandate.flutterwaveReference!,
  });

  if (account.data.status === "PENDING") {
    if (isStale(new Date(account.data.created_at))) {
      await deleteDoc(ref);
      return null;
    }
  }

  if (account.data.status !== mandate.flutterwaveStatus) {
    mandate.flutterwaveStatus = account.data.status;
    mandate.flutterwaveProcessorResponse = account.data.processor_response;
    mandate.flutterwaveAccountToken = account.data.token;
    mandate.flutterwaveEffectiveDate = account.data.active_on;

    await updateDoc(ref, mandate);
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

  const mandate = snapshot.data();
  if (!mandate.flutterwaveReference) {
    throw new Error("Mandate has no Flutterwave reference");
  }

  const response = await flutterwave.$use.account.update({
    data: {
      reference: mandate.flutterwaveReference,
      payload: { status: "SUSPENDED" },
    },
  });

  await updateDoc(ref, {
    flutterwaveStatus: response.data.status,
    flutterwaveProcessorResponse: response.data.processor_response,
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

  const mandate = snapshot.data();
  if (!mandate.flutterwaveReference) {
    throw new Error("Mandate has no Flutterwave reference");
  }

  await flutterwave.$use.account.update({
    data: {
      reference: mandate.flutterwaveReference,
      payload: { status: "DELETED" },
    },
  });

  await deleteDoc(ref);
}

async function reinstate(variables: UpdateMandateVariables) {
  const { user } = variables;

  const ref = mandateRef(user.id);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) {
    throw new Error("Mandate not found");
  }

  const mandate = snapshot.data();
  if (!mandate.flutterwaveReference) {
    throw new Error("Mandate has no Flutterwave reference");
  }

  const response = await flutterwave.$use.account.update({
    data: {
      reference: mandate.flutterwaveReference,
      payload: { status: "ACTIVE" },
    },
  });

  await updateDoc(ref, {
    flutterwaveStatus: response.data.status,
    flutterwaveProcessorResponse: response.data.processor_response,
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
