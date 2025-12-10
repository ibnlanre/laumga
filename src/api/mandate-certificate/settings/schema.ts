import { z } from "zod";

import { dateSchema, fieldValueSchema } from "@/schema/date";

export const MANDATE_CERTIFICATE_SETTINGS = "settings";

export const mandateCertificateSettingsFormSchema = z.object({
  chairmanName: z.string().nullable().default(null),
  signatureUrl: z.url().nullable().default(null),
});

export const mandateCertificateSettingsSchema =
  mandateCertificateSettingsFormSchema.extend({
    updated: dateSchema,
  });

export const createMandateCertificateSettingsSchema =
  mandateCertificateSettingsSchema.extend({
    updated: fieldValueSchema,
  });

export const updateMandateCertificateSettingsSchema =
  mandateCertificateSettingsSchema.partial();
