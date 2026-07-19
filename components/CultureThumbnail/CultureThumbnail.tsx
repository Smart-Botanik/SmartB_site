import Image from "next/image";

import type { CultureOption } from "@/lib/culture-options";
import { resolveMediaUrl } from "@/lib/culture-options";

type CultureThumbnailProps = {
  option: CultureOption;
  size?: number;
};

function pickThumbnailUrl(option: CultureOption): string | null {
  if (option.preview?.url) {
    return resolveMediaUrl(option.preview.url);
  }

  if (option.icon.kind === "MEDIA" && option.icon.image?.url) {
    return resolveMediaUrl(option.icon.image.url);
  }

  return null;
}

export function CultureThumbnail({ option, size = 48 }: CultureThumbnailProps) {
  const imageUrl = pickThumbnailUrl(option);
  const emoji = option.icon.emoji?.trim() || "🌱";

  if (imageUrl) {
    return (
      <div
        className="relative shrink-0 overflow-hidden rounded-lg"
        style={{ width: size, height: size }}
      >
        <Image
          src={imageUrl}
          alt={option.label}
          fill
          sizes={`${size}px`}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
    );
  }

  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-lg bg-surface-container-high text-2xl leading-none"
      style={{ width: size, height: size }}
      aria-hidden
    >
      {emoji}
    </div>
  );
}
