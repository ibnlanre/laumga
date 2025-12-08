import z from "zod";
import {
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
} from "./schema";

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export type LoginFormValues = z.infer<typeof loginSchema>;

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
