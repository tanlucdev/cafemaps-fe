"use client";

import { type Dispatch, type SetStateAction, useEffect, useRef, useState } from "react";
import {
  deleteSubmissionAsset,
  persistSubmissionAsset,
  signSubmissionAssets,
  uploadSignedSubmissionAsset,
  type SubmissionAssetField,
} from "@/apis/submissions";
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
type AssetRef = { submissionId: string; token: string; publicId: string };
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
  const activeUploadIds = useRef(new Set<string>());
  const controllers = useRef(new Map<string, AbortController>());
  const assets = useRef(new Map<string, AssetRef>());
  const persistedAssets = useRef(new Map<string, AssetRef>());
  const previewUrls = useRef(new Set<string>());
  const uploads = [...galleryUploads, ...menuUploads];

  useEffect(
    () => () => {
      controllers.current.forEach((controller) => controller.abort());
      assets.current.forEach(
        (asset) => void deleteSubmissionAsset(asset.submissionId, asset.token, asset.publicId),
      );
      previewUrls.current.forEach((url) => URL.revokeObjectURL(url));
    },
    [],
  );

  return {
    galleryUploads,
    menuUploads,
    imageStatuses: uploadStatuses(galleryUploads),
    menuImageStatuses: uploadStatuses(menuUploads),
    hasUploadPending: uploads.some((item) => item.status === "uploading"),
    hasUploadFailed: uploads.some((item) => item.status === "failed"),
    startUploads,
    removeUploadAt,
    removePersistedAsset,
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
      if (!token) throw new Error("Login required");
      const submissionId = await ensureSubmissionId(token);
      const field: SubmissionAssetField = kind === "gallery" ? "images" : "menuImages";
      const signed = await signSubmissionAssets(
        submissionId,
        token,
        items.map(() => field),
      );
      if (signed.assets.length !== items.length) throw new Error("Signature count mismatch");

      await mapLimit(items, 2, async (item, index) => {
        const signature = signed.assets[index];
        const asset = {
          submissionId,
          token,
          publicId: `${signature.params.folder}/${signature.params.public_id}`,
        };
        assets.current.set(item.id, asset);
        if (!activeUploadIds.current.has(item.id)) return cleanup(item.id);

        const controller = new AbortController();
        controllers.current.set(item.id, controller);
        try {
          const uploaded = await uploadSignedSubmissionAsset(
            item.file,
            { ...signed, ...signature },
            controller.signal,
          );
          if (uploaded.publicId !== asset.publicId)
            throw new Error("Cloudinary public ID mismatch");
          if (!activeUploadIds.current.has(item.id)) return cleanup(item.id);
          await persistSubmissionAsset(submissionId, token, uploaded, controller.signal);
          if (!activeUploadIds.current.has(item.id)) return cleanup(item.id);
          assets.current.delete(item.id);
          persistedAssets.current.set(uploaded.secureUrl, asset);
          setDraft((prev) => normalizeDraft(mergeUploadedUrl(prev, uploaded.secureUrl, kind)));
          markUploadUploaded(kind, item.id, uploaded.secureUrl);
          const displayUrl = cloudinaryImageUrl(
            uploaded.secureUrl,
            kind === "gallery" ? "gallery" : "menu",
          );
          preload(displayUrl, () => swapDisplayUrl(kind, item.id, displayUrl));
        } catch (error) {
          await cleanup(item.id);
          if (activeUploadIds.current.has(item.id) && !isAbort(error))
            markUpload(kind, item.id, "failed");
        } finally {
          controllers.current.delete(item.id);
          activeUploadIds.current.delete(item.id);
        }
      });
    } catch {
      items.forEach((item) => {
        void cleanup(item.id);
        if (activeUploadIds.current.has(item.id)) markUpload(kind, item.id, "failed");
        activeUploadIds.current.delete(item.id);
      });
      onError("Không thể tải ảnh. Thử lại nhé.");
    }
  }

  function removeUploadAt(kind: UploadKind, index: number) {
    const item = (kind === "gallery" ? galleryUploads : menuUploads)[index];
    if (!item) return;
    activeUploadIds.current.delete(item.id);
    controllers.current.get(item.id)?.abort();
    void cleanup(item.id);
    if (item.payloadUrl) {
      removeUploadedUrl(kind, item.payloadUrl);
      void removePersistedAsset(item.payloadUrl);
    }
    if (previewUrls.current.delete(item.displayUrl)) URL.revokeObjectURL(item.displayUrl);
    const remove = (items: UploadItem[]) => items.filter((current) => current.id !== item.id);
    if (kind === "gallery") setGalleryUploads(remove);
    else setMenuUploads(remove);
  }

  async function cleanup(uploadId: string) {
    const asset = assets.current.get(uploadId);
    if (!asset) return;
    assets.current.delete(uploadId);
    try {
      await deleteSubmissionAsset(asset.submissionId, asset.token, asset.publicId);
    } catch {
      onError("Không thể dọn ảnh đã tải. Thử lại sau nhé.");
    }
  }

  async function removePersistedAsset(url: string) {
    const asset = persistedAssets.current.get(url);
    if (!asset) return;
    persistedAssets.current.delete(url);
    try {
      await deleteSubmissionAsset(asset.submissionId, asset.token, asset.publicId);
    } catch {
      onError("Không thể xoá ảnh đã tải. Thử lại nhé.");
    }
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
    const url = galleryUploads[index]?.payloadUrl;
    if (url)
      setDraft((prev) => {
        const draftIndex = prev.images?.indexOf(url) ?? -1;
        return normalizeDraft({
          ...prev,
          images: moveToFront(prev.images ?? [], draftIndex),
          imageOrientations: moveToFront(prev.imageOrientations ?? [], draftIndex),
        });
      });
    setGalleryUploads((prev) => moveToFront(prev, index));
  }

  function createUploadItem(file: File): UploadItem {
    const id = `${Date.now()}-${globalThis.crypto?.randomUUID?.() ?? Math.random()}`;
    if (isHeicFile(file))
      return { id, file, displayUrl: createHeicPlaceholderDataUrl(file.name), status: "uploading" };
    const displayUrl = URL.createObjectURL(file);
    previewUrls.current.add(displayUrl);
    return { id, file, displayUrl, status: "uploading" };
  }
}

function isAbort(error: unknown) {
  return error instanceof DOMException && error.name === "AbortError";
}
function uploadStatuses(items: UploadItem[]): Record<string, UploadStatus> {
  return Object.fromEntries(
    items.flatMap((item) => (item.status ? [[item.displayUrl, item.status]] : [])),
  );
}
function moveToFront<T>(items: T[], index: number) {
  if (index <= 0 || index >= items.length) return items;
  const next = [...items];
  return [next.splice(index, 1)[0], ...next];
}
function mergeUploadedUrl(prev: Draft, url: string, kind: UploadKind): Draft {
  if (kind === "menu") return { ...prev, menuImages: unique([...(prev.menuImages ?? []), url]) };
  if (prev.images?.includes(url)) return prev;
  const images = [...(prev.images ?? []), url];
  return {
    ...prev,
    images,
    imageOrientations: [...(prev.imageOrientations ?? []), "unknown"].slice(0, images.length),
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
async function mapLimit<T>(
  items: T[],
  limit: number,
  task: (item: T, index: number) => Promise<void>,
) {
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (next < items.length) {
        const index = next++;
        await task(items[index], index);
      }
    }),
  );
}
