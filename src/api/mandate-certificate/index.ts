import { createBuilder } from "@ibnlanre/builder";
import { deleteDoc, doc, setDoc, updateDoc } from "firebase/firestore";

import { db } from "@/services/firebase";
import { record } from "@/utils/record";
import { getQueryDoc } from "@/client/core-query";

import {
  createMandateCertificateDataSchema,
  MANDATE_CERTIFICATES_COLLECTION,
  mandateCertificateSchema,
  updateMandateCertificateDataSchema,
} from "./schema";
import type {
  MandateCertificateDocument,
  CreateMandateCertificateVariables,
  UpdateMandateCertificateVariables,
} from "./types";
import { mandateCertificateSettings } from "./settings";

async function create(variables: CreateMandateCertificateVariables) {
  const { mandate, user } = variables;

  const certificateData = createMandateCertificateDataSchema.parse({
    userName: user.fullName,
    amount: mandate.amount,
    frequency: mandate.frequency,
    tier: mandate.tier,
    startDate: mandate.startDate,
    created: record(user),
  });

  const settings = await mandateCertificateSettings.$use.get();

  if (settings) {
    certificateData.chairmanName = settings.chairmanName;
    certificateData.signatureUrl = settings.signatureUrl;
  }

  const ref = doc(
    db,
    MANDATE_CERTIFICATES_COLLECTION,
    mandate.id
  ) as MandateCertificateDocument;

  await setDoc(ref, certificateData);
}

async function update(variables: UpdateMandateCertificateVariables) {
  const { id, data } = variables;

  const validated = updateMandateCertificateDataSchema.parse(data);

  const certificateRef = doc(
    db,
    MANDATE_CERTIFICATES_COLLECTION,
    id
  ) as MandateCertificateDocument;

  await updateDoc(certificateRef, validated);
}

async function get(id: string) {
  const certificatesRef = doc(
    db,
    MANDATE_CERTIFICATES_COLLECTION,
    id
  ) as MandateCertificateDocument;

  return await getQueryDoc(certificatesRef, mandateCertificateSchema);
}

async function remove(id: string) {
  const certificateRef = doc(
    db,
    MANDATE_CERTIFICATES_COLLECTION,
    id
  ) as MandateCertificateDocument;

  await deleteDoc(certificateRef);
}

export const mandateCertificate = createBuilder({
  get,
  create,
  update,
});
