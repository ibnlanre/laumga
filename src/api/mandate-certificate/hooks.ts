import { queryOptions, useMutation, useQuery } from "@tanstack/react-query";
import { mandateCertificate } from ".";
import type { Options } from "@/client/options";

export function useGetMandateCertificate(
  id?: string,
  options: Options<typeof query> = {},
  query = queryOptions({
    queryKey: mandateCertificate.get.$get(id),
    queryFn: () => mandateCertificate.$use.get(id!),
    enabled: !!id,
  })
) {
  return useQuery({ ...query, ...options });
}

export function useCreateMandateCertificate() {
  return useMutation({
    mutationKey: mandateCertificate.create.$get(),
    mutationFn: mandateCertificate.$use.create,
  });
}

export function useUpdateMandateCertificate() {
  return useMutation({
    mutationKey: mandateCertificate.update.$get(),
    mutationFn: mandateCertificate.$use.update,
  });
}

export function useDeleteMandateCertificate() {
  return useMutation({
    mutationKey: mandateCertificate.remove.$get(),
    mutationFn: mandateCertificate.$use.remove,
  });
}
