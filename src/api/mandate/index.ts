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
import { flutterwave } from "@/api/flutterwave";
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
} from "./types";
import { determineTier, mapFlutterwaveStatus } from "./utils";
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
  const mandatesRef = collection(db, MANDATES_COLLECTION) as MandateCollection;
  const docRef = doc(mandatesRef) as MandateDocument;

  if (!validated.bankCode) {
    throw new Error("Select a supported bank to continue.");
  }

  if (!validated.accountNumber) {
    throw new Error("Provide the account number you want debited.");
  }

  if (!user.address || !user.phoneNumber) {
    throw new Error(
      "Add your phone number and address on your profile before creating a mandate."
    );
  }

  const tokenResponse = await flutterwave.$use.account.tokenize({
    email: user.email,
    amount: validated.amount,
    address: user.address,
    phone_number: user.phoneNumber,
    account_bank: validated.bankCode,
    account_number: validated.accountNumber,
    start_date: validated.startDate,
    end_date: validated.endDate,
    narration: `LAUMGA Foundation ${validated.frequency} contribution`,
  });

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
    mandate_consent: tokenResponse.data.mandate_consent,
  };
}

async function syncStatus(variables: UpdateMandateVariables) {
  const { id, user } = variables;

  const ref = mandateRef(id);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) {
    throw new Error("Mandate not found");
  }

  const mandateData = mandateDataSchema.parse(snapshot.data());

  if (!mandateData.flutterwaveReference) {
    throw new Error("Flutterwave mandate reference not found");
  }

  const result = await tryCatch(() => {
    return flutterwave.$use.account.status(mandateData.flutterwaveReference!);
  });

  if (result.success === false) {
    throw new Error(
      `Failed to fetch mandate status from Flutterwave: ${result.error}`
    );
  }

  const tokenDetails = result.data.data;
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

  const mandateData = mandateDataSchema.parse(snapshot.data());

  if (!mandateData.flutterwaveReference) {
    throw new Error("Flutterwave mandate reference not found");
  }

  const result = await tryCatch(() => {
    return flutterwave.$use.account.update(mandateData.flutterwaveReference!, {
      status: "SUSPENDED",
    });
  });

  if (result.success === false) {
    throw new Error(
      `Failed to pause mandate with Flutterwave: ${result.error}`
    );
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

  const mandateData = mandateDataSchema.parse(snapshot.data());

  if (!mandateData.flutterwaveReference) {
    throw new Error("Flutterwave mandate reference not found");
  }

  const result = await tryCatch(() => {
    return flutterwave.$use.account.update(mandateData.flutterwaveReference!, {
      status: "DELETED",
    });
  });

  if (result.success === false) {
    throw new Error(
      `Failed to cancel mandate with Flutterwave: ${result.error}`
    );
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

  const mandateData = mandateDataSchema.parse(snapshot.data());

  if (!mandateData.flutterwaveReference) {
    throw new Error("Flutterwave mandate reference not found");
  }

  const result = await tryCatch(() => {
    return flutterwave.$use.account.update(mandateData.flutterwaveReference!, {
      status: "ACTIVE",
    });
  });

  if (result.success === false) {
    throw new Error(
      `Failed to reinstate mandate with Flutterwave: ${result.error}`
    );
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
