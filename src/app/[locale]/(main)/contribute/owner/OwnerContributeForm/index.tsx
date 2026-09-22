"use client";

import { type ChangeEvent, useState } from "react";
import { CheckCircle2, Eye, Loader2 } from "lucide-react";
import { ApiError, isUnauthorizedError } from "@/apis/http";
import {
  createSubmission,
  submitSubmission,
  updateSubmission,
  uploadSubmissionImage,
  type CafeSubmissionPayload,
} from "@/apis/submissions";
import { getCurrentAccessToken, saveAuthReturnUrl } from "@/lib/auth-client";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { MAX_IMAGE_BYTES } from "../../contribute-form.constants";
import { isAllowedImageFile } from "../../contribute-form.helpers";
import { usePhotoUrls } from "../../usePhotoUrls";
import { EditableDetailPane } from "./EditableDetailPane";
import { emptyDraft, getRequiredItems, REQUIRED_PREVIEW_MESSAGE, type Draft } from "./model";
import { OwnerFieldOverviewSheet } from "./OwnerFieldOverviewSheet";
import { PreviewPane } from "./PreviewPane";

export default function ContributeForm() {
  const router = useRouter();
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [menuFiles, setMenuFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requiredItems = getRequiredItems(draft, (draft.images?.length ?? 0) + galleryFiles.length);
  const missingRequiredCount = requiredItems.filter((item) => !item.done).length;
  const canPreview = missingRequiredCount === 0;
  const queuedImageUrls = usePhotoUrls(galleryFiles);
  const queuedMenuUrls = usePhotoUrls(menuFiles);
  const previewImages = [...(draft.images ?? []), ...queuedImageUrls];
  const previewMenuImages = [...(draft.menuImages ?? []), ...queuedMenuUrls];

  async function tokenOrLogin() {
    const token = await getCurrentAccessToken();
    if (token) return token;
    saveAuthReturnUrl();
    router.push("/login");
    return null;
  }

  async function saveDraft(token: string) {
    const normalizedDraft = normalizeDraft(draft);
    setDraft(normalizedDraft);
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
    setSubmissionId(submission.id);
    if (submission.payload) setDraft((prev) => ({ ...prev, ...submission.payload }));
    return submission.id;
  }

  async function uploadQueued(token: string, id: string) {
    let payload = normalizeDraft(draft);
    for (const file of galleryFiles) {
      const next = await uploadSubmissionImage(id, file, token, "images");
      payload = normalizeDraft({ ...payload, ...next.payload });
      setDraft(payload);
    }
    for (const file of menuFiles) {
      const next = await uploadSubmissionImage(id, file, token, "menu");
      payload = normalizeDraft({ ...payload, ...next.payload });
      setDraft(payload);
    }
    setGalleryFiles([]);
    setMenuFiles([]);
    return payload;
  }

  async function persist(uploadOnly = false) {
    if (loading) return;
    setError(null);
    if (!canPreview) {
      setError(REQUIRED_PREVIEW_MESSAGE);
      return;
    }
    setLoading(true);
    try {
      const token = await tokenOrLogin();
      if (!token) return;
      const id = await saveDraft(token);
      const payload = normalizeDraft(await uploadQueued(token, id));
      setDraft(payload);
      await updateSubmission(
        id,
        {
          name: payload.name || draft.name || "",
          submissionType: "owner",
          address: payload.address || draft.address || undefined,
          googleMapsUrl: payload.googleMapsUrl || draft.googleMapsUrl || undefined,
          note: draft.note || undefined,
          payload,
        },
        token,
      );
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
    const files = selected.filter(isAllowedImageFile);
    const oversized = selected.length - files.length;
    if (oversized) setError(`Ảnh phải nhỏ hơn ${MAX_IMAGE_BYTES / 1024 / 1024}MB.`);
    if (kind === "gallery") setGalleryFiles((prev) => [...prev, ...files].slice(0, 12));
    else setMenuFiles((prev) => [...prev, ...files]);
    event.target.value = "";
  };

  const removeGalleryImage = (index: number) => {
    const savedCount = draft.images?.length ?? 0;
    if (index < savedCount) {
      setDraft((prev) =>
        normalizeDraft({
          ...prev,
          images: prev.images?.filter((_, itemIndex) => itemIndex !== index),
          imageOrientations: prev.imageOrientations?.filter((_, itemIndex) => itemIndex !== index),
        }),
      );
      return;
    }
    setGalleryFiles((prev) => prev.filter((_, itemIndex) => itemIndex !== index - savedCount));
  };

  const makeCover = (index: number) => {
    const savedCount = draft.images?.length ?? 0;
    if (index < savedCount) {
      setDraft((prev) =>
        normalizeDraft({
          ...prev,
          images: moveToFront(prev.images ?? [], index),
          imageOrientations: moveToFront(prev.imageOrientations ?? [], index),
        }),
      );
      return;
    }
    setGalleryFiles((prev) => moveToFront(prev, index - savedCount));
  };

  const removeMenuImage = (index: number) => {
    const savedCount = draft.menuImages?.length ?? 0;
    if (index < savedCount) {
      setDraft((prev) => ({
        ...prev,
        menuImages: prev.menuImages?.filter((_, itemIndex) => itemIndex !== index),
      }));
      return;
    }
    setMenuFiles((prev) => prev.filter((_, itemIndex) => itemIndex !== index - savedCount));
  };

  const openReview = () => {
    setError(null);
    if (!canPreview) {
      setError(REQUIRED_PREVIEW_MESSAGE);
      return;
    }
    setReviewing(true);
  };

  if (done) {
    return (
      <div className="rounded-[24px] border border-[var(--border)] bg-[var(--contribute-surface)] p-6 shadow-[var(--contribute-panel-shadow)]">
        <CheckCircle2 className="mb-4 size-10 text-[var(--accent)]" />
        <h2 className="font-lora text-2xl font-bold">Đã gửi draft cho admin duyệt</h2>
        <p className="mt-2 text-sm text-[var(--foreground-muted)]">
          Sau khi admin duyệt, quán sẽ nằm trong list quán dưới dạng draft chưa publish.
        </p>
      </div>
    );
  }

  if (reviewing) {
    return (
      <div className="min-w-0 max-w-full space-y-4 overflow-x-hidden pb-[calc(var(--mobile-bottom-nav-height)+env(safe-area-inset-bottom,0px)+112px)]">
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
            disabled={loading}
            onClick={() => persist(false)}
          >
            {loading ? "Đang gửi..." : "Gửi duyệt"}
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
        canSubmit={canPreview}
        error={error}
        onFiles={onFiles}
        onRemoveGalleryImage={removeGalleryImage}
        onMakeCover={makeCover}
        onRemoveMenuImage={removeMenuImage}
      />
      <div className="fixed right-4 bottom-[calc(var(--mobile-bottom-nav-height)+env(safe-area-inset-bottom,0px)+12px)] left-4 z-40 sm:right-6 sm:left-auto sm:w-[min(420px,calc(100vw-3rem))] lg:right-[max(1.5rem,calc((100vw-80rem)/2))] lg:bottom-6">
        <button
          type="button"
          disabled={!canPreview || loading}
          onClick={openReview}
          className={cn(
            "inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-5 text-sm font-bold text-white shadow-[0_18px_50px_rgba(44,26,14,0.18)] transition hover:bg-[var(--accent-hover)]",
            (!canPreview || loading) && "cursor-not-allowed opacity-55",
          )}
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : <Eye size={16} />}
          {loading ? "Đang tải..." : canPreview ? "Xem lại" : `Còn ${missingRequiredCount} mục cần thêm`}
        </button>
      </div>
    </div>
  );
}

function moveToFront<T>(items: T[], index: number) {
  if (index <= 0 || index >= items.length) return items;
  const next = [...items];
  const [item] = next.splice(index, 1);
  return [item, ...next];
}

function normalizeDraft(draft: Draft): Draft {
  const images = draft.images ?? [];
  const coverImage = images[0];
  return {
    ...draft,
    images,
    imageOrientations: (draft.imageOrientations ?? []).slice(0, images.length),
    coverImage,
    coverImageCrop: coverImage
      ? coverImage === draft.coverImage
        ? (draft.coverImageCrop ?? { x: 50, y: 50 })
        : { x: 50, y: 50 }
      : null,
  };
}
