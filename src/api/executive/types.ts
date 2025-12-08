import type {
  CollectionReference,
  DocumentReference,
} from "firebase/firestore";
import type z from "zod";
import type {
  createExecutiveSchema,
  executiveDataSchema,
  executiveSchema,
  updateExecutiveSchema,
} from "./schema";
import type { Variables } from "@/client/core-query";
import type { User } from "../user/types";

export type Executive = z.infer<typeof executiveSchema>;
export type ExecutiveData = z.infer<typeof executiveDataSchema>;
export type CreateExecutiveData = z.infer<typeof createExecutiveSchema>;
export type UpdateExecutiveData = z.infer<typeof updateExecutiveSchema>;
export type ExecutiveTier = z.infer<typeof executiveSchema.shape.tier>;

export type UpstreamExecutiveCollection =
  CollectionReference<CreateExecutiveData>;
export type UpstreamExecutiveDocument = DocumentReference<CreateExecutiveData>;
export type DownstreamExecutiveCollection = CollectionReference<ExecutiveData>;
export type DownstreamExecutiveDocument = DocumentReference<ExecutiveData>;

export type ListExecutiveVariables = Variables<ExecutiveData>;

export interface CreateExecutiveVariables {
  data: CreateExecutiveData;
  user: User;
}

export interface UpdateExecutiveVariables {
  id: string;
  data: UpdateExecutiveData;
  user: User;
}
