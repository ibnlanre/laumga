import { user } from ".";
import type { Options } from "@/client/options";
import { queryOptions, useQuery, useMutation } from "@tanstack/react-query";
import type { ListUserVariables } from "./types";
import { useServerFn } from "@tanstack/react-start";

export function useListUsers(
  variables?: ListUserVariables,
  options: Options<typeof query> = {},
  query = queryOptions({
    queryKey: user.list.$use(variables),
    queryFn: () => user.$use.list(variables),
  })
) {
  return useQuery({ ...query, ...options });
}

export function useUpdateUser() {
  return useMutation({
    mutationKey: user.update.$get(),
    mutationFn: user.$use.update,
    meta: {
      errorMessage: "Failed to update user.",
      successMessage: "User updated successfully.",
    },
  });
}

export function useCreateUser() {
  return useMutation({
    mutationKey: user.create.$get(),
    mutationFn: user.$use.create,
    meta: {
      errorMessage: "Failed to create user. Please try again.",
      successMessage: "User created successfully.",
    },
  });
}

export function useCurrentUser() {
  return useMutation({
    mutationKey: user.get.$get(),
    mutationFn: (user.$use.get),
  });
}

export function useLogin() {
  return useMutation({
    mutationKey: user.login.$get(),
    mutationFn: user.$use.login,
    meta: {
      errorMessage: "Login failed. Please try again.",
      successMessage: "Logged in successfully.",
    },
  });
}

export function useLogout() {
  return useMutation({
    mutationKey: user.logout.$get(),
    mutationFn: user.$use.logout,
    meta: {
      errorMessage: "Logout failed. Please try again.",
      successMessage: "Logged out successfully.",
    },
  });
}

export function useLoginWithProvider() {
  return useMutation({
    mutationKey: user.loginWithProvider.$get(),
    mutationFn: user.$use.loginWithProvider,
    meta: {
      errorMessage: "Social login failed. Please try again.",
      successMessage: "Logged in successfully.",
    },
  });
}

export function useResetPassword() {
  return useMutation({
    mutationKey: user.resetPassword.$get(),
    mutationFn: user.$use.resetPassword,
    meta: {
      errorMessage: "Failed to send reset email. Please try again.",
      successMessage: "Reset email sent successfully.",
    },
  });
}

export function useApplyPasswordReset() {
  return useMutation({
    mutationKey: user.applyPasswordReset.$get(),
    mutationFn: user.$use.applyPasswordReset,
    meta: {
      errorMessage: "Failed to reset password. Please try again.",
      successMessage: "Password reset successfully.",
    },
  });
}
