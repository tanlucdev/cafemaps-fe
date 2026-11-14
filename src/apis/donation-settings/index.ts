import { z } from "zod";
import { apiFetch } from "@/apis/http";

const donationSettingsSchema = z.object({
  enabled: z.boolean(),
  qrImageUrl: z
    .string()
    .url()
    .regex(/^https?:\/\//)
    .nullable(),
  titleVi: z.string().max(120).nullable(),
  titleEn: z.string().max(120).nullable(),
  descriptionVi: z.string().max(500).nullable(),
  descriptionEn: z.string().max(500).nullable(),
});

export async function getDonationSettings(signal?: AbortSignal) {
  return donationSettingsSchema.parse(
    await apiFetch<unknown>("/donation-settings", { cache: "no-store", signal }),
  );
}
