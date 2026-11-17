import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";

async function searchCafes(search = "", filters = {}) {
  const url = new URL("http://localhost:3001/api-proxy/cafes");
  url.search = new URLSearchParams({ locale: "vi", limit: "10", search, ...filters }).toString();
  const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
  assert.equal(response.status, 200);
  return (await response.json()).data;
}

const initial = await searchCafes();
assert.equal(initial.length, 10);
assert(initial.every((cafe) => /^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(cafe.id)));
const matches = await searchCafes(initial[0].name);
assert(matches.some((cafe) => cafe.id === initial[0].id));
assert.equal((await searchCafes(randomUUID())).length, 0);
assert.deepEqual((await searchCafes()).map((cafe) => cafe.id), initial.map((cafe) => cafe.id));
const suggestions = await searchCafes("", { purposes: "work", vibes: "quiet" });
assert(suggestions.length > 0 && suggestions.length <= 10);
assert(suggestions.every((cafe) => cafe.purposes.some((purpose) => ["làm việc", "work"].includes(purpose.toLowerCase()))));
assert(suggestions.every((cafe) => cafe.vibes.some((vibe) => ["yên tĩnh", "quiet"].includes(vibe.toLowerCase()))));
console.log("Cafe search passed: DB cafes, name search, no matches, clear search, purpose and vibe.");
