"use client";

import { type ChangeEvent, type FormEvent, useState } from "react";
import { ImagePlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { IMAGE_FILE_ACCEPT } from "../../contribute-form.helpers";
import { ImageGrid } from "./ImageGrid";
import type { Draft, SectionId } from "./model";

export function sheetTitle(sheet: SectionId | "gallery" | "menu" | null) {
  const titles: Record<SectionId | "gallery" | "menu", string> = {
    gallery: "Thêm ảnh quán",
    menu: "Thêm menu",
    basics: "Thêm thông tin quán",
    locationHours: "Thêm địa chỉ & giờ",
    tags: "Làm quán hấp dẫn hơn",
    ownerDetails: "Admin xác thực",
  };
  return sheet ? titles[sheet] : "";
}

export function fieldsFor(sheet: SectionId | "gallery" | "menu" | null): (keyof Draft)[] {
  switch (sheet) {
    case "basics":
      return ["name", "oneLiner", "description"];
    case "locationHours":
      return ["address", "district", "googleMapsUrl", "openingTime", "closingTime"];
    case "ownerDetails":
      return [
        "parkingLocation",
        "signatureDrink",
        "instagramUrl",
        "ownerName",
        "ownerRole",
        "ownerPhone",
        "ownerEmail",
        "ownerProofNote",
        "note",
      ];
    default:
      return [];
  }
}

export const previewMutedClass = "text-sm font-medium text-[var(--foreground-muted)]";
export const inputClass =
  "mt-1 min-h-11 w-full appearance-none rounded-xl border border-[var(--border)] bg-[#fffdf8] px-3 py-2 text-[16px] font-medium !outline-none transition focus:!rounded-xl focus:!border-[#8f5a16] focus:bg-white focus:!shadow-none focus:!ring-0 focus-visible:!rounded-xl focus-visible:!border-[#8f5a16] focus-visible:!outline-none lg:min-h-0 lg:text-sm dark:bg-white/5";

export function ChipRow({ items, empty }: { items: string[]; empty: string }) {
  if (!items.length) return <p className={previewMutedClass}>{empty}</p>;
  return (
    <div className="flex flex-wrap gap-2">
      {items.slice(0, 12).map((item) => (
        <span
          key={item}
          className="rounded-full border border-[var(--border)] bg-white/70 px-3 py-1 text-xs font-bold text-[var(--foreground-muted)] dark:bg-white/5"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

export function ChipSelect({
  label,
  options,
  value = [],
  onChange,
  allowCustom,
}: {
  label: string;
  options: readonly string[];
  value?: string[];
  onChange: (value: string[]) => void;
  allowCustom?: boolean;
}) {
  const [customValue, setCustomValue] = useState("");
  const customOptions = value.filter((item) => !options.includes(item));

  function addCustom(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextValue = customValue.trim();
    if (!nextValue || value.includes(nextValue)) return;
    onChange([...value, nextValue]);
    setCustomValue("");
  }

  return (
    <div className="space-y-2">
      <p className="text-xs font-bold">{label}</p>
      <div className="flex flex-wrap gap-2">
        {[...options, ...customOptions].map((option) => {
          const active = value.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() =>
                onChange(active ? value.filter((item) => item !== option) : [...value, option])
              }
              className={cn(
                "min-h-11 rounded-full border border-[var(--border)] px-3 py-2 text-xs font-bold transition focus-visible:border-[#c8842a] focus-visible:ring-2 focus-visible:ring-[rgba(200,132,42,0.18)] focus-visible:outline-none lg:min-h-0 lg:py-1.5",
                active && "border-[var(--accent)] bg-[var(--accent)] text-white",
              )}
              aria-pressed={active}
            >
              {option}
            </button>
          );
        })}
      </div>
      {allowCustom && (
        <form onSubmit={addCustom} className="flex gap-2">
          <input
            value={customValue}
            onChange={(event) => setCustomValue(event.target.value)}
            placeholder={`Thêm ${label.toLowerCase()}`}
            aria-label={`Thêm ${label.toLowerCase()}`}
            className={inputClass}
          />
          <button
            type="submit"
            className="mt-1 h-11 shrink-0 rounded-full bg-[#c8842a] px-5 text-xs font-black text-white shadow-[0_8px_20px_rgba(200,132,42,0.28)] transition hover:bg-[#a86616] focus-visible:ring-2 focus-visible:ring-[rgba(200,132,42,0.28)] focus-visible:outline-none lg:h-10"
          >
            Thêm
          </button>
        </form>
      )}
    </div>
  );
}

export function NumberInput({
  label,
  value,
  onChange,
  helper,
}: {
  label: string;
  value?: number;
  onChange: (value: string) => void;
  helper?: string;
}) {
  return (
    <label className="block text-xs font-bold">
      {label}
      <input
        type="number"
        inputMode="numeric"
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        className={inputClass}
      />
      {helper && (
        <span className="mt-1 block text-[11px] font-semibold text-[var(--foreground-muted)]">
          {helper}
        </span>
      )}
    </label>
  );
}
export function GalleryEditor({
  images,
  imageKeys,
  imageStatuses,
  locked,
  remainingImages,
  onFiles,
  onRemove,
  onMakeCover,
  onReplace,
}: {
  images: string[];
  imageKeys: string[];
  imageStatuses: Record<string, "uploading" | "failed">;
  locked: boolean;
  remainingImages: number;
  onFiles: (event: ChangeEvent<HTMLInputElement>, kind: "gallery" | "menu") => void;
  onRemove: (index: number) => void;
  onMakeCover: (index: number) => void;
  onReplace: (
    index: number,
    kind: "gallery" | "menu",
    event: ChangeEvent<HTMLInputElement>,
  ) => void;
}) {
  return (
    <div className="space-y-3">
      <UploadButton
        id="owner-gallery-upload"
        label="Chọn ảnh"
        onFiles={(event) => onFiles(event, "gallery")}
        multiple={remainingImages > 1}
        disabled={locked || !remainingImages}
        className="border-[var(--accent)] bg-[var(--accent)] text-white shadow-[var(--shadow-sm)] hover:brightness-95"
      />
      <ImageGrid
        images={images}
        imageKeys={imageKeys}
        imageStatuses={imageStatuses}
        locked={locked}
        kind="gallery"
        onRemove={onRemove}
        onMakeCover={onMakeCover}
        onReplace={onReplace}
      />
    </div>
  );
}

export function MenuEditor({
  images,
  imageKeys,
  imageStatuses,
  locked,
  onFiles,
  onRemove,
  onReplace,
}: {
  images: string[];
  imageKeys: string[];
  imageStatuses: Record<string, "uploading" | "failed">;
  locked: boolean;
  onFiles: (event: ChangeEvent<HTMLInputElement>, kind: "gallery" | "menu") => void;
  onRemove: (index: number) => void;
  onReplace: (
    index: number,
    kind: "gallery" | "menu",
    event: ChangeEvent<HTMLInputElement>,
  ) => void;
}) {
  return (
    <div className="space-y-3">
      <UploadButton
        id="owner-menu-upload"
        label="Thêm menu"
        onFiles={(event) => onFiles(event, "menu")}
        disabled={locked}
      />
      <ImageGrid
        images={images}
        imageKeys={imageKeys}
        imageStatuses={imageStatuses}
        locked={locked}
        kind="menu"
        onRemove={onRemove}
        onReplace={onReplace}
      />
    </div>
  );
}
export function UploadButton({
  id,
  label,
  onFiles,
  className,
  multiple = true,
  disabled = false,
}: {
  id: string;
  label: string;
  onFiles: (event: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  multiple?: boolean;
  disabled?: boolean;
}) {
  return (
    <>
      <button
        type="button"
        onClick={() => document.getElementById(id)?.click()}
        disabled={disabled}
        className={cn(
          "inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--border)] px-4 text-sm font-bold focus-visible:border-[#c8842a] focus-visible:ring-2 focus-visible:ring-[rgba(200,132,42,0.18)] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-55 lg:min-h-10",
          className,
        )}
      >
        <ImagePlus size={16} /> {label}
      </button>
      <input
        id={id}
        type="file"
        accept={IMAGE_FILE_ACCEPT}
        multiple={multiple}
        disabled={disabled}
        hidden
        onChange={onFiles}
      />
    </>
  );
}
