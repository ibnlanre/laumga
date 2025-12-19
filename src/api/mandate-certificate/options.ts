import { queryOptions } from "@tanstack/react-query";
import { mandateCertificate } from ".";

export const getMandateCertificateOptions = (id?: string) => {
  return queryOptions({
    queryKey: mandateCertificate.get.$get(id),
    queryFn: () => mandateCertificate.$use.get(id!),
    enabled: !!id,
  });
};
