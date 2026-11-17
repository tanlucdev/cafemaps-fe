const HCMC_TIME_ZONE_OFFSET = "+07:00";

export function meetupCafePurposes(purposeIndex: number) {
  const purpose = ["study", "work", "group", "solo", "friends", "friends"][purposeIndex];
  return purpose ? [purpose] : undefined;
}

export function meetupLocalDateTimeToIso(date: string, time: string) {
  return new Date(`${date}T${time}:00${HCMC_TIME_ZONE_OFFSET}`).toISOString();
}

export function buildGoogleMapsSearchUrl(name: string, district?: string) {
  const query = [name, district, "TP.HCM"].filter(Boolean).join(" ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function isValidExternalCafeUrl(value: string) {
  if (!value.trim()) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}
