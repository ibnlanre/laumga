import { getQueryDoc } from "@/client/core-query";
import { db } from "@/services/firebase";
import { doc, setDoc } from "firebase/firestore";
import { MANDATE_CERTIFICATE_COLLECTION } from "../schema";
import {
  createMandateCertificateSettingsSchema,
  MANDATE_CERTIFICATE_SETTINGS,
  mandateCertificateSettingsSchema,
  updateMandateCertificateSettingsSchema,
} from "./schema";
import type {
  CreateMandateCertificateSettingsData,
  CreateMandateCertificateSettingsVariables,
  MandateCertificateSettingsDocument,
  UpdateMandateCertificateSettingsVariables,
} from "./types";
import { createBuilder } from "@ibnlanre/builder";
import { record } from "@/utils/record";

async function create(variables: CreateMandateCertificateSettingsVariables) {
  const { user, data } = variables;

  const payload = createMandateCertificateSettingsSchema.parse(data);

  const settingsRef = doc(
    db,
    MANDATE_CERTIFICATE_COLLECTION,
    MANDATE_CERTIFICATE_SETTINGS
  ) as MandateCertificateSettingsDocument;

  const newData = {
    ...payload,
    created: record(user),
  };

  await setDoc(settingsRef, newData);
}

async function get() {
  const settingsRef = doc(
    db,
    MANDATE_CERTIFICATE_COLLECTION,
    MANDATE_CERTIFICATE_SETTINGS
  ) as MandateCertificateSettingsDocument;

  return await getQueryDoc(settingsRef, mandateCertificateSettingsSchema);
}

async function update(variables: UpdateMandateCertificateSettingsVariables) {
  const { user, data } = variables;

  const payload = updateMandateCertificateSettingsSchema.parse(data);

  const settingsRef = doc(
    db,
    MANDATE_CERTIFICATE_COLLECTION,
    MANDATE_CERTIFICATE_SETTINGS
  ) as MandateCertificateSettingsDocument;

  const updatedData = {
    ...payload,
    updated: record(user),
  };

  await setDoc(settingsRef, updatedData, { merge: true });
}

export const mandateCertificateSettings = createBuilder(
  {
    get,
    update,
    create,
  },
  { prefix: [MANDATE_CERTIFICATE_SETTINGS] }
);
