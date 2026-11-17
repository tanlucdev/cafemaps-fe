import Image, { type ImageProps } from "next/image";
import { cloudinaryImageUrl, type CloudinaryImagePreset } from "@/lib/cloudinary-image";

function shouldSkipOptimization(src: string) {
  return src.startsWith("blob:") || src.startsWith("data:");
}

export default function GalleryImage({
  src,
  alt,
  fill,
  width,
  height,
  sizes,
  quality,
  priority,
  unoptimized,
  style,
  cloudinaryPreset,
  ...props
}: ImageProps & { cloudinaryPreset?: CloudinaryImagePreset }) {
  if (typeof src === "string" && shouldSkipOptimization(src)) {
    const imgStyle = fill
      ? { ...style, position: "absolute" as const, inset: 0, height: "100%", width: "100%" }
      : style;
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        {...props}
        src={src}
        alt={alt}
        width={typeof width === "number" ? width : undefined}
        height={typeof height === "number" ? height : undefined}
        style={imgStyle}
      />
    );
  }

  return (
    <Image
      {...props}
      src={typeof src === "string" && cloudinaryPreset ? cloudinaryImageUrl(src, cloudinaryPreset) : src}
      alt={alt}
      fill={fill}
      width={width}
      height={height}
      sizes={sizes}
      quality={quality}
      priority={priority}
      unoptimized={unoptimized}
      style={style}
    />
  );
}
