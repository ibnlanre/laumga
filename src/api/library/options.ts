import { queryOptions } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { library } from ".";
import type { ListLibraryVariables } from "./types";

export const listLibraryOptions = (variables?: ListLibraryVariables) => {
  const list = useServerFn(library.$use.list);
  return queryOptions({
    queryKey: library.list.$use({ data: variables }),
    queryFn: () => list({ data: variables }),
  });
};

export const getLibraryOptions = (id?: string) => {
  const get = useServerFn(library.$use.get);
  return queryOptions({
    queryKey: library.get.$use({ data: id! }),
    queryFn: () => get({ data: id! }),
    enabled: !!id,
  });
};
