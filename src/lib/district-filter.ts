export function normalizeDistricts(
  values: readonly string[] | undefined,
  areas: readonly string[],
): string[] | undefined {
  const selected = new Set(values?.map((value) => value.trim()).filter(Boolean))
  const districts = areas.filter((area) => selected.has(area))
  return districts.length ? districts : undefined
}

export function parseDistrictParams(
  districts: string | null,
  district: string | null,
  detectedDistrict: string | undefined,
  areas: readonly string[],
): string[] | undefined {
  return (
    normalizeDistricts(districts?.split(","), areas) ??
    normalizeDistricts(district ? [district] : undefined, areas) ??
    normalizeDistricts(detectedDistrict ? [detectedDistrict] : undefined, areas)
  )
}

export function serializeDistricts(
  districts: readonly string[] | undefined,
  areas: readonly string[],
): string | undefined {
  return normalizeDistricts(districts, areas)?.join(",")
}

export function districtKey(districts: readonly string[] | undefined, areas: readonly string[]): string {
  return serializeDistricts(districts, areas) ?? ""
}

export function includesDistrict(
  districts: readonly string[] | undefined,
  district: string | null | undefined,
): boolean {
  return !districts?.length || districts.includes(district ?? "")
}
