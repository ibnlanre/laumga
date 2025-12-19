import { user } from ".";
import { useMutation } from "@tanstack/react-query";

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
