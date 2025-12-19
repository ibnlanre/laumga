import { queryOptions } from "@tanstack/react-query";
import { library } from ".";
import type { ListLibraryVariables } from "./types";

export const listLibraryOptions = (variables?: ListLibraryVariables) => {
  return queryOptions({
    queryKey: library.list.$use(variables),
    queryFn: () => library.$use.list(variables),
  });
};

export const getLibraryOptions = (id?: string) => {
  return queryOptions({
    queryKey: library.get.$get(id),
    queryFn: () => library.$use.get(id!),
    enabled: !!id,
  });
};
