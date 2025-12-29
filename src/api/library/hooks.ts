import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery } from "@tanstack/react-query";

import { library } from "./index";

export function useCreateLibrary() {
  return useMutation({
    mutationKey: library.create.$get(),
    mutationFn: useServerFn(library.$use.create),
    meta: {
      errorMessage: "Failed to create library.",
      successMessage: "Library created successfully.",
    },
  });
}

export function useUpdateLibrary() {
  return useMutation({
    mutationKey: library.update.$get(),
    mutationFn: useServerFn(library.$use.update),
    meta: {
      errorMessage: "Failed to update library.",
      successMessage: "Library updated successfully.",
    },
  });
}

export function useRemoveLibrary() {
  return useMutation({
    mutationKey: library.remove.$get(),
    mutationFn: useServerFn(library.$use.remove),
    meta: {
      errorMessage: "Failed to delete library.",
      successMessage: "Library deleted successfully.",
    },
  });
}

export function useGetLibrary(id?: string) {
  const getLibrary = useServerFn(library.$use.get);
  return useQuery({
    queryKey: library.get.$get(id),
    queryFn: () => getLibrary({ data: id! }),
    enabled: !!id,
  });
}
