import { AREAS } from "../constants/areas";

export type DistrictSearchParse = {
  district?: string;
  search?: string;
  matched: boolean;
};

function normalizeSearchText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeSearchTextWithMap(value: string) {
  let text = "";
  const map: number[] = [];
  let lastWasSpace = true;

  for (let index = 0; index < value.length; index += 1) {
    const normalized = normalizeSearchText(value[index]);
    for (const char of normalized || (/\s/.test(value[index]) ? " " : "")) {
      if (char === " ") {
        if (lastWasSpace) continue;
        lastWasSpace = true;
      } else {
        lastWasSpace = false;
      }
      text += char;
      map.push(index);
    }
  }

  if (text.endsWith(" ")) {
    text = text.slice(0, -1);
    map.pop();
  }

  return { text, map };
}

function isSearchWordChar(value: string | undefined) {
  return Boolean(value && /[a-z0-9]/.test(value));
}

function isDistrictBoundary(text: string, index: number, direction: -1 | 1) {
  const adjacent = text[index];
  if (isSearchWordChar(adjacent)) return false;
  if (adjacent === "," || adjacent === ";" || adjacent === ":") return true;
  if (adjacent === "/" || adjacent === ".") return !isSearchWordChar(text[index + direction]);
  return true;
}

const DISTRICT_SEARCH_ENTRIES = AREAS.flatMap((district) => {
  const number = district.match(/^Quận\s+(\d+)$/i)?.[1];
  const labels = new Set([district, normalizeSearchText(district)]);
  if (number) {
    labels.add(`quan ${number}`);
    labels.add(`district ${number}`);
  }
  return [...new Set([...labels].map(normalizeSearchText))].map((label) => ({ district, label }));
});

export function parseDistrictSearch(input: string, locale: "vi" | "en"): DistrictSearchParse {
  const trimmed = input.trim();
  if (!trimmed) return { matched: false };

  const { text, map } = normalizeSearchTextWithMap(trimmed);
  const matches = [];
  const entries =
    locale === "en"
      ? [...DISTRICT_SEARCH_ENTRIES].sort((a) => (a.label.startsWith("district") ? -1 : 1))
      : DISTRICT_SEARCH_ENTRIES;

  for (const entry of entries) {
    let start = text.indexOf(entry.label);
    while (start !== -1) {
      const end = start + entry.label.length;
      if (isDistrictBoundary(text, start - 1, -1) && isDistrictBoundary(text, end, 1)) {
        matches.push({ ...entry, start, end });
      }
      start = text.indexOf(entry.label, start + 1);
    }
  }

  if (matches.length !== 1) return { search: trimmed, matched: false };

  const [match] = matches;
  let originalStart = map[match.start];
  let originalEnd = map[match.end - 1] + 1;
  const opening = trimmed[originalStart - 1];
  const closing = trimmed[originalEnd];
  if ((opening === "(" && closing === ")") || (opening === "[" && closing === "]")) {
    originalStart -= 1;
    originalEnd += 1;
  }

  const search = `${trimmed.slice(0, originalStart).replace(/[\s,;:/-]+$/g, "")} ${trimmed
    .slice(originalEnd)
    .replace(/^[\s,;:/-]+/g, "")}`
    .replace(/\s+/g, " ")
    .trim();

  return { district: match.district, search: search || undefined, matched: true };
}
