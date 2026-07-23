"use client";

import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";

import { MaterialIcon } from "@/components/MaterialIcon";

type ItemMediaGalleryProps = {
  src?: string | null;
  alt: string;
  /** Thumb/frame classes (size, radius, aspect). */
  className?: string;
  /** Image element classes when `src` is set. */
  imageClassName?: string;
  /** Icon size class for the empty placeholder. */
  placeholderIconClassName?: string;
};

/**
 * Item media: transparent icon placeholder, or media that opens a full-size lightbox on click.
 */
export function ItemMediaGallery({
  src,
  alt,
  className = "relative h-24 w-28 shrink-0 overflow-hidden rounded-lg",
  imageClassName = "h-full w-full object-cover transition-transform duration-500 group-hover/media:scale-105",
  placeholderIconClassName = "text-[28px] opacity-50",
}: ItemMediaGalleryProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const titleId = useId();
  const url = src?.trim() || null;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <>
      {url ? (
        <button
          type="button"
          className={`${className} group/media cursor-zoom-in border border-outline-variant/15 bg-transparent p-0 dark:border-outline-variant/10`}
          onClick={() => setOpen(true)}
          aria-label={`Открыть изображение: ${alt}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt={alt}
            className={imageClassName}
            loading="lazy"
          />
        </button>
      ) : (
        <div
          className={`${className} flex items-center justify-center border border-dashed border-outline-variant/25 bg-transparent text-outline dark:border-outline-variant/20`}
          aria-hidden
        >
          <MaterialIcon name="image" className={placeholderIconClassName} />
        </div>
      )}

      {mounted && open && url
        ? createPortal(
            <div
              className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4 backdrop-blur-[2px]"
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              onClick={() => setOpen(false)}
            >
              <button
                type="button"
                className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white transition-colors hover:bg-black/60"
                onClick={() => setOpen(false)}
                aria-label="Закрыть"
              >
                <MaterialIcon name="close" className="text-[22px]" />
              </button>
              <p id={titleId} className="sr-only">
                {alt}
              </p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={alt}
                className="max-h-[90vh] max-w-[min(96vw,1100px)] object-contain shadow-2xl"
                onClick={event => event.stopPropagation()}
              />
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
