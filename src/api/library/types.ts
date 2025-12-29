import type {
  CollectionReference,
  DocumentReference,
} from "firebase/firestore";
import type z from "zod";

import type {
  createLibrarySchema,
  libraryDataSchema,
  librarySchema,
  updateLibrarySchema,
} from "./schema";
import type { Variables } from "@/client/types";
import type { User } from "../user/types";

export type Library = z.infer<typeof librarySchema>;
export type LibraryData = z.infer<typeof libraryDataSchema>;
export type CreateLibraryData = z.infer<typeof createLibrarySchema>;
export type UpdateLibraryData = z.infer<typeof updateLibrarySchema>;

export type UpstreamLibraryCollection = CollectionReference<CreateLibraryData>;
export type UpstreamLibraryDocument = DocumentReference<CreateLibraryData>;
export type DownstreamLibraryCollection = CollectionReference<LibraryData>;
export type DownstreamLibraryDocument = DocumentReference<LibraryData>;

export type ListLibraryVariables = Variables<LibraryData>;

export interface CreateLibraryVariables {
  data: CreateLibraryData;
  user: User;
}

export interface UpdateLibraryVariables {
  id: string;
  data: UpdateLibraryData;
  user: User;
}

export interface RemoveLibraryVariables {
  id: string;
}
