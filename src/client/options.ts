import {
  queryOptions,
  type DefinedInitialDataOptions,
  type OmitKeyof,
  dataTagSymbol,
  type UseQueryOptions,
} from "@tanstack/react-query";

type QueryFields = "queryFn" | "queryKey" | "select";
type QueryOptions = UseQueryOptions<any, any, any, any>;

export type Options<
  TQueryOptions extends QueryOptions,
> = OmitKeyof<TQueryOptions, QueryFields>

  

const x = queryOptions({
  queryKey: ["hello"],
  queryFn: async () => {
    return ["hello world"];
  },
  select(data) {
    return data.join(", ");
  },
});
