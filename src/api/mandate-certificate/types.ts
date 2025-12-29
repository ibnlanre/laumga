import type {
  CollectionReference,
  DocumentReference,
} from "firebase/firestore";
import type { z } from "zod";

import type { Mandate } from "@/api/mandate/types";
import type { User } from "@/api/user/types";

import type {
  createMandateCertificateDataSchema,
  mandateCertificateDataSchema,
  mandateCertificateSchema,
  updateMandateCertificateDataSchema,
} from "./schema";

export type MandateCertificateData = z.infer<
  typeof mandateCertificateDataSchema
>;
export type MandateCertificate = z.infer<typeof mandateCertificateSchema>;
export type CreateMandateCertificateData = z.infer<
  typeof createMandateCertificateDataSchema
  >;
export type UpdateMandateCertificateData = z.infer<typeof updateMandateCertificateDataSchema>;

export type MandateCertificatesCollection =
  CollectionReference<MandateCertificateData>;
export type MandateCertificateDocument =
  DocumentReference<MandateCertificateData>;

export interface CreateMandateCertificateVariables {
  mandate: Mandate;
  user: User;
}

export interface UpdateMandateCertificateVariables {
  id: string;
  data: UpdateMandateCertificateData;
}