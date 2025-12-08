import type {
  CollectionReference,
  DocumentReference,
} from "firebase/firestore";
import type { z } from "zod";

import type {
  allocationTypeSchema,
  createPaymentPartnerSchema,
  feeBearerSchema,
  paymentPartnerDataSchema,
  paymentPartnerFormSchema,
  paymentPartnerSchema,
  updatePaymentPartnerSchema,
} from "./schema";
import type { User } from "../user/types";

export type PaymentPartner = z.infer<typeof paymentPartnerSchema>;
export type PaymentPartnerData = z.infer<typeof paymentPartnerDataSchema>;
export type PaymentPartnerFormData = z.infer<typeof paymentPartnerFormSchema>;
export type PaymentPartnerFeeBearer = z.infer<typeof feeBearerSchema>;
export type PaymentPartnerAllocationType = z.infer<typeof allocationTypeSchema>;
export type CreatePaymentPartnerData = z.infer<
  typeof createPaymentPartnerSchema
>;
export type UpdatePaymentPartnerData = z.infer<
  typeof updatePaymentPartnerSchema
>;

export type UpstreamPaymentPartnerCollection =
  CollectionReference<CreatePaymentPartnerData>;
export type UpstreamPaymentPartnerDocument =
  DocumentReference<CreatePaymentPartnerData>;
export type DownstreamPaymentPartnerCollection =
  CollectionReference<PaymentPartnerData>;
export type DownstreamPaymentPartnerDocument =
  DocumentReference<PaymentPartnerData>;

export interface CreatePaymentPartnerVariables {
  data: PaymentPartnerFormData;
  user: User;
}

export interface UpdatePaymentPartnerVariables {
  id: string;
  user: User;
  data: UpdatePaymentPartnerData;
}
