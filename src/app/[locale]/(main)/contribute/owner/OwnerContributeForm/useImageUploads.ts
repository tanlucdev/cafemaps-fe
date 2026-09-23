"use client";

import { type Dispatch, type SetStateAction, useEffect, useRef, useState } from "react";
import { uploadSubmissionImages } from "@/apis/submissions";
import { cloudinaryImageUrl } from "@/lib/cloudinary-image";
import { createHeicPlaceholderDataUrl, isHeicFile } from "../../contribute-form.helpers";
import type { Draft } from "./model";

export type UploadKind = "gallery" | "menu";
type UploadStatus = "uploading" | "failed";
type UploadItem = {
  id: string;
  file: File;
  displayUrl: string;
  payloadUrl?: string;
  status?: UploadStatus;
};

type Options = {
  tokenOrLogin: () => Promise<string | null>;
  ensureSubmissionId: (token: string) => Promise<string>;
  setDraft: Dispatch<SetStateAction<Draft>>;
  normalizeDraft: (draft: Draft) => Draft;
  onError: (message: string) => void;
};

export function useImageUploads({
  tokenOrLogin,
  ensureSubmissionId,
  setDraft,
  normalizeDraft,
  onError,
}: Options) {
  const [galleryUploads, setGalleryUploads] = useState<UploadItem[]>([]);
  const [menuUploads, setMenuUploads] = useState<UploadItem[]>([]);
  const [cancelledPendingCount, setCancelledPendingCount] = useState(0);
  const activeUploadIds = useRef(new Set<string>());
  const cancelledUploadIds = useRef(new Set<string>());
  const previewUrls = useRef(new Set<string>());

  useEffect(
    () => () => {
      activeUploadIds.current.clear();
      cancelledUploadIds.current.clear();
      previewUrls.current.forEach((url) => URL.revokeObjectURL(url));
      previewUrls.current.clear();
    },
    [],
  );

  const uploads = [...galleryUploads, ...menuUploads];

  return {
    galleryUploads,
    menuUploads,
    imageStatuses: uploadStatuses(galleryUploads),
    menuImageStatuses: uploadStatuses(menuUploads),
    hasUploadPending:
      cancelledPendingCount > 0 || uploads.some((item) => item.status === "uploading"),
    hasUploadFailed: uploads.some((item) => item.status === "failed"),
    startUploads,
    removeUploadAt,
    moveGalleryUploadToFront,
  };

  function startUploads(files: File[], kind: UploadKind) {
    if (!files.length) return;
    const items = files.map(createUploadItem);
    items.forEach((item) => activeUploadIds.current.add(item.id));
    if (kind === "gallery") setGalleryUploads((prev) => [...prev, ...items]);
    else setMenuUploads((prev) => [...prev, ...items]);
    void uploadBatch(items, kind);
  }

  async function uploadBatch(items: UploadItem[], kind: UploadKind) {
    try {
      const token = await tokenOrLogin();
      if (!token) return;
      const id = await ensureSubmissionId(token);
      const before = kind === "gallery" ? "images" : "menuImages";
      const next = await uploadSubmissionImages(
        id,
        items.map((item) => item.file),
        token,
        kind === "gallery" ? "images" : "menu",
      );
      const payload = next.payload ?? {};
      const urls = (payload[before] ?? []).slice(-items.length);
      const activeUrls = items
        .map((item, index) =>
          cancelledUploadIds.current.has(item.id) || !activeUploadIds.current.has(item.id)
            ? null
            : urls[index],
        )
        .filter((url): url is string => Boolean(url));
      if (activeUrls.length)
        setDraft((prev) => normalizeDraft(mergeUploadedUrls(prev, activeUrls, kind)));
      items.forEach((item, index) => {
        if (cancelledUploadIds.current.has(item.id) || !activeUploadIds.current.has(item.id))
          return;
        const remoteUrl = urls[index];
        if (!remoteUrl) {
          markUpload(kind, item.id, "failed");
          return;
        }
        markUploadUploaded(kind, item.id, remoteUrl);
        const displayUrl = cloudinaryImageUrl(remoteUrl, kind === "gallery" ? "gallery" : "menu");
        preload(displayUrl, () => swapDisplayUrl(kind, item.id, displayUrl));
      });
    } catch {
      items.forEach((item) => {
        activeUploadIds.current.delete(item.id);
        if (cancelledUploadIds.current.delete(item.id)) {
          setCancelledPendingCount((count) => Math.max(0, count - 1));
        } else {
          markUpload(kind, item.id, "failed");
        }
      });
      onError("Không tạo được draft để tải ảnh. Thử lại nhé.");
    } finally {
      items.forEach((item) => {
        if (cancelledUploadIds.current.delete(item.id))
          setCancelledPendingCount((count) => Math.max(0, count - 1));
        activeUploadIds.current.delete(item.id);
      });
    }
  }

  function removeUploadAt(kind: UploadKind, index: number) {
    const item = (kind === "gallery" ? galleryUploads : menuUploads)[index];
    if (!item) return;
    if (item.status === "uploading") {
      cancelledUploadIds.current.add(item.id);
      setCancelledPendingCount((count) => count + 1);
    }
    dropUploadItem(kind, item);
  }

  function dropUploadItem(kind: UploadKind, upload: UploadItem) {
    activeUploadIds.current.delete(upload.id);
    if (upload.payloadUrl) removeUploadedUrl(kind, upload.payloadUrl);
    if (previewUrls.current.delete(upload.displayUrl)) URL.revokeObjectURL(upload.displayUrl);
    const remove = (items: UploadItem[]) => items.filter((item) => item.id !== upload.id);
    if (kind === "gallery") setGalleryUploads(remove);
    else setMenuUploads(remove);
  }

  function markUpload(kind: UploadKind, id: string, status: UploadStatus) {
    const update = (items: UploadItem[]) =>
      items.map((item) => (item.id === id ? { ...item, status } : item));
    if (kind === "gallery") setGalleryUploads(update);
    else setMenuUploads(update);
  }

  function markUploadUploaded(kind: UploadKind, id: string, payloadUrl: string) {
    const update = (items: UploadItem[]) =>
      items.map((item) => (item.id === id ? { ...item, payloadUrl, status: undefined } : item));
    if (kind === "gallery") setGalleryUploads(update);
    else setMenuUploads(update);
  }

  function swapDisplayUrl(kind: UploadKind, id: string, displayUrl: string) {
    const update = (items: UploadItem[]) =>
      items.map((item) => {
        if (item.id !== id) return item;
        if (previewUrls.current.delete(item.displayUrl)) URL.revokeObjectURL(item.displayUrl);
        return { ...item, displayUrl };
      });
    if (kind === "gallery") setGalleryUploads(update);
    else setMenuUploads(update);
  }

  function removeUploadedUrl(kind: UploadKind, url: string) {
    setDraft((prev) => {
      if (kind === "menu")
        return { ...prev, menuImages: prev.menuImages?.filter((item) => item !== url) };
      const removeIndex = prev.images?.indexOf(url) ?? -1;
      return normalizeDraft({
        ...prev,
        images: prev.images?.filter((item) => item !== url),
        imageOrientations:
          removeIndex < 0
            ? prev.imageOrientations
            : prev.imageOrientations?.filter((_, index) => index !== removeIndex),
      });
    });
  }

  function moveGalleryUploadToFront(index: number) {
    const item = galleryUploads[index];
    const url = item?.payloadUrl;
    if (url) {
      setDraft((prev) => {
        const draftIndex = prev.images?.indexOf(url) ?? -1;
        return normalizeDraft({
          ...prev,
          images: moveToFront(prev.images ?? [], draftIndex),
          imageOrientations: moveToFront(prev.imageOrientations ?? [], draftIndex),
        });
      });
    }
    setGalleryUploads((prev) => moveToFront(prev, index));
  }

  function createUploadItem(file: File): UploadItem {
    if (isHeicFile(file)) {
      return {
        id: `${Date.now()}-${globalThis.crypto?.randomUUID?.() ?? Math.random()}`,
        file,
        displayUrl: createHeicPlaceholderDataUrl(file.name),
        status: "uploading",
      };
    }
    const previewUrl = URL.createObjectURL(file);
    previewUrls.current.add(previewUrl);
    return {
      id: `${Date.now()}-${globalThis.crypto?.randomUUID?.() ?? Math.random()}`,
      file,
      displayUrl: previewUrl,
      status: "uploading",
    };
  }
}

function uploadStatuses(items: UploadItem[]): Record<string, UploadStatus> {
  return Object.fromEntries(
    items.flatMap((item) => (item.status ? [[item.displayUrl, item.status]] : [])),
  );
}

function moveToFront<T>(items: T[], index: number) {
  if (index <= 0 || index >= items.length) return items;
  const next = [...items];
  const [item] = next.splice(index, 1);
  return [item, ...next];
}

function mergeUploadedUrls(prev: Draft, urlsToAdd: string[], kind: UploadKind): Draft {
  if (kind === "menu") {
    return { ...prev, menuImages: unique([...(prev.menuImages ?? []), ...urlsToAdd]) };
  }
  const existing = new Set(prev.images ?? []);
  const additions = urlsToAdd.filter((url) => url && !existing.has(url));
  const images = [...(prev.images ?? []), ...additions];
  return {
    ...prev,
    images,
    imageOrientations: [...(prev.imageOrientations ?? []), ...additions.map(() => "unknown")].slice(
      0,
      images.length,
    ),
  };
}

function unique(items: string[]) {
  return [...new Set(items.filter(Boolean))];
}

function preload(url: string, onLoad: () => void) {
  const image = new Image();
  image.onload = onLoad;
  image.src = url;
}
