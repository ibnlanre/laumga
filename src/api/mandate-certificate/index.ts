import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createBuilder } from "@ibnlanre/builder";

import { serverRecord } from "@/utils/server-record";
import {
  getServerQueryDoc,
  serverCollection,
} from "@/client/core-query/server";

import {
  createMandateCertificateDataSchema,
  MANDATE_CERTIFICATES_COLLECTION,
  mandateCertificateSchema,
  updateMandateCertificateDataSchema,
} from "./schema";
import type { MandateCertificateData } from "./types";
import { mandateCertificateSettings } from "./settings";
import { mandate } from "../mandate";
import { userSchema } from "../user/schema";
import { mandateSchema } from "../mandate/schema";

const create = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      mandate: mandateSchema,
      user: userSchema,
    })
  )
  .handler(async ({ data: { mandate, user } }) => {
    const certificateData = createMandateCertificateDataSchema.parse({
      userName: user.fullName,
      amount: mandate.amount,
      frequency: mandate.frequency,
      tier: mandate.tier,
      created: serverRecord(user),
    });

    const settings = await mandateCertificateSettings.$use.get();

    if (settings) {
      certificateData.chairmanName = settings.chairmanName;
      certificateData.signatureUrl = settings.signatureUrl;
    }

    const ref = serverCollection<MandateCertificateData>(
      MANDATE_CERTIFICATES_COLLECTION
    ).doc(user.id);

    await ref.set(certificateData);
  });

const update = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      id: z.string(),
      data: updateMandateCertificateDataSchema,
    })
  )
  .handler(async ({ data: { id, data } }) => {
    const certificateRef = serverCollection<MandateCertificateData>(
      MANDATE_CERTIFICATES_COLLECTION
    ).doc(id);

    await certificateRef.update(data);
  });

const get = createServerFn({ method: "GET" })
  .inputValidator(z.string())
  .handler(async ({ data: id }) => {
    const certificatesRef = serverCollection<MandateCertificateData>(
      MANDATE_CERTIFICATES_COLLECTION
    ).doc(id);

    return await getServerQueryDoc(certificatesRef, mandateCertificateSchema);
  });

const remove = createServerFn({ method: "POST" })
  .inputValidator(z.string())
  .handler(async ({ data: id }) => {
    const certificateRef = serverCollection<MandateCertificateData>(
      MANDATE_CERTIFICATES_COLLECTION
    ).doc(id);

    await certificateRef.delete();
  });

const getActive = createServerFn({ method: "GET" })
  .inputValidator(z.string())
  .handler(async ({ data: userId }) => {
    const activeMandate = await mandate.$use.get({ data: userId });
    if (!activeMandate) return null;
    
    const certificatesRef = serverCollection<MandateCertificateData>(
      MANDATE_CERTIFICATES_COLLECTION
    ).doc(activeMandate.id);

    return await getServerQueryDoc(certificatesRef, mandateCertificateSchema);
  });

export const mandateCertificate = createBuilder(
  {
    get,
    create,
    update,
    remove,
    getActive,
  },
  { prefix: [MANDATE_CERTIFICATES_COLLECTION] }
);
