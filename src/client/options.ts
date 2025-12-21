import { type OmitKeyof, type UseQueryOptions } from "@tanstack/react-query";

type QueryFields = "queryFn" | "queryKey" | "select";
type QueryOptions = UseQueryOptions<any, any, any, any>;

export type Options<TQueryOptions extends QueryOptions> = OmitKeyof<
  TQueryOptions,
  QueryFields
>;
