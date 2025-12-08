import { useQuery } from "@tanstack/react-query";
import { mono } from ".";

export function useFetchMonoBanks() {
  return useQuery({
    queryKey: mono.bank.list.$use(),
    queryFn: () => mono.$use.bank.list(),
  });
}
