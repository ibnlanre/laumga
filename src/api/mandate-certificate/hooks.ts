import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { mandateCertificate } from ".";

export function useCreateMandateCertificate() {
  return useMutation({
    mutationKey: mandateCertificate.create.$get(),
    mutationFn: useServerFn(mandateCertificate.$use.create),
  });
}

export function useUpdateMandateCertificate() {
  return useMutation({
    mutationKey: mandateCertificate.update.$get(),
    mutationFn: useServerFn(mandateCertificate.$use.update),
  });
}

export function useDeleteMandateCertificate() {
  return useMutation({
    mutationKey: mandateCertificate.remove.$get(),
    mutationFn: useServerFn(mandateCertificate.$use.remove),
  });
}
