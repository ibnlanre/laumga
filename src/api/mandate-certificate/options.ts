import { queryOptions } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { mandateCertificate } from ".";

export const getMandateCertificateOptions = (id?: string) => {
  const get = useServerFn(mandateCertificate.$use.get);
  return queryOptions({
    queryKey: mandateCertificate.get.$use({ data: id! }),
    queryFn: () => get({ data: id! }),
    enabled: !!id,
  });
};

export const listGetActiveMandateCertificateOptions = (userId?: string) => {
  const getActive = useServerFn(mandateCertificate.$use.getActive);
  return queryOptions({
    queryKey: mandateCertificate.getActive.$use({ data: userId! }),
    queryFn: () => getActive({ data: userId! }),
    enabled: !!userId,
  });
};
