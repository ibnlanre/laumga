import { useQuery } from "@tanstack/react-query";

import { flutterwave } from ".";

export function useFetchFlutterwaveBanks() {
  return useQuery({
    queryKey: flutterwave.bank.list.$use(),
    queryFn: () => flutterwave.$use.bank.list(),
  });
}
