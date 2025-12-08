import { useQuery } from "@tanstack/react-query";
import { mandateCertificate } from ".";

export function useGetMandateCertificate(userId?: string) {
  return useQuery({
    queryKey: mandateCertificate.get.$get(userId),
    queryFn: () => mandateCertificate.$use.get(userId!),
    enabled: !!userId,
  });
}
