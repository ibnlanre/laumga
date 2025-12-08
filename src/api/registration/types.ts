import type { z } from "zod/v4";

import {
  accountCredentialsSchema,
  locationDetailsSchema,
  personalDetailsSchema,
  registrationSchema,
} from "./schema";

export type PersonalDetailsFormValues = z.infer<typeof personalDetailsSchema>;

export type LocationDetailsFormValues = z.infer<typeof locationDetailsSchema>;

export type AccountCredentialsFormValues = z.infer<
  typeof accountCredentialsSchema
>;

export type RegistrationFormValues = z.infer<typeof registrationSchema>;
