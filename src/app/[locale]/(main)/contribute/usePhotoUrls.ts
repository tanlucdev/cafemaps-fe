import { useEffect, useState } from "react";

export function usePhotoUrls(photos: File[]) {
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);

  useEffect(() => {
    const urls = photos.map((file) => URL.createObjectURL(file));
    setPhotoUrls(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [photos]);

  return photoUrls;
}
