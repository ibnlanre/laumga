import { getQueryDoc } from "@/client/core-query";
import { db } from "@/services/firebase";
import { doc, setDoc } from "firebase/firestore";
import {
  MANDATE_CERTIFICATE_COLLECTION,
  MANDATE_CERTIFICATE_SETTINGS_DOC,
  mandateCertificateSettingsSchema,
  updateMandateCertificateSettingsSchema,
} from "./schema";
import type {
  MandateCertificateSettingsDocument,
  UpdateMandateCertificateSettingsVariables,
} from "./types";
import { createBuilder } from "@ibnlanre/builder";
import { record } from "@/utils/record";

async function get() {
  const settingsRef = doc(
    db,
    MANDATE_CERTIFICATE_COLLECTION,
    MANDATE_CERTIFICATE_SETTINGS_DOC
  ) as MandateCertificateSettingsDocument;

  return await getQueryDoc(settingsRef, mandateCertificateSettingsSchema);
}

async function update(variables: UpdateMandateCertificateSettingsVariables) {
  const { user, data } = variables;
  const payload = updateMandateCertificateSettingsSchema.parse(data);

  const settingsRef = doc(
    db,
    MANDATE_CERTIFICATE_COLLECTION,
    MANDATE_CERTIFICATE_SETTINGS_DOC
  ) as MandateCertificateSettingsDocument;

  const updatedData = {
    ...payload,
    updated: record(user),
  };

  await setDoc(settingsRef, updatedData, { merge: true });
}

export const mandateCertificateSettings = createBuilder({
  get,
  update,
});
