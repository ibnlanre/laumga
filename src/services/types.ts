import type { OmitKeyof, UseQueryOptions } from "@tanstack/react-query";

export type WithId<T> = T & { id: string };
export type Prettify<T> = { [K in keyof T]: T[K] } & {};
export type Dictionary = Record<string, any>;

type QueryFields = "queryFn" | "queryKey";
type QueryOptions = UseQueryOptions<any, any, any, any>;
export type Options<TQueryOptions extends QueryOptions> = OmitKeyof<
  TQueryOptions,
  QueryFields
>;

export type Nullable<T> = { [K in keyof T]: null | T[K] };
export type NullableExcept<T, K extends keyof T> = Prettify<
  Nullable<Omit<T, K>> & Pick<T, K>
>;

export type LogEntry = NullableExcept<
  {
    at: string; // ISO String
    by: string; // User ID
    name: string; // User Name (snapshot)
    photoUrl: string; // User Photo (snapshot)
  },
  "at" | "by"
>;
