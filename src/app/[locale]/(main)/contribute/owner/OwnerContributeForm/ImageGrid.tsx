"use client";

import { type ChangeEvent } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { IMAGE_FILE_ACCEPT } from "../../contribute-form.helpers";

export function ImageGrid({
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
  onReplace: (
    index: number,
    kind: "gallery" | "menu",
    event: ChangeEvent<HTMLInputElement>,
  ) => void;
}) {
  if (!images.length) return <p className="text-sm text-[var(--foreground-muted)]">Chưa có ảnh.</p>;
  return (
    <div className="grid grid-cols-2 gap-2">
      {images.map((src, index) => (
        <ImageTile
          key={imageKeys[index] ?? `${src}-${index}`}
          {...{ src, index, imageStatuses, locked, kind, onRemove, onMakeCover, onReplace }}
        />
      ))}
    </div>
  );
}

function ImageTile({
  src,
  index,
  imageStatuses,
  locked,
  kind,
  onRemove,
  onMakeCover,
  onReplace,
}: {
  src: string;
  index: number;
  imageStatuses: Record<string, "uploading" | "failed">;
  locked: boolean;
  kind: "gallery" | "menu";
  onRemove: (index: number) => void;
  onMakeCover?: (index: number) => void;
  onReplace: (
    index: number,
    kind: "gallery" | "menu",
    event: ChangeEvent<HTMLInputElement>,
  ) => void;
}) {
  const status = imageStatuses[src];
  const replaceId = `replace-${kind}-${index}`;
  return (
    <div className="relative aspect-square overflow-hidden rounded-xl bg-[var(--contribute-surface-soft)]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        className={cn("h-full w-full object-cover", status === "failed" && "opacity-45")}
      />
      {status === "uploading" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/20 text-sm font-black text-white">
          <span className="flex items-center gap-2">
            <Loader2 className="size-4 animate-spin" /> Đang tải
          </span>
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="h-8 rounded-full bg-white px-3 text-xs font-black text-red-700"
          >
            Huỷ
          </button>
        </div>
      )}
      {status === "failed" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-red-950/50 p-3 text-white">
          <p className="text-sm font-black">Tải lỗi</p>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={locked}
              onClick={() => onRemove(index)}
              className="h-8 rounded-full bg-white px-3 text-xs font-black text-red-700 disabled:opacity-55"
            >
              Xoá
            </button>
            <button
              type="button"
              disabled={locked}
              onClick={() => document.getElementById(replaceId)?.click()}
              className="h-8 rounded-full bg-white px-3 text-xs font-black text-[#6f4300] disabled:opacity-55"
            >
              Chọn lại
            </button>
          </div>
          <input
            id={replaceId}
            type="file"
            accept={IMAGE_FILE_ACCEPT}
            disabled={locked}
            hidden
            onChange={(event) => onReplace(index, kind, event)}
          />
        </div>
      )}
      {!status && (
        <div className="absolute inset-x-2 bottom-2 flex gap-2">
          {onMakeCover && (
            <button
              type="button"
              disabled={locked}
              onClick={() => onMakeCover(index)}
              className="h-8 flex-1 rounded-full bg-white/90 px-2 text-xs font-bold disabled:opacity-55"
            >
              {index === 0 ? "Bìa" : "Đặt bìa"}
            </button>
          )}
          <button
            type="button"
            disabled={locked}
            onClick={() => onRemove(index)}
            aria-label="Xoá ảnh"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-red-600 disabled:opacity-55"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
