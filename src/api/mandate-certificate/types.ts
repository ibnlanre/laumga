import type {
  CollectionReference,
  DocumentReference,
} from "firebase/firestore";
import type { z } from "zod";

import type { Mandate } from "@/api/mandate/types";
import type { User } from "@/api/user/types";

import type {
  createMandateCertificateSettingsSchema,
  createMandateCertificateDataSchema,
  mandateCertificateDataSchema,
  mandateCertificateSettingsSchema,
  mandateCertificateSchema,
  updateMandateCertificateSettingsSchema,
} from "./schema";

export type MandateCertificateSettings = z.infer<
  typeof mandateCertificateSettingsSchema
>;
export type CreateMandateCertificateSettingsData = z.infer<
  typeof createMandateCertificateSettingsSchema
>;
export type UpdateMandateCertificateSettingsInput = z.infer<
  typeof updateMandateCertificateSettingsSchema
>;

export type MandateCertificateSettingsDocument =
  DocumentReference<CreateMandateCertificateSettingsData>;

export type MandateCertificateRecord = z.infer<
  typeof mandateCertificateDataSchema
>;
export type MandateCertificate = z.infer<typeof mandateCertificateSchema>;
export type CreateMandateCertificateData = z.infer<
  typeof createMandateCertificateDataSchema
>;

export type MandateCertificatesCollection =
  CollectionReference<MandateCertificateRecord>;
export type MandateCertificateDocument =
  DocumentReference<MandateCertificateRecord>;

export type MandateCertificatePayload = MandateCertificate;

export interface UpdateMandateCertificateSettingsVariables {
  user: User;
  data: UpdateMandateCertificateSettingsInput;
}

export interface IssueMandateCertificateVariables {
  mandate: Mandate;
  user: User;
}
