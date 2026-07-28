import type { ContentMedia } from "@/lib/content-api";
import type { CultureChipIcon, CultureOption } from "@/lib/culture-options";
import { resolveMediaUrl } from "@/lib/culture-options";

type CultureIconSource = Pick<CultureOption, "label"> & {
  icon?: CultureChipIcon | null;
  preview?: ContentMedia | null;
  tagKey?: string;
  hubSlug?: string;
};

type CultureThumbnailProps = {
  option: CultureIconSource;
  size?: number;
  /** `tile` — sidebar list; `inline` — compact glyph in pills/tabs. */
  variant?: "tile" | "inline";
};

const DEFAULT_CROP_PREVIEW_MAP: Record<string, string> = {
  "crop.tomato": "/previews/tomato.jpg",
  tomat: "/previews/tomato.jpg",
  "crop.zucchini": "/previews/zucchini.jpg",
  kabachok: "/previews/zucchini.jpg",
  "crop.eggplant": "/previews/eggplant.jpg",
  baklazhan: "/previews/eggplant.jpg",
  "crop.cucumber": "/previews/cucumber.jpg",
  ogurec: "/previews/cucumber.jpg",
};

/**
 * Culture list image priority:
 * 1. icon.image.url (MEDIA icon)
 * 2. option.preview.url (ContentMedia)
 * 3. Default crop photo preview fallback (/previews/*.jpg)
 */
function pickImageUrl(option: CultureIconSource): string | null {
  if (option.icon?.kind === "MEDIA" && option.icon.image?.url) {
    return resolveMediaUrl(option.icon.image.url);
  }
  if (option.preview?.url) {
    return resolveMediaUrl(option.preview.url);
  }
  if (option.tagKey && DEFAULT_CROP_PREVIEW_MAP[option.tagKey]) {
    return DEFAULT_CROP_PREVIEW_MAP[option.tagKey];
  }
  if (option.hubSlug && DEFAULT_CROP_PREVIEW_MAP[option.hubSlug]) {
    return DEFAULT_CROP_PREVIEW_MAP[option.hubSlug];
  }
  return null;
}

function chipEmoji(icon?: CultureChipIcon | null): string {
  return icon?.emoji?.trim() || "🌱";
}

export function CultureThumbnail({
  option,
  size = 48,
  variant = "tile",
}: CultureThumbnailProps) {
  const imageUrl = pickImageUrl(option);
  const emoji = chipEmoji(option.icon);

  if (variant === "inline") {
    if (imageUrl) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt=""
          width={size}
          height={size}
          aria-hidden
          className="shrink-0 rounded-full object-cover"
          style={{ width: size, height: size }}
        />
      );
    }

    return (
      <span className="shrink-0 text-base leading-none" aria-hidden>
        {emoji}
      </span>
    );
  }

  if (imageUrl) {
    return (
      <div
        className="relative shrink-0 overflow-hidden rounded-lg bg-surface-container-high border border-outline-variant/10 dark:border-outline-variant/15"
        style={{ width: size, height: size }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={option.label}
          width={size}
          height={size}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
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
