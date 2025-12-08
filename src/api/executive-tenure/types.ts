import type {
  CollectionReference,
  DocumentReference,
} from "firebase/firestore";
import type z from "zod";

import type { Variables } from "@/client/core-query";
import type { User } from "@/api/user/types";

import type {
  createExecutiveTenureSchema,
  executiveTenureDataSchema,
  executiveTenureSchema,
  updateExecutiveTenureSchema,
} from "./schema";

export type ExecutiveTenure = z.infer<typeof executiveTenureSchema>;
export type ExecutiveTenureData = z.infer<typeof executiveTenureDataSchema>;
export type CreateExecutiveTenureData = z.infer<
  typeof createExecutiveTenureSchema
>;
export type UpdateExecutiveTenureData = z.infer<
  typeof updateExecutiveTenureSchema
>;

export type UpstreamExecutiveTenureCollection =
  CollectionReference<CreateExecutiveTenureData>;
export type UpstreamExecutiveTenureDocument =
  DocumentReference<CreateExecutiveTenureData>;

export type DownstreamExecutiveTenureCollection =
  CollectionReference<ExecutiveTenureData>;
export type DownstreamExecutiveTenureDocument =
  DocumentReference<ExecutiveTenureData>;

export type ListExecutiveTenureVariables = Variables<ExecutiveTenureData>;

export interface CreateExecutiveTenureVariables {
  data: CreateExecutiveTenureData;
  user: User;
}

export interface UpdateExecutiveTenureVariables {
  id: string;
  data: UpdateExecutiveTenureData;
  user: User;
}

export type SetExecutiveTenureActiveVariables = Omit<
  UpdateExecutiveTenureVariables,
  "data"
>;
