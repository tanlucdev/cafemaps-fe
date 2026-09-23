"use client";

import { type ChangeEvent, type FormEvent, useState } from "react";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { IMAGE_FILE_ACCEPT } from "../../contribute-form.helpers";
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
        <span key={item} className="rounded-full border border-[var(--border)] bg-white/70 px-3 py-1 text-xs font-bold text-[var(--foreground-muted)] dark:bg-white/5">
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
              onClick={() => onChange(active ? value.filter((item) => item !== option) : [...value, option])}
              className={cn(
                "min-h-11 rounded-full border border-[var(--border)] px-3 py-2 text-xs font-bold transition focus-visible:border-[#c8842a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(200,132,42,0.18)] lg:min-h-0 lg:py-1.5",
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
            className="mt-1 h-11 shrink-0 rounded-full bg-[#c8842a] px-5 text-xs font-black text-white shadow-[0_8px_20px_rgba(200,132,42,0.28)] transition hover:bg-[#a86616] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(200,132,42,0.28)] lg:h-10"
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
      {helper && <span className="mt-1 block text-[11px] font-semibold text-[var(--foreground-muted)]">{helper}</span>}
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
  onReplace: (index: number, kind: "gallery" | "menu", event: ChangeEvent<HTMLInputElement>) => void;
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
      <ImageGrid images={images} imageKeys={imageKeys} imageStatuses={imageStatuses} locked={locked} kind="gallery" onRemove={onRemove} onMakeCover={onMakeCover} onReplace={onReplace} />
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
  onReplace: (index: number, kind: "gallery" | "menu", event: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="space-y-3">
      <UploadButton id="owner-menu-upload" label="Thêm menu" onFiles={(event) => onFiles(event, "menu")} disabled={locked} />
      <ImageGrid images={images} imageKeys={imageKeys} imageStatuses={imageStatuses} locked={locked} kind="menu" onRemove={onRemove} onReplace={onReplace} />
    </div>
  );
}
export function UploadButton({ id, label, onFiles, className, multiple = true, disabled = false }: {
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
          "inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--border)] px-4 text-sm font-bold focus-visible:border-[#c8842a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(200,132,42,0.18)] disabled:cursor-not-allowed disabled:opacity-55 lg:min-h-10",
          className,
        )}
      >
        <ImagePlus size={16} /> {label}
      </button>
      <input id={id} type="file" accept={IMAGE_FILE_ACCEPT} multiple={multiple} disabled={disabled} hidden onChange={onFiles} />
    </>
  );
}

function ImageGrid({
  images,
  imageKeys,
  imageStatuses,
  locked,
  kind,
  onRemove,
  onMakeCover,
  onReplace,
}: {
  images: string[];
  imageKeys: string[];
  imageStatuses: Record<string, "uploading" | "failed">;
  locked: boolean;
  kind: "gallery" | "menu";
  onRemove: (index: number) => void;
  onMakeCover?: (index: number) => void;
  onReplace: (index: number, kind: "gallery" | "menu", event: ChangeEvent<HTMLInputElement>) => void;
}) {
  if (!images.length) return <p className="text-sm text-[var(--foreground-muted)]">Chưa có ảnh.</p>;
  return (
    <div className="grid grid-cols-2 gap-2">
      {images.map((src, index) => {
        const status = imageStatuses[src];
        const replaceId = `replace-${kind}-${index}`;
        return (
          <div key={imageKeys[index] ?? `${src}-${index}`} className="relative aspect-square overflow-hidden rounded-xl bg-[var(--contribute-surface-soft)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className={cn("h-full w-full object-cover", status === "failed" && "opacity-45")} />
            {status === "uploading" && (
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/20 text-sm font-black text-white">
                <Loader2 className="size-4 animate-spin" /> Đang tải
              </div>
            )}
            {status === "failed" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-red-950/50 p-3 text-white">
                <p className="text-sm font-black">Tải lỗi</p>
                <div className="flex gap-2">
                  <button type="button" disabled={locked} onClick={() => onRemove(index)} className="h-8 rounded-full bg-white px-3 text-xs font-black text-red-700 disabled:opacity-55">Xoá</button>
                  <button type="button" disabled={locked} onClick={() => document.getElementById(replaceId)?.click()} className="h-8 rounded-full bg-white px-3 text-xs font-black text-[#6f4300] disabled:opacity-55">Chọn lại</button>
                </div>
                <input id={replaceId} type="file" accept={IMAGE_FILE_ACCEPT} disabled={locked} hidden onChange={(event) => onReplace(index, kind, event)} />
              </div>
            )}
            {!status && (
              <div className="absolute inset-x-2 bottom-2 flex gap-2">
                {onMakeCover && (
                  <button type="button" disabled={locked} onClick={() => onMakeCover(index)} className="h-8 flex-1 rounded-full bg-white/90 px-2 text-xs font-bold disabled:opacity-55">
                    {index === 0 ? "Bìa" : "Đặt bìa"}
                  </button>
                )}
                <button type="button" disabled={locked} onClick={() => onRemove(index)} aria-label="Xoá ảnh" className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-red-600 disabled:opacity-55">
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
