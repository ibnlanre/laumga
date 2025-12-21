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
    // Recursively call get (which is a server function)
    // Since we are in a server function, we can call the handler logic directly if we extracted it,
    // or call the server function which might do an HTTP request to itself (inefficient but works).
    // Or better, just use the logic directly here.
    const certificatesRef = serverCollection<MandateCertificateData>(
      MANDATE_CERTIFICATES_COLLECTION
    ).doc(activeMandate.id); // Mandate ID is User ID usually?
    // In create, we use user.id as doc ID.
    // In mandate, doc ID is user.id.
    // So activeMandate.id is user.id.
    // So we can just fetch it.
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
