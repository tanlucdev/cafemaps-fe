"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import {
  deleteSubmissionImage,
  getSubmissionDraft,
  uploadSubmissionImage,
} from "@/apis/submissions";
import { createHeicPlaceholderDataUrl, isHeicFile } from "../../contribute-form.helpers";
import { normalizeDraft, type Draft } from "./model";
import {
  mergeMediaDraft,
  MediaQueue,
  type MediaItem,
  type MediaStatus,
  type UploadKind,
} from "./media-queue";
export type { UploadKind } from "./media-queue";

export function useImageUploads(options: {
  tokenOrLogin: () => Promise<string | null>;
  ensureSubmissionId: (token: string) => Promise<string>;
  setDraft: Dispatch<SetStateAction<Draft>>;
  draft: Draft;
  onError: (message: string) => void;
}) {
  const [, refresh] = useState(0);
  const previews = useRef(new Set<string>());
  const [queue] = useState(() => new MediaQueue());
  useLayoutEffect(() => {
    queue.configure({
      session: async () => {
        const token = await options.tokenOrLogin();
        if (!token) throw new Error("Login required");
        return { token, id: await options.ensureSubmissionId(token) };
      },
      upload: ({ id, token }, file, kind) =>
        uploadSubmissionImage(id, token, file, kind === "gallery" ? "images" : "menuImages"),
      remove: ({ id, token }, url) => deleteSubmissionImage(id, token, url),
      read: ({ id, token }) => getSubmissionDraft(id, token),
      snapshot: () => options.draft,
      changed: () => refresh((value) => value + 1),
      error: (message) => options.onError(message),
      release: (url) => {
        if (previews.current.delete(url)) URL.revokeObjectURL(url);
      },
      merge: (items, removed, synced) => {
        const snapshot = items.map((item) => ({ ...item }));
        options.setDraft((prev) =>
          normalizeDraft(mergeMediaDraft(prev, snapshot, removed, synced)),
        );
      },
    });
  }, [queue, options]);
  useEffect(() => {
    queue.start();
    return () => queue.stop();
  }, [queue]);
  const galleryUploads = queue.items.filter((item) => item.kind === "gallery");
  const menuUploads = queue.items.filter((item) => item.kind === "menu");
  const statuses = (items: MediaItem[]): Record<string, MediaStatus> =>
    Object.fromEntries(
      items.flatMap((item) => (item.status ? [[item.displayUrl, item.status]] : [])),
    );
  return {
    galleryUploads,
    menuUploads,
    imageStatuses: statuses(galleryUploads),
    menuImageStatuses: statuses(menuUploads),
    hasUploadPending: queue.pending,
    hasUploadFailed: queue.failed,
    isBlocked: () => queue.pending || queue.failed,
    startUploads(files: File[], kind: UploadKind) {
      if (kind === "gallery") {
        const gallery = queue.items.filter((item) => item.kind === "gallery");
        const used =
          new Set([
            ...(options.draft.images ?? []),
            ...gallery.flatMap((item) => (item.payloadUrl ? [item.payloadUrl] : [])),
          ]).size + gallery.filter((item) => !item.payloadUrl).length;
        const remaining = Math.max(0, 12 - used);
        if (files.length > remaining) options.onError("Gallery tối đa 12 ảnh.");
        files = files.slice(0, remaining);
      }
      queue.add(
        files.map((file) => {
          const displayUrl = isHeicFile(file)
            ? createHeicPlaceholderDataUrl(file.name)
            : URL.createObjectURL(file);
          if (displayUrl.startsWith("blob:")) previews.current.add(displayUrl);
          return { id: crypto.randomUUID(), file, kind, displayUrl, status: "uploading" };
        }),
      );
    },
    removeUploadAt(kind: UploadKind, index: number) {
      const item = (kind === "gallery" ? galleryUploads : menuUploads)[index];
      if (item) void queue.remove(item.id);
    },
    removePersistedAsset(kind: UploadKind, url: string) {
      const item = { id: crypto.randomUUID(), kind, displayUrl: url, payloadUrl: url };
      queue.add([item]);
      void queue.remove(item.id);
    },
    moveGalleryUploadToFront(index: number) {
      const item = galleryUploads[index];
      if (item) queue.moveFirst(item.id);
    },
  };
}
