import { z } from "zod";

import { dateSchema, fieldValueSchema } from "@/schema/date";
import {
  mandateFrequencySchema,
  mandateTierSchema,
} from "@/api/mandate/schema";

export const MANDATE_CERTIFICATE_COLLECTION = "mandateCertificate";
export const MANDATE_CERTIFICATE_SETTINGS_DOC = "settings";
export const MANDATE_CERTIFICATES_COLLECTION = "mandateCertificates";

export const mandateCertificateSettingsSchema = z.object({
  chairmanName: z.string().nullable().default(null),
  signatureUrl: z.url().nullable().default(null),
  updated: dateSchema,
});

export const createMandateCertificateSettingsSchema =
  mandateCertificateSettingsSchema.extend({
    updated: fieldValueSchema,
  });

export const updateMandateCertificateSettingsSchema =
  mandateCertificateSettingsSchema.partial();

export const mandateCertificateDataSchema = mandateCertificateSettingsSchema.extend({
  mandateId: z.string(),
  userId: z.string(),
  userName: z.string(),
  amount: z.number(),
  frequency: mandateFrequencySchema,
  tier: mandateTierSchema,
  startDate: z.string(),
  created: dateSchema,
});

export const createMandateCertificateDataSchema =
  mandateCertificateDataSchema.extend({
    created: fieldValueSchema,
  });

export const mandateCertificateSchema = mandateCertificateDataSchema.extend({
  id: z.string(),
});
