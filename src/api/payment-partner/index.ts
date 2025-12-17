import { createBuilder } from "@ibnlanre/builder";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "@/services/firebase";

import {
  PAYMENT_PARTNERS_COLLECTION,
  paymentPartnerFormSchema,
  paymentPartnerSchema,
  updatePaymentPartnerSchema,
} from "./schema";
import type {
  CreatePaymentPartnerVariables,
  UpstreamPaymentPartnerDocument,
  DownstreamPaymentPartnerCollection,
  DownstreamPaymentPartnerDocument,
  UpdatePaymentPartnerVariables,
  UpdatePaymentPartnerData,
  CreatePaymentPartnerData,
} from "./types";
import { record } from "@/utils/record";
import { getQueryDocs } from "@/client/core-query";

async function create(variables: CreatePaymentPartnerVariables) {
  const { data, user } = variables;
  const validated = paymentPartnerFormSchema.parse(data);

  const partnerRef = doc(
    collection(db, PAYMENT_PARTNERS_COLLECTION)
  ) as UpstreamPaymentPartnerDocument;

  const payload: CreatePaymentPartnerData = {
    ...validated,
    created: record(user),
    updated: record(user),
  };

  await setDoc(partnerRef, payload);
}

async function update(variables: UpdatePaymentPartnerVariables) {
  const { id, user, data } = variables;

  const partnerRef = doc(
    db,
    PAYMENT_PARTNERS_COLLECTION,
    id
  ) as UpstreamPaymentPartnerDocument;

  const snapshot = await getDoc(partnerRef);
  if (!snapshot.exists()) {
    throw new Error("Payment partner not found");
  }

  const validated = updatePaymentPartnerSchema.parse(data);
  const updatePayload: UpdatePaymentPartnerData = {
    ...validated,
    updated: record(user),
  };

  await updateDoc(partnerRef, updatePayload);
}

async function list() {
  const partnersRef = collection(
    db,
    PAYMENT_PARTNERS_COLLECTION
  ) as DownstreamPaymentPartnerCollection;

  const snapshot = await getDocs(partnersRef);
  const partners = snapshot.docs.map((docSnapshot) => ({
    id: docSnapshot.id,
    ...docSnapshot.data(),
  }));

  return paymentPartnerSchema.array().parse(partners);
}

async function get(partnerId: string) {
  if (!partnerId) return null;

  const partnerRef = doc(
    db,
    PAYMENT_PARTNERS_COLLECTION,
    partnerId
  ) as DownstreamPaymentPartnerDocument;

  const snapshot = await getDoc(partnerRef);
  if (!snapshot.exists()) return null;

  return paymentPartnerSchema.parse({ id: snapshot.id, ...snapshot.data() });
}

async function getActive() {
  const partnersRef = collection(
    db,
    PAYMENT_PARTNERS_COLLECTION
  ) as DownstreamPaymentPartnerCollection;

  const activeQuery = query(partnersRef, where("isActive", "==", true));
  return await getQueryDocs(activeQuery, paymentPartnerSchema);
}

export const paymentPartner = createBuilder({
  create,
  update,
  list,
  get,
  getActive,
});
