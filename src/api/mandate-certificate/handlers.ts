import { useQuery, queryOptions } from "@tanstack/react-query";
import { mandateCertificate } from "./index";
import type { Options } from "@/client/options";

export function useGetActiveMandateCertificate(
  userId?: string,
  options: Options<typeof query> = {},
  query = queryOptions({
    queryKey: mandateCertificate.getActive.$get(userId),
    queryFn: () => mandateCertificate.$use.getActive(userId!),
    enabled: !!userId,
  })
) {
  return useQuery({ ...query, ...options });
}
