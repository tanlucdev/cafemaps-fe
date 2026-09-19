"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Modal from "@/components/ui/Modal";

type CafeMenuModalProps = {
  open: boolean;
  onClose: () => void;
  cafeName: string;
  menuImages: string[];
};

export default function CafeMenuModal({ open, onClose, cafeName, menuImages }: CafeMenuModalProps) {
  const [page, setPage] = useState(0);
  const pageCount = menuImages.length;
  const menuImage = menuImages[page] ?? menuImages[0];

  useEffect(() => {
    if (open) setPage(0);
  }, [open]);

  if (!menuImage) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Menu"
      size="lg"
      className="max-h-[calc(100svh-1rem)] sm:max-h-[calc(100svh-2rem)]"
      contentClassName="overflow-hidden"
    >
      <div className="flex min-h-0 flex-col items-center justify-center gap-3 px-3 py-3 sm:px-5 sm:py-5">
        <div className="flex min-h-0 items-center justify-center overflow-hidden rounded-2xl border border-(--border-light,#ECE4D6) bg-[#FAF6F1] dark:bg-[#241B15]">
          <Image
            src={menuImage}
            alt={`Menu ${cafeName} page ${page + 1}`}
            width={900}
            height={1200}
            className="h-auto max-h-[calc(100svh-9rem)] w-auto max-w-full object-contain sm:max-h-[calc(100svh-11rem)]"
            unoptimized
            priority={false}
          />
        </div>
        {pageCount > 1 && (
          <div className="flex w-full items-center justify-center gap-3">
            <button
              className="grid h-9 w-9 place-items-center rounded-full border border-[var(--border)] bg-white/80 disabled:opacity-40 dark:bg-[var(--card)]"
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              type="button"
              aria-label="Previous menu page"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex min-w-0 max-w-full items-center gap-1.5 overflow-x-auto py-1">
              {menuImages.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setPage(index)}
                  className={`h-2.5 rounded-full transition-all ${
                    index === page ? "w-6 bg-[var(--accent)]" : "w-2.5 bg-[var(--border)]"
                  }`}
                  aria-label={`Menu page ${index + 1}`}
                />
              ))}
            </div>
            <span className="min-w-14 text-center text-xs font-bold text-[var(--foreground-muted)]">{page + 1}/{pageCount}</span>
            <button
              className="grid h-9 w-9 place-items-center rounded-full border border-[var(--border)] bg-white/80 disabled:opacity-40 dark:bg-[var(--card)]"
              disabled={page === pageCount - 1}
              onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
              type="button"
              aria-label="Next menu page"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}
