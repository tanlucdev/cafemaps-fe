import assert from "node:assert/strict";
import test from "node:test";
import { createForgotPasswordSchema, createResetPasswordSchema } from "./auth.ts";

const messages = {
  invalidEmail: "invalid email",
  passwordMin: "too short",
  passwordMax: "too long",
  confirmPasswordMin: "confirmation too short",
  passwordMismatch: "passwords differ",
  tokenRequired: "missing token",
};

test("password reset schemas reject missing token, invalid email, and invalid passwords", () => {
  assert.equal(
    createForgotPasswordSchema(messages).safeParse({ email: "not-an-email" }).success,
    false,
  );
  const schema = createResetPasswordSchema(messages);
  assert.equal(
    schema.safeParse({ token: "", newPassword: "password123", confirmPassword: "password123" })
      .success,
    false,
  );
  assert.equal(
    schema.safeParse({ token: "token", newPassword: "short", confirmPassword: "short" }).success,
    false,
  );
  assert.equal(
    schema.safeParse({ token: "token", newPassword: "password123", confirmPassword: "password456" })
      .success,
    false,
  );
});
