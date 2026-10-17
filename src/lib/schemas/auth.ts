import { z } from "zod";

export type AuthSchemaMessages = {
  invalidEmail: string;
  passwordMin: string;
  confirmPasswordMin: string;
  passwordMismatch: string;
  oldPasswordMin?: string;
  newPasswordMin?: string;
};

type ResetPasswordSchemaMessages = AuthSchemaMessages & {
  passwordMax: string;
  tokenRequired?: string;
};

const viMessages: AuthSchemaMessages = {
  invalidEmail: "Email không hợp lệ",
  passwordMin: "Mật khẩu tối thiểu 8 ký tự",
  confirmPasswordMin: "Xác nhận mật khẩu tối thiểu 8 ký tự",
  passwordMismatch: "Mật khẩu xác nhận không khớp",
  oldPasswordMin: "Mật khẩu cũ tối thiểu 8 ký tự",
  newPasswordMin: "Mật khẩu mới tối thiểu 8 ký tự",
};

export function createLoginSchema(messages: AuthSchemaMessages) {
  return z.object({
    email: z.string().email(messages.invalidEmail),
    password: z.string().min(8, messages.passwordMin),
  });
}

export function createRegisterSchema(messages: AuthSchemaMessages) {
  return z
    .object({
      email: z.string().email(messages.invalidEmail),
      password: z.string().min(8, messages.passwordMin),
      confirmPassword: z.string().min(8, messages.confirmPasswordMin),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: messages.passwordMismatch,
      path: ["confirmPassword"],
    });
}

export function createUpdatePasswordSchema(messages: AuthSchemaMessages) {
  return z.object({
    oldPassword: z.string().min(8, messages.oldPasswordMin ?? messages.passwordMin),
    newPassword: z.string().min(8, messages.newPasswordMin ?? messages.passwordMin),
    confirmPassword: z.string().min(8, messages.confirmPasswordMin),
  });
}

export function createForgotPasswordSchema(messages: AuthSchemaMessages) {
  return z.object({ email: z.string().email(messages.invalidEmail) });
}

export function createResetPasswordSchema(messages: ResetPasswordSchemaMessages) {
  return z
    .object({
      token: z.string().min(1, messages.tokenRequired ?? "Missing reset token"),
      newPassword: z.string().min(8, messages.passwordMin).max(72, messages.passwordMax),
      confirmPassword: z.string().min(8, messages.confirmPasswordMin).max(72, messages.passwordMax),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: messages.passwordMismatch,
      path: ["confirmPassword"],
    });
}

export const loginSchema = createLoginSchema(viMessages);
export const registerSchema = createRegisterSchema(viMessages);
export const updatePasswordSchema = createUpdatePasswordSchema(viMessages);

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type UpdatePasswordFormValues = z.infer<typeof updatePasswordSchema>;
export type ForgotPasswordFormValues = z.infer<ReturnType<typeof createForgotPasswordSchema>>;
export type ResetPasswordFormValues = z.infer<ReturnType<typeof createResetPasswordSchema>>;
