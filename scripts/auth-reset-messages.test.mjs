import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const resetFiles = [
  "src/app/[locale]/(auth)/AuthShell.tsx",
  "src/app/[locale]/(auth)/forgot-password/page.tsx",
  "src/app/[locale]/(auth)/forgot-password/ForgotPasswordForm.tsx",
  "src/app/[locale]/(auth)/reset-password/page.tsx",
  "src/app/[locale]/(auth)/reset-password/ResetPasswordForm.tsx",
];

function valueAt(object, key) {
  return key.split(".").reduce((value, part) => value?.[part], object);
}

test("password reset translation keys exist in every locale", () => {
  const keys = new Set(
    resetFiles.flatMap((file) =>
      [...fs.readFileSync(path.join(process.cwd(), file), "utf8").matchAll(/t\("([^"]+)"\)/g)].map(
        ([, key]) => key,
      ),
    ),
  );

  for (const locale of ["en", "vi"]) {
    const messages = JSON.parse(fs.readFileSync(`src/messages/${locale}.json`, "utf8")).auth;
    for (const key of keys) {
      assert.ok(valueAt(messages, key)?.trim(), `${locale}.auth.${key} is required`);
    }
  }
});
