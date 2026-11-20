import type { Draft } from "./model";
export type UploadKind = "gallery" | "menu";
export type MediaStatus = "uploading" | "failed" | "deleting" | "delete_failed" | "unknown";
export type MediaPayload = { images?: string[]; menuImages?: string[] };
export type MediaItem = {
  id: string;
  kind: UploadKind;
  file?: File;
  displayUrl: string;
  payloadUrl?: string;
  status?: MediaStatus;
  sent?: boolean;
  cancelled?: boolean;
};
type Session = { id: string; token: string };
type Dependencies = {
  session: () => Promise<Session>;
  upload: (session: Session, file: File, kind: UploadKind) => Promise<string>;
  remove: (session: Session, url: string) => Promise<unknown>;
  read: (session: Session) => Promise<MediaPayload>;
  snapshot: () => MediaPayload;
  changed: () => void;
  merge: (items: MediaItem[], removed?: string, synced?: MediaPayload) => void;
  error: (message: string) => void;
  release: (url: string) => void;
};

export class MediaQueue {
  items: MediaItem[] = [];
  private running = 0;
  private stopped = false;
  private syncing = false;
  private session?: Session;
  private baseline = new Set<string>();
  private deps!: Dependencies;
  constructor(deps?: Dependencies) {
    if (deps) this.deps = deps;
  }
  configure(deps: Dependencies) {
    this.deps = deps;
  }
  get pending() {
    return (
      this.syncing ||
      this.items.some((item) => item.status === "uploading" || item.status === "deleting")
    );
  }
  get failed() {
    return this.items.some((item) =>
      ["failed", "delete_failed", "unknown"].includes(item.status ?? ""),
    );
  }
  add(items: MediaItem[]) {
    if (this.stopped) return;
    this.items.push(...items);
    this.emit();
    this.pump();
  }
  start() {
    this.stopped = false;
  }
  stop() {
    this.stopped = true;
    for (const item of this.items) this.deps.release(item.displayUrl);
    this.items = this.items.filter((item) => item.sent);
  }
  moveFirst(id: string) {
    const item = this.items.find((item) => item.id === id);
    if (!item) return;
    this.items = [item, ...this.items.filter((value) => value !== item)];
    this.merge();
    this.emit();
  }
  async remove(id: string) {
    const item = this.items.find((item) => item.id === id);
    if (!item || item.status === "deleting") return;
    if (item.status === "unknown") {
      await this.reconcile();
      return;
    }
    const failed = item.status === "failed";
    item.cancelled = true;
    if (!item.payloadUrl && (!item.sent || failed)) {
      this.discard(item);
      return;
    }
    item.status = "deleting";
    this.emit();
    if (item.payloadUrl) await this.deleteItem(item);
  }
  private pump() {
    if (this.stopped || this.syncing || this.items.some((item) => item.status === "unknown"))
      return;
    while (this.running < 2) {
      const item = this.items.find((value) => !value.sent && value.status === "uploading");
      if (!item) break;
      item.sent = true;
      this.running++;
      void this.run(item).finally(() => {
        this.running--;
        if (!this.running && this.items.some((value) => value.status === "unknown"))
          void this.reconcile();
        else this.pump();
      });
    }
  }
  private async run(item: MediaItem) {
    let posted = false;
    try {
      const session = await this.deps.session();
      this.session = session;
      if (this.stopped || item.cancelled) {
        this.discard(item);
        return;
      }
      const snapshot = this.deps.snapshot();
      [...(snapshot.images ?? []), ...(snapshot.menuImages ?? [])].forEach((url) =>
        this.baseline.add(url),
      );
      posted = true;
      item.payloadUrl = await this.deps.upload(session, item.file!, item.kind);
      if (item.cancelled) {
        await this.deleteItem(item);
        return;
      }
      item.status = undefined;
      this.deps.release(item.displayUrl);
      item.displayUrl = item.payloadUrl;
      this.merge();
      this.emit();
    } catch (error) {
      const status = (error as { status?: number })?.status;
      item.status = posted && (!status || status === 408 || status >= 500) ? "unknown" : "failed";
      if (item.cancelled && item.status === "failed") this.discard(item);
      else this.emit();
      this.report(
        item.status === "unknown"
          ? "Chưa xác định kết quả tải ảnh. Cần đồng bộ draft trước khi gửi duyệt."
          : "Không thể tải ảnh. Xoá hoặc chọn lại ảnh.",
      );
    }
  }
  private async deleteItem(item: MediaItem) {
    try {
      const session = this.session ?? (await this.deps.session());
      this.session = session;
      await this.deps.remove(session, item.payloadUrl!);
      this.discard(item);
      this.merge(item.payloadUrl);
    } catch (error) {
      if ((error as { status?: number })?.status === 404 && this.session) {
        try {
          const payload = await this.deps.read(this.session);
          if (
            ![...(payload.images ?? []), ...(payload.menuImages ?? [])].includes(item.payloadUrl!)
          ) {
            this.discard(item);
            this.merge(item.payloadUrl, payload);
            return;
          }
        } catch {
          /* Keep the tile until the draft can be verified. */
        }
      }
      item.status = "delete_failed";
      this.emit();
      this.report("Không thể xoá ảnh. Bấm thử xoá lại trước khi gửi duyệt.");
    }
  }
  async reconcile() {
    if (this.running || this.syncing || !this.session) return;
    this.syncing = true;
    this.emit();
    try {
      const payload = await this.deps.read(this.session);
      const known = new Set([
        ...this.baseline,
        ...this.items.flatMap((item) => (item.payloadUrl ? [item.payloadUrl] : [])),
      ]);
      for (const kind of ["gallery", "menu"] as const) {
        const unknown = this.items.filter(
          (item) => item.kind === kind && item.status === "unknown",
        );
        const urls = (kind === "gallery" ? payload.images : payload.menuImages) ?? [];
        const candidates = urls.filter((url) => !known.has(url));
        // ponytail: one lost response can be correlated; multiple ambiguous uploads remain blocked for review.
        if (unknown.length === 1 && candidates.length === 1) {
          const item = unknown[0];
          item.payloadUrl = candidates[0];
          item.status = undefined;
          this.deps.release(item.displayUrl);
          item.displayUrl = item.payloadUrl;
          if (item.cancelled) await this.deleteItem(item);
        }
      }
      this.merge(undefined, payload);
    } catch {
      this.report("Không thể đồng bộ draft. Thử đồng bộ lại; chưa thể gửi duyệt.");
    } finally {
      this.syncing = false;
      this.emit();
      this.pump();
    }
  }
  private discard(item: MediaItem) {
    this.items = this.items.filter((value) => value !== item);
    this.deps.release(item.displayUrl);
    this.emit();
  }
  private merge(removed?: string, synced?: MediaPayload) {
    if (!this.stopped) this.deps.merge(this.items, removed, synced);
  }
  private emit() {
    if (!this.stopped) this.deps.changed();
  }
  private report(message: string) {
    if (!this.stopped) this.deps.error(message);
  }
}

export function mergeMediaDraft(
  prev: Draft,
  items: MediaItem[],
  removed?: string,
  synced?: MediaPayload,
): Draft {
  const next = { ...prev };
  for (const kind of ["gallery", "menu"] as const) {
    const field = kind === "gallery" ? "images" : "menuImages";
    const uploaded = items
      .filter((item) => item.kind === kind && item.payloadUrl && !item.cancelled)
      .map((item) => item.payloadUrl!);
    const managed = new Set(items.map((item) => item.payloadUrl));
    const current = synced?.[field] ?? prev[field] ?? [];
    next[field] = [
      ...new Set([...current.filter((url) => url !== removed && !managed.has(url)), ...uploaded]),
    ];
  }
  next.imageOrientations = next.images!.map(
    (url) => prev.imageOrientations?.[(prev.images ?? []).indexOf(url)] ?? "unknown",
  );

  return next;
}
