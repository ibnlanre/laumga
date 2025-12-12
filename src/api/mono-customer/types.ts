import type { z } from "zod";

import type { monoCustomerFormSchema } from "./schema";
import type { User } from "@/api/user/types";

export type MonoCustomerForm = z.infer<typeof monoCustomerFormSchema>;

export interface CreateMonoCustomerVariables {
  user: User;
  data: MonoCustomerForm;
}
