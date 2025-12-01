import { useMutation } from "@tanstack/react-query";
import { api } from "@/api";

export function useCreateUser() {
  return useMutation({
    meta: {
      errorMessage: "Failed to create user. Please try again.",
      successMessage: "User created successfully.",
    },
    mutationFn: api.$use.user.create,
  });
}

export function useCurrentUser() {
  return useMutation({
    mutationFn: api.$use.user.fetch,
    meta: {
      errorMessage: "Failed to fetch current user data.",
      successMessage: "User data fetched successfully.",
    },
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: api.$use.user.login,
    meta: {
      errorMessage: "Login failed. Please try again.",
      successMessage: "Logged in successfully.",
    },
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: api.$use.user.resetPassword,
    meta: {
      errorMessage: "Failed to send reset email. Please try again.",
      successMessage: "Reset email sent successfully.",
    },
  });
}
