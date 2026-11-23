"use client";
import { type ChangeEvent, useEffect, useRef, useState } from "react";
import { Eye, Loader2 } from "lucide-react";
import { ApiError, isUnauthorizedError } from "@/apis/http";
import {
  createSubmission,
  submitSubmission,
  updateSubmission,
  type CafeSubmissionPayload,
} from "@/apis/submissions";
import { getCurrentAccessToken, saveAuthReturnUrl } from "@/lib/auth-client";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { MAX_IMAGE_BYTES } from "../../contribute-form.constants";
import { isAllowedImageFile } from "../../contribute-form.helpers";
import { EditableDetailPane } from "./EditableDetailPane";
import {
  limitOwnerGalleryFiles,
  ownerGalleryLimitMessage,
  remainingOwnerGalleryImages,
} from "./image-limits";
import {
  emptyDraft,
  getRequiredItems,
  moveToFront,
  normalizeDraft,
  REQUIRED_PREVIEW_MESSAGE,
  type Draft,
} from "./model";
import { OwnerFieldOverviewSheet } from "./OwnerFieldOverviewSheet";
import { DonePanel, PreviewPane } from "./PreviewPane";
import { type UploadKind, useImageUploads } from "./useImageUploads";
export default function ContributeForm() {
  const router = useRouter();
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const draftIdPromise = useRef<Promise<string> | null>(null);
  const {
    galleryUploads,
    menuUploads,
    imageStatuses,
    menuImageStatuses,
    hasUploadPending,
    hasUploadFailed,
    startUploads,
    isBlocked,
    removePersistedAsset,
    removeUploadAt,
    moveGalleryUploadToFront,
  } = useImageUploads({
    tokenOrLogin,
    ensureSubmissionId,
    setDraft,
    draft,
    onError: setError,
  });
  const requiredItems = getRequiredItems(
    draft,
    (draft.images?.length ?? 0) + galleryUploads.filter((item) => !item.payloadUrl).length,
  );
  const missingRequiredCount = requiredItems.filter((item) => !item.done).length;
  const canPreview = missingRequiredCount === 0;
  const galleryShadowUrls = new Set(galleryUploads.map((item) => item.payloadUrl).filter(Boolean));
  const menuShadowUrls = new Set(menuUploads.map((item) => item.payloadUrl).filter(Boolean));
  const savedImages = (draft.images ?? []).filter((url) => !galleryShadowUrls.has(url));
  const savedMenuImages = (draft.menuImages ?? []).filter((url) => !menuShadowUrls.has(url));
  const previewImages = [...savedImages, ...galleryUploads.map((item) => item.displayUrl)];
  const previewMenuImages = [...savedMenuImages, ...menuUploads.map((item) => item.displayUrl)];
  const previewImageKeys = [...savedImages, ...galleryUploads.map((item) => item.id)];
  const previewMenuImageKeys = [...savedMenuImages, ...menuUploads.map((item) => item.id)];
  async function tokenOrLogin() {
    const token = await getCurrentAccessToken();
    if (token) return token;
    saveAuthReturnUrl();
    router.push("/login");
    return null;
  }
  async function saveDraft(token: string) {
    const normalizedDraft = normalizeDraft(draft);
    const payload: CafeSubmissionPayload = { ...normalizedDraft };
    delete (payload as Draft).note;
    const data = {
      name: normalizedDraft.name?.trim() || "",
      submissionType: "owner" as const,
      address: normalizedDraft.address?.trim() || undefined,
      googleMapsUrl: normalizedDraft.googleMapsUrl?.trim() || undefined,
      note: normalizedDraft.note?.trim() || undefined,
      payload,
    };
    const submission = submissionId
      ? await updateSubmission(submissionId, data, token)
      : await createSubmission(data, token);
    if (mounted.current) setSubmissionId(submission.id);
    return submission.id;
  }
  async function ensureSubmissionId(token: string) {
    if (submissionId) return submissionId;
    draftIdPromise.current ??= saveDraft(token).finally(() => {
      draftIdPromise.current = null;
    });
    return draftIdPromise.current;
  }
  async function persist(uploadOnly = false) {
    if (loading) return;
    setError(null);
    if (!canPreview) {
      setError(REQUIRED_PREVIEW_MESSAGE);
      return;
    }
    if (isBlocked()) {
      setError(
        hasUploadPending
          ? "Đợi ảnh tải xong rồi gửi duyệt."
          : "Xoá hoặc chọn lại ảnh tải lỗi rồi gửi duyệt.",
      );
      return;
    }
    setLoading(true);
    try {
      const token = await tokenOrLogin();
      if (!token) return;
      if (isBlocked()) return;
      const id = await saveDraft(token);
      if (!uploadOnly) {
        await submitSubmission(id, token);
        setDone(true);
      }
    } catch (caught) {
      if (isUnauthorizedError(caught)) {
        saveAuthReturnUrl();
        router.push("/login");
        return;
      }
      setError(
        caught instanceof ApiError
          ? "Không gửi được draft. Thử lại nhé."
          : (caught as Error).message,
      );
    } finally {
      setLoading(false);
    }
  }
  const onFiles = (event: ChangeEvent<HTMLInputElement>, kind: "gallery" | "menu") => {
    const selected = Array.from(event.target.files ?? []);
    let files = selected.filter(isAllowedImageFile);
    if (selected.length - files.length)
      setError(`Ảnh không hợp lệ hoặc lớn hơn ${MAX_IMAGE_BYTES / 1024 / 1024}MB.`);
    if (kind === "gallery") {
      const remaining = remainingOwnerGalleryImages(previewImages.length);
      const accepted = limitOwnerGalleryFiles(files, previewImages.length);
      if (accepted.length < files.length) setError(ownerGalleryLimitMessage(remaining));
      files = accepted;
    }
    startUploads(files, kind);
    event.target.value = "";
  };
  const removeGalleryImage = (index: number) => {
    const savedCount = savedImages.length;
    if (index < savedCount) {
      const url = savedImages[index];
      removePersistedAsset("gallery", url);
      return;
    }
    removeUploadAt("gallery", index - savedCount);
  };
  const makeCover = (index: number) => {
    const savedCount = savedImages.length;
    if (index < savedCount) {
      const draftIndex = draft.images?.indexOf(savedImages[index]) ?? -1;
      setDraft((prev) =>
        normalizeDraft({
          ...prev,
          images: moveToFront(prev.images ?? [], draftIndex),
          imageOrientations: moveToFront(prev.imageOrientations ?? [], draftIndex),
        }),
      );
      return;
    }
    moveGalleryUploadToFront(index - savedCount);
  };
  const removeMenuImage = (index: number) => {
    const savedCount = savedMenuImages.length;
    if (index < savedCount) {
      const url = savedMenuImages[index];
      removePersistedAsset("menu", url);
      return;
    }
    removeUploadAt("menu", index - savedCount);
  };
  const replaceUploadImage = (
    index: number,
    kind: UploadKind,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const [file] = Array.from(event.target.files ?? []).filter(isAllowedImageFile);
    event.target.value = "";
    if (!file) {
      setError(`Ảnh không hợp lệ hoặc lớn hơn ${MAX_IMAGE_BYTES / 1024 / 1024}MB.`);
      return;
    }
    const savedCount = kind === "gallery" ? savedImages.length : savedMenuImages.length;
    removeUploadAt(kind, index - savedCount);
    setError(null);
    startUploads([file], kind);
  };
  const openReview = () => {
    setError(null);
    if (!canPreview) {
      setError(REQUIRED_PREVIEW_MESSAGE);
      return;
    }
    setReviewing(true);
  };
  if (done) return <DonePanel />;
  if (reviewing) {
    return (
      <div className="max-w-full min-w-0 space-y-4 overflow-x-hidden pb-[calc(var(--mobile-bottom-nav-height)+env(safe-area-inset-bottom,0px)+112px)]">
        <PreviewPane draft={draft} images={previewImages} menuImages={previewMenuImages} />
        {error && (
          <p className="rounded-xl border border-red-300 bg-red-50 p-3 text-sm font-semibold text-red-700">
            {error}
          </p>
        )}
        <div className="fixed right-4 bottom-[calc(var(--mobile-bottom-nav-height)+env(safe-area-inset-bottom,0px)+12px)] left-4 z-40 flex gap-3 rounded-[24px] border border-[var(--border)] bg-[var(--contribute-surface)]/94 p-2 shadow-[0_18px_50px_rgba(44,26,14,0.18)] backdrop-blur-xl sm:right-6 sm:left-auto sm:w-[min(420px,calc(100vw-3rem))] lg:right-[max(1.5rem,calc((100vw-80rem)/2))] lg:bottom-6">
          <button
            type="button"
            className="inline-flex h-11 cursor-pointer items-center justify-center rounded-full border border-[var(--border)] px-5 text-sm font-bold"
            onClick={() => setReviewing(false)}
          >
            Chỉnh sửa
          </button>
          <button
            type="button"
            className="inline-flex h-11 flex-1 cursor-pointer items-center justify-center rounded-full bg-[var(--accent)] px-5 text-sm font-bold text-white disabled:opacity-55"
            disabled={loading || hasUploadPending || hasUploadFailed}
            onClick={() => persist(false)}
          >
            {loading
              ? "Đang gửi..."
              : hasUploadPending
                ? "Đang tải ảnh..."
                : hasUploadFailed
                  ? "Sửa ảnh lỗi"
                  : "Gửi duyệt"}
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="min-w-0">
      <OwnerFieldOverviewSheet />
      <EditableDetailPane
        draft={draft}
        setDraft={setDraft}
        images={previewImages}
        menuImages={previewMenuImages}
        imageKeys={previewImageKeys}
        menuImageKeys={previewMenuImageKeys}
        imageStatuses={imageStatuses}
        menuImageStatuses={menuImageStatuses}
        imagesLocked={loading}
        canSubmit={canPreview}
        error={error}
        onFiles={onFiles}
        onRemoveGalleryImage={removeGalleryImage}
        onMakeCover={makeCover}
        onRemoveMenuImage={removeMenuImage}
        onReplaceImage={replaceUploadImage}
      />
      <div className="fixed right-4 bottom-[calc(var(--mobile-bottom-nav-height)+env(safe-area-inset-bottom,0px)+12px)] left-4 z-40 sm:right-6 sm:left-auto sm:w-[min(420px,calc(100vw-3rem))] lg:right-[max(1.5rem,calc((100vw-80rem)/2))] lg:bottom-6">
        <button
          type="button"
          disabled={!canPreview || loading || hasUploadPending || hasUploadFailed}
          onClick={openReview}
          className={cn(
            "inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-5 text-sm font-bold text-white shadow-[0_18px_50px_rgba(44,26,14,0.18)] transition hover:bg-[var(--accent-hover)]",
            (!canPreview || loading || hasUploadPending || hasUploadFailed) &&
              "cursor-not-allowed opacity-55",
          )}
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : <Eye size={16} />}
          {loading || hasUploadPending
            ? "Đang tải..."
            : hasUploadFailed
              ? "Sửa ảnh lỗi"
              : canPreview
                ? "Xem lại"
                : `Còn ${missingRequiredCount} mục cần thêm`}
        </button>
      </div>
    </div>
  );
}
