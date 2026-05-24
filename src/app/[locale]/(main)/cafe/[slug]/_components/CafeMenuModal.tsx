"use client";

import Image from "next/image";
import Modal from "@/components/ui/Modal";

type CafeMenuModalProps = {
  open: boolean;
  onClose: () => void;
  cafeName: string;
};

const MOCK_MENU_IMAGE = "/mock/cafe-menu-sample.svg";

export default function CafeMenuModal({ open, onClose, cafeName }: CafeMenuModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Menu" size="lg">
      <div className="px-3 py-3 sm:px-5 sm:py-5">
        <div className="overflow-hidden rounded-2xl border border-(--border-light,#ECE4D6) bg-[#FAF6F1] dark:bg-[#241B15]">
          <Image
            src={MOCK_MENU_IMAGE}
            alt={`Menu ${cafeName}`}
            width={900}
            height={1200}
            className="h-auto w-full"
            unoptimized
            priority={false}
          />
        </div>
      </div>
    </Modal>
  );
}
