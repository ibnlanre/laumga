import { queryOptions } from "@tanstack/react-query";
import { paymentPartner } from ".";

export const listPaymentPartnerOptions = () => {
  return queryOptions({
    queryKey: paymentPartner.list.$use(),
    queryFn: () => paymentPartner.$use.list(),
  });
};

export const getPaymentPartnerOptions = (id?: string) => {
  return queryOptions({
    queryKey: paymentPartner.get.$get(id),
    queryFn: () => paymentPartner.$use.get(id as string),
    enabled: !!id,
  });
};

export const getActivePaymentPartnerOptions = () => {
  return queryOptions({
    queryKey: paymentPartner.getActive.$use(),
    queryFn: () => paymentPartner.$use.getActive(),
  });
};
