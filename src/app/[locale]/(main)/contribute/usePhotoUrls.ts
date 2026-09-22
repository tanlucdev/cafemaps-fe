import { useEffect, useState } from "react";
import { isHeicFile } from "./contribute-form.helpers";

export function usePhotoUrls(photos: File[]) {
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    const blobUrls: string[] = [];
    const initialUrls = photos.map((file) => {
      if (isHeicFile(file)) return heicPreviewDataUrl(file.name, true);
      const url = URL.createObjectURL(file);
      blobUrls.push(url);
      return url;
    });

    setPhotoUrls(initialUrls);

    void Promise.all(
      photos.map(async (file, index) => {
        if (!isHeicFile(file)) return initialUrls[index];
        try {
          const url = await createHeicPreviewUrl(file);
          if (cancelled) {
            URL.revokeObjectURL(url);
            return initialUrls[index];
          }
          blobUrls.push(url);
          return url;
        } catch {
          return heicPreviewDataUrl(file.name, false);
        }
      }),
    ).then((urls) => {
      if (!cancelled) setPhotoUrls(urls);
    });

    return () => {
      cancelled = true;
      blobUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [photos]);

  return photoUrls;
}

async function createHeicPreviewUrl(file: File) {
  const { default: heic2any } = await import("heic2any");
  // ponytail: preview decode stays on the main thread; move to a Worker if batch HEIC decode janks.
  const converted = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.82 });
  const blob = Array.isArray(converted) ? converted[0] : converted;
  return URL.createObjectURL(blob);
}

function heicPreviewDataUrl(fileName: string, loading: boolean) {
  const safeName = fileName.replace(/[<>&]/g, "");
  const title = loading ? "Đang tạo preview HEIC" : "Không tạo được preview HEIC";
  const subtitle = loading ? "File gốc vẫn sẽ được gửi khi submit" : "Thử ảnh khác hoặc submit để server xử lý";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><rect width="1200" height="800" fill="#f6efe3"/><rect x="42" y="42" width="1116" height="716" rx="36" fill="#fffaf2" stroke="#e8d7bd" stroke-width="4"/><text x="600" y="360" text-anchor="middle" font-family="Arial, sans-serif" font-size="54" font-weight="700" fill="#7a5633">${title}</text><text x="600" y="430" text-anchor="middle" font-family="Arial, sans-serif" font-size="32" fill="#8c6d4f">${subtitle}</text><text x="600" y="492" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="#9b856c">${safeName}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
