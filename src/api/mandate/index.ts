import { createBuilder } from "@ibnlanre/builder";
import {
  addDoc,
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
import { getQueryDoc, getQueryDocs } from "@/client/core-query";
import { paymentPartner } from "@/api/payment-partner";
import { mono } from "@/api/mono";
import { mandateCertificate } from "@/api/mandate-certificate";

import {
  MANDATES_COLLECTION,
  createMandateSchema,
  mandateRecordSchema,
  mandateSchema,
} from "./schema";
import type {
  CreateMandateData,
  CreateMandateVariables,
  UpdateMandateVariables,
  MandateCollection,
  MandateDocument,
} from "./types";
import {
  buildSplitConfiguration,
  calculateEndDate,
  computeNextChargeDate,
  determineTier,
  generateDebitReference,
  generateMandateReference,
  mapMonoStatus,
} from "./utils";
import type { MonoCustomerInput } from "@/api/mono/types";
import { MANDATE_TRANSACTIONS_COLLECTION } from "../mandate-transaction/schema";
import type {
  MandateTransactionCollection,
  CreateMandateTransactionData,
} from "../mandate-transaction/types";

async function getActive(userId: string) {
  if (!userId) return null;

  const mandatesRef = collection(db, MANDATES_COLLECTION) as MandateCollection;
  const activeQuery = query(
    mandatesRef,
    where("userId", "==", userId),
    where("status", "==", "active")
  );

  const results = await getQueryDocs(activeQuery, mandateSchema);
  return results[0] ?? null;
}

function mandateRef(mandateId: string) {
  return doc(db, MANDATES_COLLECTION, mandateId) as MandateDocument;
}

async function create(variables: CreateMandateVariables) {
  const { user, data } = variables;

  const payload = createMandateSchema.parse(data);
  const partners = await paymentPartner.$use.getActive();
  const split = buildSplitConfiguration(partners, payload.amount);
  const reference = generateMandateReference(user.id);
  const startDate = new Date();
  const endDate = calculateEndDate(startDate, payload.duration);
  const nextChargeDate = computeNextChargeDate(startDate, payload.frequency);
  const tier = determineTier(payload.amount);

  const monoCustomerPayload: MonoCustomerInput = {
    email: user.email,
    type: "individual",
    first_name: user.firstName,
    last_name: user.lastName,
    address: user.address,
    phone: user.phoneNumber,
    identity: {
      type: "bvn",
      number: payload.bvn,
    },
  };

  const customerResponse = await mono.$use.customer.create(monoCustomerPayload);
  const monoCustomerId = customerResponse.data.id;

  const mandateResponse = await mono.$use.mandate.initiate({
    amount: payload.amount,
    type: "recurring-debit",
    method: "mandate",
    mandate_type: "emandate",
    debit_type: payload.frequency === "one-time" ? "variable" : "variable",
    description: `LAUMGA Foundation ${payload.frequency} contribution`,
    reference,
    customer: { id: monoCustomerId },
    start_date: formatDate(startDate, "yyyy-MM-dd"),
    end_date: formatDate(endDate, "yyyy-MM-dd"),
    split,
    meta: {
      userId: user.id,
      tier,
    },
  });

  const mandatesRef = collection(db, MANDATES_COLLECTION) as MandateCollection;
  const docRef = doc(mandatesRef) as MandateDocument;

  const mandateData: CreateMandateData = {
    userId: user.id,
    amount: payload.amount,
    frequency: payload.frequency,
    duration: payload.duration,
    tier,
    status: "initiated",
    monoMandateId: mandateResponse.data.mandate_id,
    monoCustomerId,
    monoReference: mandateResponse.data.reference,
    monoUrl: mandateResponse.data.mono_url,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    nextChargeDate: nextChargeDate.toISOString(),
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

  return createdMandate;
}

async function syncStatus(variables: UpdateMandateVariables) {
  const { id, user } = variables;

  const ref = mandateRef(id);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) {
    throw new Error("Mandate not found");
  }

  const mandateData = mandateRecordSchema.parse(snapshot.data());
  if (!mandateData.monoMandateId) {
    throw new Error("Mono mandate ID not found");
  }

  const monoDetails = await mono.$use.mandate.fetch(mandateData.monoMandateId);
  const status = mapMonoStatus(monoDetails.data.status);

  await updateDoc(ref, {
    status,
    updated: record(user),
  });
}

async function debit(variables: UpdateMandateVariables) {
  const { id, user } = variables;

  const ref = mandateRef(id);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) {
    throw new Error("Mandate not found");
  }

  const mandateData = mandateRecordSchema.parse(snapshot.data());

  if (mandateData.status !== "active") {
    throw new Error("Mandate is not active");
  }

  const partners = await paymentPartner.$use.getActive();
  const split = buildSplitConfiguration(partners, mandateData.amount);
  const reference = generateDebitReference(id);

  const debitResponse = await mono.$use.mandate.debit(mandateData.monoMandateId!, {
    amount: mandateData.amount,
    reference,
    narration: `LAUMGA Foundation ${mandateData.frequency} contribution`,
    split,
  });

  const transactionsRef = collection(
    db,
    MANDATE_TRANSACTIONS_COLLECTION
  ) as MandateTransactionCollection;

  const transactionData: CreateMandateTransactionData = {
    mandateId: id,
    userId: mandateData.userId,
    amount: mandateData.amount,
    monoReference: reference,
    monoDebitId: debitResponse.data.reference_number,
    status: debitResponse.data.status,
    failureReason: null,
    paidAt: debitResponse.data.date,
    created: record(user),
  };

  const transactionDoc = await addDoc(transactionsRef, transactionData);

  if (debitResponse.data.status === "successful") {
    const newNextChargeDate = computeNextChargeDate(
      new Date(),
      mandateData.frequency
    );

    await updateDoc(ref, {
      nextChargeDate: newNextChargeDate.toISOString(),
      updated: record(user),
    });
  }

  return {
    transactionId: transactionDoc.id,
    status: debitResponse.data.status,
    reference,
  };
}

async function get(id: string) {
  const ref = mandateRef(id);
  return await getQueryDoc(ref, mandateSchema);
}

async function fetchByUserId(userId: string) {
  if (!userId) return [];

  const mandatesRef = collection(db, MANDATES_COLLECTION) as MandateCollection;
  const mandatesQuery = query(mandatesRef, where("userId", "==", userId));

  return await getQueryDocs(mandatesQuery, mandateSchema);
}

async function pause(variables: UpdateMandateVariables) {
  const { id, user } = variables;
  const ref = mandateRef(id);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) {
    throw new Error("Mandate not found");
  }

  const mandateData = mandateRecordSchema.parse(snapshot.data());

  if (mandateData.monoMandateId) {
    await mono.$use.mandate.pause(mandateData.monoMandateId);
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

  const mandateData = mandateRecordSchema.parse(snapshot.data());

  if (mandateData.monoMandateId) {
    await mono.$use.mandate.cancel(mandateData.monoMandateId);
  }

  await updateDoc(ref, {
    status: "cancelled",
    updated: record(user),
  });

  return { success: true };
}

async function reinstate(variables: UpdateMandateVariables) {
  const { id, user } = variables;
  const ref = mandateRef(id);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) {
    throw new Error("Mandate not found");
  }

  const mandateData = mandateRecordSchema.parse(snapshot.data());

  if (mandateData.monoMandateId) {
    await mono.$use.mandate.reinstate(mandateData.monoMandateId);
  }

  await updateDoc(ref, {
    status: "active",
    updated: record(user),
  });

  return { success: true };
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
});
