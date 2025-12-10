import { useMutation } from "@tanstack/react-query";
import { mandateCertificateSettings } from ".";

export function useCreateMandateCertificateSettings() {
  return useMutation({
    mutationKey: mandateCertificateSettings.create.$get(),
    mutationFn: mandateCertificateSettings.$use.create,
  });
}

export function useUpdateMandateCertificateSettings() {
  return useMutation({
    mutationKey: mandateCertificateSettings.update.$get(),
    mutationFn: mandateCertificateSettings.$use.update,
  });
}

export function useGetMandateCertificateSettings() {
  return useMutation({
    mutationKey: mandateCertificateSettings.get.$get(),
    mutationFn: mandateCertificateSettings.$use.get,
  });
}