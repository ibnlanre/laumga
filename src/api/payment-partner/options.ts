import { queryOptions } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { paymentPartner } from ".";

export const listPaymentPartnerOptions = () => {
  const list = useServerFn(paymentPartner.$use.list);
  return queryOptions({
    queryKey: paymentPartner.list.$use(),
    queryFn: () => list(),
  });
};

export const getPaymentPartnerOptions = (id?: string) => {
  const get = useServerFn(paymentPartner.$use.get);
  return queryOptions({
    queryKey: paymentPartner.get.$get(id),
    queryFn: () => get(id as string),
    enabled: !!id,
  });
};

export const getActivePaymentPartnerOptions = () => {
  const getActive = useServerFn(paymentPartner.$use.getActive);
  return queryOptions({
    queryKey: paymentPartner.getActive.$use(),
    queryFn: () => getActive(),
  });
};
