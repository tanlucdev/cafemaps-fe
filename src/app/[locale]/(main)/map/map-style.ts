import type { Theme } from "@/components/providers/theme";

export function mapStyle(theme: Theme) {
  return theme === "dark"
    ? "mapbox://styles/mapbox/navigation-night-v1"
    : "mapbox://styles/mapbox/streets-v12";
}
