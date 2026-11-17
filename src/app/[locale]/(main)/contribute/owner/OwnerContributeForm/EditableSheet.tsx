"use client";

import { type ChangeEvent, type Dispatch, type SetStateAction } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { AMENITY_OPTIONS, PURPOSE_OPTIONS, TAG_OPTIONS, VIBE_OPTIONS } from "./taxonomy";
import {
  ChipSelect,
  GalleryEditor,
  MenuEditor,
  NumberInput,
  fieldsFor,
  inputClass,
  sheetTitle,
} from "./editable-controls";
import {
  limitWords,
  ONE_LINER_WORD_LIMIT,
  requiredFieldLabels,
  textFields,
  type Draft,
  type SectionId,
} from "./model";

type Props = {
  draft: Draft;
  setDraft: Dispatch<SetStateAction<Draft>>;
  sheet: SectionId | "gallery" | "menu" | null;
  isDesktopSheet: boolean;
  images: string[];
  menuImages: string[];
  imageKeys: string[];
  menuImageKeys: string[];
  imageStatuses: Record<string, "uploading" | "failed">;
  menuImageStatuses: Record<string, "uploading" | "failed">;
  imagesLocked: boolean;
  remainingGalleryImages: number;
  onClose: () => void;
  onFiles: (event: ChangeEvent<HTMLInputElement>, kind: "gallery" | "menu") => void;
  onRemoveGalleryImage: (index: number) => void;
  onMakeCover: (index: number) => void;
  onRemoveMenuImage: (index: number) => void;
  onReplaceImage: (index: number, kind: "gallery" | "menu", event: ChangeEvent<HTMLInputElement>) => void;
};

export function EditableSheet({
  draft,
  setDraft,
  sheet,
  isDesktopSheet,
  images,
  menuImages,
  imageKeys,
  menuImageKeys,
  imageStatuses,
  menuImageStatuses,
  imagesLocked,
  remainingGalleryImages,
  onClose,
  onFiles,
  onRemoveGalleryImage,
  onMakeCover,
  onRemoveMenuImage,
  onReplaceImage,
}: Props) {
  const updateText = (key: keyof Draft, value: string) =>
    setDraft((prev) => ({ ...prev, [key]: value }));
  const updateNumber = (key: keyof Draft, value: string) =>
    setDraft((prev) => ({ ...prev, [key]: value ? Number(value) : undefined }));
  const array = (key: "vibes" | "purposes" | "amenities" | "tags") => (value: string[]) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  return (
    <Sheet open={Boolean(sheet)} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side={isDesktopSheet ? "right" : "bottom"}
        overlayClassName="bg-[#2c1a0e]/18 backdrop-blur-none supports-backdrop-filter:backdrop-blur-[1px]"
        className="max-h-[min(88dvh,720px)] overflow-hidden rounded-t-[20px] border-[var(--border)] bg-[var(--contribute-surface)] p-0 shadow-[0_18px_60px_rgba(44,26,14,0.22)] md:h-full md:max-h-none md:w-[clamp(380px,32vw,460px)] md:max-w-none md:rounded-l-2xl md:rounded-r-none"
      >
        <SheetHeader className="sticky top-0 z-10 shrink-0 border-b border-[var(--border)] bg-[var(--contribute-surface)]/96 pr-14 backdrop-blur-[1px]">
          <SheetTitle className="font-[var(--font-lora)] text-xl font-bold">
            {sheetTitle(sheet)}
          </SheetTitle>
          <SheetDescription>Thay đổi được lưu ngay trên preview.</SheetDescription>
        </SheetHeader>
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4">{renderSheet()}</div>
        <div className="sticky bottom-0 z-10 shrink-0 border-t border-[var(--border)] bg-[var(--contribute-surface)]/96 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-[1px]">
          <button
            type="button"
            onClick={onClose}
            className="h-11 w-full rounded-full bg-[var(--accent)] px-5 text-sm font-black text-white shadow-[var(--shadow-sm)] transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/30"
          >
            Xong
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );

  function renderSheet() {
    switch (sheet) {
      case "gallery":
        return <GalleryEditor images={images} imageKeys={imageKeys} imageStatuses={imageStatuses} locked={imagesLocked} remainingImages={remainingGalleryImages} onFiles={onFiles} onRemove={onRemoveGalleryImage} onMakeCover={onMakeCover} onReplace={onReplaceImage} />;
      case "locationHours":
        return (
          <>
            {input("address")}
            {input("district")}
            {input("googleMapsUrl")}
            <div className="grid grid-cols-2 gap-3">{input("openingTime")}{input("closingTime")}</div>
            <div className="grid grid-cols-2 gap-3">
              <NumberInput label="Giá thấp" value={draft.priceMin} onChange={(v) => updateNumber("priceMin", v)} helper="Nhập VND, ví dụ 25000" />
              <NumberInput label="Giá cao" value={draft.priceMax} onChange={(v) => updateNumber("priceMax", v)} helper="Nhập VND, ví dụ 45000" />
            </div>
          </>
        );
      case "tags":
        return (
          <>
            <ChipSelect label="Vibe" options={VIBE_OPTIONS} value={draft.vibes} onChange={array("vibes")} allowCustom />
            <ChipSelect label="Phù hợp" options={PURPOSE_OPTIONS} value={draft.purposes} onChange={array("purposes")} allowCustom />
            <ChipSelect label="Tiện ích" options={AMENITY_OPTIONS} value={draft.amenities} onChange={array("amenities")} allowCustom />
            <ChipSelect label="Tags" options={TAG_OPTIONS} value={draft.tags} onChange={array("tags")} allowCustom />
          </>
        );
      case "menu":
        return <MenuEditor images={menuImages} imageKeys={menuImageKeys} imageStatuses={menuImageStatuses} locked={imagesLocked} onFiles={onFiles} onRemove={onRemoveMenuImage} onReplace={onReplaceImage} />;
      case "basics":
        return <>{input("name")}{input("oneLiner")}{input("description", true)}</>;
      case "ownerDetails":
        return fieldsFor(sheet).map((key) => input(key, key === "ownerProofNote" || key === "note"));
      default:
        return null;
    }
  }

  function input(key: keyof Draft, multiline = false) {
    const field = textFields.find((item) => item.key === key);
    if (!field) return null;
    const Input = multiline ? "textarea" : "input";
    const value = (draft[field.key] as string | undefined) ?? "";
    const wordCount = value.match(/\S+/g)?.length ?? 0;
    const wordLimit = field.key === "oneLiner" ? ONE_LINER_WORD_LIMIT : undefined;
    return (
      <label key={field.key} className="block text-xs font-bold">
        {field.label}{requiredFieldLabels[field.key] ? " *" : ""}
        <Input
          value={value}
          placeholder={field.placeholder}
          onChange={(event) =>
            updateText(field.key, wordLimit ? limitWords(event.target.value, wordLimit) : event.target.value)
          }
          className={inputClass}
          data-owner-focus={field.key}
          aria-describedby={wordLimit ? `${field.key}-word-limit` : undefined}
          {...(multiline ? { rows: 5 } : {})}
        />
        {wordLimit && (
          <span
            id={`${field.key}-word-limit`}
            className="mt-1 block text-right text-[11px] font-semibold text-[var(--foreground-muted)]"
            aria-live="polite"
          >
            {wordCount}/{wordLimit} từ
          </span>
        )}
      </label>
    );
  }
}
