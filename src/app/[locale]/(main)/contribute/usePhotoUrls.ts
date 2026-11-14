import { useEffect, useState } from "react";
import { createHeicPlaceholderDataUrl, isHeicFile } from "./contribute-form.helpers";

export function usePhotoUrls(photos: File[]) {
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    const blobUrls: string[] = [];
    const initialUrls = photos.map((file) => {
      if (isHeicFile(file)) return createHeicPlaceholderDataUrl(file.name);
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
          return createHeicPlaceholderDataUrl(file.name, "failed");
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
