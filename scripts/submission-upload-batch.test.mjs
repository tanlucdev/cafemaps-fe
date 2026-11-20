import test from "node:test";
import assert from "node:assert/strict";
import { setImmediate } from "node:timers/promises";
import {
  MediaQueue,
  mergeMediaDraft,
} from "../src/app/[locale]/(main)/contribute/owner/OwnerContributeForm/media-queue.ts";

const tick = async () => {
  for (let i = 0; i < 10; i++) await setImmediate();
};
const deferred = () => {
  let resolve, reject;
  const promise = new Promise((a, b) => {
    resolve = a;
    reject = b;
  });
  return { promise, resolve, reject };
};
function fixture(overrides = {}) {
  const requests = [],
    removed = [],
    merged = [],
    released = [],
    errors = [];
  let changes = 0;
  const queue = new MediaQueue({
    session: async () => ({ id: "draft", token: "token" }),
    upload: async (_session, file) => {
      const pending = deferred();
      requests.push({ file, ...pending });
      return pending.promise;
    },
    remove: async (_session, url) => {
      removed.push(url);
    },
    read: async () => ({ images: [], menuImages: [] }),
    snapshot: () => ({ images: ["old"] }),
    changed: () => changes++,
    merge: (items, removed, synced) =>
      merged.push({ urls: items.map((item) => item.payloadUrl), removed, synced }),
    error: (message) => errors.push(message),
    release: (url) => released.push(url),
    ...overrides,
  });
  const item = (id, kind = "gallery") => ({
    id,
    kind,
    file: { name: id },
    displayUrl: `blob:${id}`,
    status: "uploading",
  });
  return { queue, item, requests, removed, merged, released, errors, changes: () => changes };
}

test("two requests maximum across separate selections and gallery/menu; selection order survives reversed completion", async () => {
  const f = fixture();
  f.queue.add([f.item("a"), f.item("b")]);
  f.queue.add([f.item("c", "menu"), f.item("d")]);
  await tick();
  assert.equal(f.requests.length, 2);
  assert.equal(f.queue.pending, true);
  f.requests[1].resolve("b-url");
  await tick();
  assert.equal(f.requests.length, 3);
  f.requests[0].resolve("a-url");
  await tick();
  assert.equal(f.requests.length, 4);
  f.requests[3].resolve("d-url");
  f.requests[2].resolve("c-url");
  await tick();
  assert.deepEqual(
    f.queue.items.map((item) => item.payloadUrl),
    ["a-url", "b-url", "c-url", "d-url"],
  );
  assert.equal(f.queue.pending || f.queue.failed, false);
});

test("queued cancellation sends no POST; in-flight cancellation waits then deletes the returned URL", async () => {
  const f = fixture();
  f.queue.add([f.item("a"), f.item("b"), f.item("queued")]);
  await tick();
  await f.queue.remove("queued");
  await f.queue.remove("a");
  assert.equal(f.queue.items[0].status, "deleting");
  assert.equal(f.removed.length, 0);
  f.requests[0].resolve("a-url");
  f.requests[1].resolve("b-url");
  await tick();
  assert.deepEqual(f.removed, ["a-url"]);
  assert.equal(f.requests.length, 2);
  assert.deepEqual(
    f.queue.items.map((item) => item.id),
    ["b"],
  );
});

test("deletion failure retains tile and blocks submit until retry succeeds", async () => {
  let attempts = 0;
  const f = fixture({
    remove: async () => {
      if (++attempts === 1) throw new Error("R2 down");
    },
  });
  f.queue.add([{ id: "saved", kind: "gallery", displayUrl: "saved-url", payloadUrl: "saved-url" }]);
  await f.queue.remove("saved");
  assert.equal(f.queue.items[0].status, "delete_failed");
  assert.equal(f.queue.failed, true);
  await f.queue.remove("saved");
  assert.equal(attempts, 2);
  assert.equal(f.queue.items.length, 0);
  assert.equal(f.queue.failed, false);
});

test("unmount stops queued uploads, releases previews, keeps successful assets; cancelled active upload is cleaned", async () => {
  const f = fixture();
  f.queue.add([f.item("a"), f.item("b"), f.item("queued")]);
  await tick();
  await f.queue.remove("a");
  f.queue.stop();
  const changes = f.changes();
  f.requests[0].resolve("a-url");
  f.requests[1].resolve("b-url");
  await tick();
  assert.deepEqual(f.removed, ["a-url"]);
  assert.equal(f.requests.length, 2);
  assert.equal(f.changes(), changes);
  assert.equal(f.merged.length, 0);
  assert.deepEqual([...new Set(f.released)].sort(), ["blob:a", "blob:b", "blob:queued"].sort());
});

test("lost response reads draft, recovers URL without a second POST", async () => {
  const f = fixture({ read: async () => ({ images: ["old", "recovered"] }) });
  f.queue.add([f.item("a")]);
  await tick();
  f.requests[0].reject({ status: 408 });
  await tick();
  assert.equal(f.requests.length, 1);
  assert.equal(f.queue.items[0].payloadUrl, "recovered");
  assert.equal(f.queue.failed, false);
  assert.deepEqual(f.merged.at(-1).synced.images, ["old", "recovered"]);
});

test("cancelled upload with lost response is cleaned after reconciliation", async () => {
  const f = fixture({ read: async () => ({ images: ["old", "recovered"] }) });
  f.queue.add([f.item("a")]);
  await tick();
  await f.queue.remove("a");
  f.requests[0].reject(new Error("connection lost"));
  await tick();
  assert.deepEqual(f.removed, ["recovered"]);
  assert.equal(f.queue.pending || f.queue.failed, false);
});

test("failed reconciliation stays unknown and blocked; retry reads, never POSTs again", async () => {
  let reads = 0;
  const f = fixture({
    read: async () => {
      if (++reads === 1) throw new Error("offline");
      return { images: ["old", "recovered"] };
    },
  });
  f.queue.add([f.item("a")]);
  await tick();
  f.requests[0].reject(new Error("offline"));
  await tick();
  assert.equal(f.queue.items[0].status, "unknown");
  assert.equal(f.queue.failed, true);
  await f.queue.remove("a");
  assert.equal(f.queue.failed, false);
  assert.equal(f.requests.length, 1);
});

test("successful read with no attributable URL stays blocked; definitive rejection can be removed", async () => {
  const f = fixture();
  f.queue.add([f.item("a")]);
  await tick();
  f.requests[0].reject({ status: 504 });
  await tick();
  assert.equal(f.queue.failed, true);
  await f.queue.remove("a");
  assert.equal(f.queue.failed, true);
  const g = fixture();
  g.queue.add([g.item("b")]);
  await tick();
  g.requests[0].reject({ status: 400 });
  await tick();
  assert.equal(g.queue.failed, true);
  await g.queue.remove("b");
  assert.equal(g.queue.failed || g.queue.pending, false);
});

test("media merge preserves edited text, orientation, selected order and removals after draft sync", () => {
  const prev = {
    name: "Still typing",
    note: "Unsaved",
    images: ["old", "b"],
    imageOrientations: ["portrait", "landscape"],
  };
  const items = [
    { id: "a", kind: "gallery", payloadUrl: "a" },
    { id: "b", kind: "gallery", payloadUrl: "b" },
  ];
  const merged = mergeMediaDraft(prev, items, "old", {
    images: ["old", "b", "a"],
    menuImages: ["menu"],
  });
  assert.equal(merged.name, "Still typing");
  assert.equal(merged.note, "Unsaved");
  assert.deepEqual(merged.images, ["a", "b"]);
  assert.deepEqual(merged.imageOrientations, ["unknown", "landscape"]);
  assert.deepEqual(merged.menuImages, ["menu"]);
});

test("retry after lost DELETE response accepts 404 only after draft confirms removal", async () => {
  let attempts = 0;
  const f = fixture({
    remove: async () => {
      if (++attempts === 1) throw { status: 408 };
      throw { status: 404 };
    },
    read: async () => ({ images: [] }),
  });
  f.queue.add([f.item("a")]);
  await tick();
  f.requests[0].resolve("saved");
  await tick();
  await f.queue.remove("a");
  assert.equal(f.queue.failed, true);
  await f.queue.remove("a");
  assert.equal(f.queue.items.length, 0);
  assert.equal(f.queue.failed, false);
});
