import { z } from "zod";

import { dateSchema, fieldValueSchema } from "@/schema/date";
import {
  mandateFrequencySchema,
  mandateTierSchema,
} from "@/api/mandate/schema";
import { mandateCertificateSettingsFormSchema } from "./settings/schema";

export const MANDATE_CERTIFICATE_COLLECTION = "mandateCertificate";
export const MANDATE_CERTIFICATES_COLLECTION = "mandateCertificates";

export const mandateCertificateFormSchema =
  mandateCertificateSettingsFormSchema.extend({
    userName: z.string(),
    amount: z.number(),
    frequency: mandateFrequencySchema,
    tier: mandateTierSchema,
  });

export const mandateCertificateDataSchema = mandateCertificateFormSchema.extend(
  {
    created: dateSchema,
  }
);

export const createMandateCertificateDataSchema =
  mandateCertificateDataSchema.extend({
    created: fieldValueSchema,
  });

export const updateMandateCertificateDataSchema =
  createMandateCertificateDataSchema.partial();

export const mandateCertificateSchema = mandateCertificateDataSchema.extend({
  id: z.string(),
});
