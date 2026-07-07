import type { ContributeFormData } from "./contribute-form.types";

export const MAX_PHOTOS = 8;
export const MAX_REASON_LENGTH = 300;
export const INITIAL_FORM_DATA: ContributeFormData = {
  name: "",
  googleMapsUrl: "",
  reason: "",
  photos: [],
};

export const FIELD_BASE_CLASS = [
  "w-full rounded-xl border bg-[var(--card)] px-3.5 py-2.5 text-[13.5px] text-[var(--foreground)] sm:py-3",
  "placeholder:text-[var(--foreground-muted)]/70 outline-none transition-all duration-150",
  "focus:!outline-none focus-visible:!rounded-xl focus-visible:!border-[var(--accent)] focus-visible:!outline-none focus-visible:!outline-offset-0 focus-visible:!shadow-none",
].join(" ");
