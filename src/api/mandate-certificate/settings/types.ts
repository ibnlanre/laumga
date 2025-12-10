import { z } from "zod";
import type { DocumentReference } from "firebase/firestore";
import type {
  createMandateCertificateSettingsSchema,
  mandateCertificateSettingsFormSchema,
  mandateCertificateSettingsSchema,
  updateMandateCertificateSettingsSchema,
} from "./schema";
import type { User } from "@/api/user/types";

export type MandateCertificateSettings = z.infer<
  typeof mandateCertificateSettingsSchema
>;
export type MandateCertificateSettingsForm = z.infer<
  typeof mandateCertificateSettingsFormSchema
  >;

export type CreateMandateCertificateSettingsData = z.infer<
  typeof createMandateCertificateSettingsSchema
>;
export type UpdateMandateCertificateSettingsInput = z.infer<
  typeof updateMandateCertificateSettingsSchema
>;

export interface CreateMandateCertificateSettingsVariables {
  user: User;
  data: CreateMandateCertificateSettingsData;
}

export interface UpdateMandateCertificateSettingsVariables {
  user: User;
  data: UpdateMandateCertificateSettingsInput;
}

export type MandateCertificateSettingsDocument =
  DocumentReference<CreateMandateCertificateSettingsData>;
