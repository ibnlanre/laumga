import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createBuilder } from "@ibnlanre/builder";

import { serverRecord } from "@/utils/server-record";
import {
  getServerQueryDoc,
  serverCollection,
} from "@/client/core-query/server";

import { MANDATE_CERTIFICATE_COLLECTION } from "../schema";
import {
  createMandateCertificateSettingsSchema,
  MANDATE_CERTIFICATE_SETTINGS,
  mandateCertificateSettingsSchema,
  updateMandateCertificateSettingsSchema,
} from "./schema";
import type {
  CreateMandateCertificateSettingsData,
  MandateCertificateSettings,
  UpdateMandateCertificateSettingsInput,
} from "./types";
import { userSchema } from "@/api/user/schema";

const create = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      user: userSchema,
      data: createMandateCertificateSettingsSchema,
    })
  )
  .handler(async ({ data: { user, data } }) => {
    const settingsRef = serverCollection<CreateMandateCertificateSettingsData>(
      MANDATE_CERTIFICATE_COLLECTION
    ).doc(MANDATE_CERTIFICATE_SETTINGS);

    await settingsRef.set(data);
  });

const get = createServerFn({ method: "GET" }).handler(async () => {
  const settingsRef = serverCollection<MandateCertificateSettings>(
    MANDATE_CERTIFICATE_COLLECTION
  ).doc(MANDATE_CERTIFICATE_SETTINGS);

  return await getServerQueryDoc(settingsRef, mandateCertificateSettingsSchema);
});

const update = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      user: userSchema,
      data: updateMandateCertificateSettingsSchema,
    })
  )
  .handler(async ({ data: { user, data } }) => {
    const settingsRef = serverCollection<UpdateMandateCertificateSettingsInput>(
      MANDATE_CERTIFICATE_COLLECTION
    ).doc(MANDATE_CERTIFICATE_SETTINGS);

    await settingsRef.set(
      {
        ...data,
        updated: serverRecord(user),
      },
      { merge: true }
    );
  });

export const mandateCertificateSettings = createBuilder(
  {
    get,
    update,
    create,
  },
  { prefix: [MANDATE_CERTIFICATE_SETTINGS] }
);
