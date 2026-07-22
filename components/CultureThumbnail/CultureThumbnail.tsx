import type { CultureChipIcon, CultureOption } from "@/lib/culture-options";
import { resolveMediaUrl } from "@/lib/culture-options";

type CultureIconSource = Pick<CultureOption, "label" | "icon">;

type CultureThumbnailProps = {
  option: CultureIconSource;
  size?: number;
  /** `tile` — sidebar list; `inline` — compact glyph in pills/tabs. */
  variant?: "tile" | "inline";
};

/**
 * Culture list icon priority: LOGO PNG → chip emoji.
 * Never PREVIEW / IMAGE_M (option.preview).
 */
function pickLogoUrl(icon: CultureChipIcon): string | null {
  if (icon.kind !== "MEDIA" || !icon.image?.url) {
    return null;
  }
  return resolveMediaUrl(icon.image.url);
}

function chipEmoji(icon: CultureChipIcon): string {
  return icon.emoji?.trim() || "🌱";
}

export function CultureThumbnail({
  option,
  size = 48,
  variant = "tile",
}: CultureThumbnailProps) {
  const logoUrl = pickLogoUrl(option.icon);
  const emoji = chipEmoji(option.icon);

  if (variant === "inline") {
    if (logoUrl) {
      return (
        // next/image does not optimize SVG; keep crisp vector/PNG for chip LOGO.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logoUrl}
          alt=""
          width={size}
          height={size}
          aria-hidden
          className="shrink-0 object-contain"
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

  if (logoUrl) {
    return (
      <div
        className="relative shrink-0 overflow-hidden rounded-lg bg-surface-container-high p-2"
        style={{ width: size, height: size }}
      >
        {/* next/image does not optimize SVG; keep crisp vector for chip LOGO. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoUrl}
          alt={option.label}
          width={size}
          height={size}
          className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
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
