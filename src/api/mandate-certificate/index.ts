import { createBuilder } from "@ibnlanre/builder";
import {
  collection,
  doc,
  query,
  setDoc,
  where,
  limit,
} from "firebase/firestore";

import { db } from "@/services/firebase";
import { record } from "@/utils/record";
import { getQueryDocs } from "@/client/core-query";

import {
  createMandateCertificateDataSchema,
  MANDATE_CERTIFICATES_COLLECTION,
  mandateCertificateSchema,
} from "./schema";
import type {
  MandateCertificatesCollection,
  MandateCertificateDocument,
  IssueMandateCertificateVariables,
} from "./types";
import { mandateCertificateSettings } from "./settings";

async function get(userId: string) {
  if (!userId) return null;

  const certificatesRef = collection(
    db,
    MANDATE_CERTIFICATES_COLLECTION
  ) as MandateCertificatesCollection;

  const certificatesQuery = query(
    certificatesRef,
    where("userId", "==", userId),
    limit(1)
  );

  const results = await getQueryDocs(
    certificatesQuery,
    mandateCertificateSchema
  );
  return results[0] ?? null;
}

async function create(variables: IssueMandateCertificateVariables) {
  const { mandate, user } = variables;

  const certificateData = createMandateCertificateDataSchema.parse({
    mandateId: mandate.id,
    userId: user.id,
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

export const mandateCertificate = createBuilder({
  get,
  create,
});
