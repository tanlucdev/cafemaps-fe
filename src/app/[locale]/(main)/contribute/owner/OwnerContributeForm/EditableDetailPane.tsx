"use client";

import { type ChangeEvent, type Dispatch, type SetStateAction, useEffect, useState } from "react";
import { BookOpen, MapPinned } from "lucide-react";
import SmartGallery from "@/components/SmartGallery";
import { cn } from "@/lib/utils";
import { getRequiredItems, type Draft, type FocusKey, type SectionId } from "./model";
import { ChipRow, UploadButton, previewMutedClass } from "./editable-controls";
import { EditableSheet } from "./EditableSheet";
import { FormGroup, RequiredMiniBlock, RequiredProgress, SoftActionBlock } from "./required-controls";

type Props = {
  draft: Draft;
  setDraft: Dispatch<SetStateAction<Draft>>;
  images: string[];
  menuImages: string[];
  canSubmit: boolean;
  error: string | null;
  onFiles: (event: ChangeEvent<HTMLInputElement>, kind: "gallery" | "menu") => void;
  onRemoveGalleryImage: (index: number) => void;
  onMakeCover: (index: number) => void;
  onRemoveMenuImage: (index: number) => void;
};

export function EditableDetailPane({
  draft,
  setDraft,
  images,
  menuImages,
  canSubmit,
  error,
  onFiles,
  onRemoveGalleryImage,
  onMakeCover,
  onRemoveMenuImage,
}: Props) {
  const [sheet, setSheet] = useState<SectionId | "gallery" | "menu" | null>(null);
  const isDesktopSheet = useMediaQuery("(min-width: 768px)");
  const requiredItems = getRequiredItems(draft, images.length);
  const missingItems = requiredItems.filter((item) => !item.done);
  const updateText = (key: keyof Draft, value: string) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  function openSection(section: SectionId | "gallery" | "menu") {
    setSheet(section);
  }

  function openRequired(section: SectionId | "gallery", nextFocusKey: FocusKey) {
    if (section === "gallery") {
      openSection(section);
      return;
    }
    window.setTimeout(() => {
      document
        .querySelector<HTMLElement>(`[data-owner-focus="${nextFocusKey}"]`)
        ?.scrollIntoView({ block: "center", behavior: "smooth" });
    }, 0);
  }

  function closeSheet() {
    setSheet(null);
  }

  return (
    <section className="mx-auto w-full max-w-[760px] space-y-4 pb-[calc(var(--mobile-bottom-nav-height)+env(safe-area-inset-bottom)+104px)] sm:space-y-5">
      <RequiredProgress items={requiredItems} onOpen={openRequired} />

      <div className="group relative overflow-hidden rounded-[18px] border border-[#ffe3b7]/38 bg-white/48 p-1 shadow-[0_22px_62px_rgba(44,26,14,0.10)] backdrop-blur-md sm:rounded-[24px] sm:p-1.5 dark:border-[#ffe3b7]/14 dark:bg-[#1b0f08]/48">
        {images.length ? (
          <SmartGallery
            images={images}
            orientations={draft.imageOrientations ?? []}
            coverImageCrop={draft.coverImageCrop}
            cafeName={draft.name || "Cafe preview"}
          />
        ) : (
          <UploadButton
            id="owner-gallery-empty-upload"
            label="Chọn ảnh"
            onFiles={(event) => onFiles(event, "gallery")}
            className="aspect-4/5 h-auto w-full flex-col justify-center gap-3 rounded-2xl border-dashed bg-[var(--contribute-surface-soft)] text-[var(--foreground-muted)] md:aspect-[16/9]"
          />
        )}
        {images.length > 0 && (
          <button
            type="button"
            onClick={() => openSection("gallery")}
            className="absolute top-3 right-3 rounded-full border border-[var(--border)] bg-white/90 px-3 py-1.5 text-xs font-black text-[var(--foreground-muted)] opacity-100 shadow-[var(--shadow-sm)] backdrop-blur-md transition hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(200,132,42,0.18)] md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100"
          >
            Sửa
          </button>
        )}
      </div>

      <div className="space-y-4 rounded-[20px] border border-[#ffe3b7]/38 bg-[#fffaf2]/76 px-3 py-4 shadow-[0_18px_54px_rgba(44,26,14,0.08)] backdrop-blur-md sm:space-y-5 sm:rounded-[28px] sm:px-6 sm:py-5 dark:border-[#ffe3b7]/14 dark:bg-[#1b0f08]/54">
        <FormGroup title="Bắt buộc để xem lại">
          <label className="block rounded-2xl border border-[var(--border)] bg-white/42 p-4 transition focus-within:border-[#8f5a16] dark:bg-white/5">
            <span className="mb-2 block text-xs font-black uppercase text-[var(--foreground-muted)]">Tên quán *</span>
            <input
              value={draft.name ?? ""}
              onChange={(event) => updateText("name", event.target.value)}
              placeholder="Nhập tên quán"
              data-owner-focus="name"
              className="w-full min-w-0 appearance-none border-0 bg-transparent font-[var(--font-lora)] text-[clamp(1.6rem,8vw,3.2rem)] leading-[1.12] font-bold !outline-none placeholder:text-[var(--foreground-muted)] focus:!border-transparent focus:!shadow-none focus:!ring-0 focus-visible:!border-transparent focus-visible:!outline-none focus-visible:!shadow-none focus-visible:!ring-0 md:text-[clamp(2rem,4.8vw,3.2rem)]"
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <InlineCard title="Giờ mở / đóng">
              <div className="grid grid-cols-2 gap-3">
                <SmallInput label="Mở *" value={draft.openingTime ?? ""} placeholder="07:00" focusKey="openingTime" onChange={(value) => updateText("openingTime", value)} />
                <SmallInput label="Đóng *" value={draft.closingTime ?? ""} placeholder="22:00" focusKey="closingTime" onChange={(value) => updateText("closingTime", value)} />
              </div>
            </InlineCard>
            <InlineCard title="Địa chỉ / Maps">
              <SmallInput label="Địa chỉ hoặc Google Maps *" value={draft.address ?? ""} placeholder="Nhập địa chỉ" focusKey="address" onChange={(value) => updateText("address", value)} icon />
              <SmallInput label="Maps URL" value={draft.googleMapsUrl ?? ""} placeholder="Dán link Google Maps" focusKey="googleMapsUrl" onChange={(value) => updateText("googleMapsUrl", value)} />
            </InlineCard>
          </div>
        </FormGroup>

        <FormGroup title="Làm quán hấp dẫn hơn">
          <SoftActionBlock onEdit={() => openSection("basics")} label={draft.oneLiner?.trim() || draft.description?.trim() ? "Sửa" : "Thêm"}>
            <p className={previewMutedClass}>{draft.oneLiner?.trim() || "Thêm một dòng giới thiệu"}</p>
            <p className={cn("mt-3 whitespace-pre-line leading-6", previewMutedClass)}>
              {draft.description?.trim() || "Thêm mô tả"}
            </p>
          </SoftActionBlock>
          <SoftActionBlock onEdit={() => openSection("tags")} label={(draft.vibes?.length || draft.purposes?.length || draft.amenities?.length) ? "Sửa" : "Chọn"}>
            <ChipRow items={[...(draft.vibes ?? []), ...(draft.purposes ?? []), ...(draft.amenities ?? [])]} empty="Chọn vibe, phù hợp, tiện ích" />
          </SoftActionBlock>
          <div className="grid gap-3 sm:grid-cols-2">
            <RequiredMiniBlock onEdit={() => openSection("ownerDetails")} title="Gửi xe">
              {draft.parkingLocation?.trim() || "Thêm gửi xe"}
            </RequiredMiniBlock>
            <RequiredMiniBlock onEdit={() => openSection("ownerDetails")} title="Món / Instagram">
              {draft.signatureDrink?.trim() || draft.instagramUrl?.trim() || "Thêm món nổi bật"}
            </RequiredMiniBlock>
          </div>
        </FormGroup>

        <div className="flex items-center justify-between gap-3">
          {menuImages.length > 0 ? (
            <button
              type="button"
              onClick={() => openSection("menu")}
              className={cn("inline-flex items-center gap-2 rounded-full focus-visible:border-[#c8842a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(200,132,42,0.18)]", previewMutedClass)}
            >
              <BookOpen size={16} /> {menuImages.length} ảnh menu
            </button>
          ) : (
            <UploadButton
              id="owner-menu-direct-upload"
              label="Thêm menu"
              onFiles={(event) => onFiles(event, "menu")}
              className="border-transparent px-0 text-[var(--foreground-muted)]"
            />
          )}
          {menuImages.length > 0 && (
            <button
              type="button"
              onClick={() => openSection("menu")}
              className="h-9 rounded-full border border-[var(--border)] px-3 text-xs font-bold text-[var(--foreground-muted)] focus-visible:border-[#c8842a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(200,132,42,0.18)]"
            >
              Quản lý
            </button>
          )}
        </div>

        <FormGroup title="Admin xác thực">
          <SoftActionBlock onEdit={() => openSection("ownerDetails")} label={draft.ownerName?.trim() || draft.ownerProofNote?.trim() || draft.note?.trim() ? "Sửa" : "Thêm"}>
            <p className={previewMutedClass}>
              {[draft.ownerName, draft.ownerRole, draft.ownerPhone, draft.ownerEmail]
                .filter(Boolean)
                .join(" · ") || "Thêm liên hệ owner"}
            </p>
            <p className={cn("mt-2 whitespace-pre-line", previewMutedClass)}>
              {[draft.ownerProofNote, draft.note].filter(Boolean).join("\n") || "Thêm proof / note admin"}
            </p>
          </SoftActionBlock>
        </FormGroup>
      </div>

      {error && (
        <div className="rounded-xl border border-red-300 bg-red-50 p-3 text-sm font-semibold text-red-700">
          <p>{error}</p>
          {missingItems.length > 0 && (
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {missingItems.map((item) => <li key={item.key}>{item.label}</li>)}
            </ul>
          )}
        </div>
      )}
      {!canSubmit && <p className="text-xs text-[var(--foreground-muted)]">Còn {missingItems.length} mục cần thêm.</p>}

      <EditableSheet
        draft={draft}
        setDraft={setDraft}
        sheet={sheet}
        isDesktopSheet={isDesktopSheet}
        images={images}
        menuImages={menuImages}
        onClose={closeSheet}
        onFiles={onFiles}
        onRemoveGalleryImage={onRemoveGalleryImage}
        onMakeCover={onMakeCover}
        onRemoveMenuImage={onRemoveMenuImage}
      />
    </section>
  );
}

function InlineCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-white/42 p-3 transition focus-within:border-[#8f5a16] sm:rounded-2xl sm:p-4 dark:bg-white/5">
      <p className="mb-3 text-xs font-black text-[var(--foreground)]">{title}</p>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function SmallInput({
  label,
  value,
  placeholder,
  focusKey,
  onChange,
  icon,
}: {
  label: string;
  value: string;
  placeholder: string;
  focusKey: FocusKey;
  onChange: (value: string) => void;
  icon?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-black text-[var(--foreground-muted)]">{label}</span>
      <span className="flex min-h-10 items-center gap-2 rounded-xl border border-[var(--border)] bg-white/60 px-2.5 py-1.5 transition focus-within:border-[#8f5a16] lg:min-h-0 dark:bg-white/5">
        {icon && <MapPinned size={14} className="shrink-0 text-[var(--foreground-muted)]" />}
        <input
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          data-owner-focus={focusKey}
          className="min-w-0 flex-1 appearance-none border-0 bg-transparent text-[16px] font-semibold !outline-none placeholder:text-[var(--foreground-muted)] focus:!border-transparent focus:!shadow-none focus:!ring-0 focus-visible:!border-transparent focus-visible:!outline-none focus-visible:!shadow-none focus-visible:!ring-0 lg:text-[13px]"
        />
      </span>
    </label>
  );
}

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    const sync = () => setMatches(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, [query]);

  return matches;
}
