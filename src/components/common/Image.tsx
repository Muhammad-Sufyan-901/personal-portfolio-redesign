import { useState, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

const DEFAULT_FALLBACK =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4 3"><rect width="4" height="3" fill="#1c1c1c"/></svg>',
  );

type ImageProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  /** eager = above the fold (hero); lazy = default */
  priority?: "eager" | "lazy";
  fallback?: string;
  sizes?: string;
} & Omit<ComponentPropsWithoutRef<"img">, "src" | "alt" | "width" | "height" | "loading">;

/** Image with loading skeleton (bg-raised pulse) and error fallback. */
export function Image({
  src,
  alt,
  width,
  height,
  objectFit = "cover",
  priority = "lazy",
  fallback = DEFAULT_FALLBACK,
  sizes,
  className,
  ...props
}: ImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  return (
    <img
      src={errored ? fallback : src}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      loading={priority}
      decoding={priority === "eager" ? "sync" : "async"}
      onLoad={() => setLoaded(true)}
      onError={() => setErrored(true)}
      className={cn(
        "bg-raised",
        !loaded && !errored && "animate-pulse",
        objectFit === "cover" && "object-cover",
        objectFit === "contain" && "object-contain",
        objectFit === "fill" && "object-fill",
        objectFit === "none" && "object-none",
        objectFit === "scale-down" && "object-scale-down",
        className,
      )}
      {...props}
    />
  );
}
