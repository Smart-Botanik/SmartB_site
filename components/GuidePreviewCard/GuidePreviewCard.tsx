import Link from "next/link";

import { EngagementBar } from "@/components/EngagementBar";
import {
  CROP_KIND_LABELS,
  getGuidePreviewImage,
  parseGuideMeta,
  type CropGuide,
  type GuideScope,
} from "@/lib/content-api";
import type { EngagementStatsDto } from "@/lib/engagement";
import { guideArticleHref, type GuideLinkVariant } from "@/lib/guide-view-paths";

export type GuidePreviewCardSize = "small" | "middle" | "big";
export type GuidePreviewLayout = "card" | "list";

function ScopeBadge({ scope }: { scope: GuideScope }) {
  if (scope === "overview") {
    return <span className="guide-scope guide-scope-overview">Обзор</span>;
  }
  if (scope === "variant") {
    return <span className="guide-scope guide-scope-variant">Подвид</span>;
  }
  if (scope === "howto") {
    return <span className="guide-scope guide-scope-howto">Интересное</span>;
  }
  return null;
}

/** Pick a discrete card size from content density (tags + excerpt length). */
export function resolveGuidePreviewCardSize(guide: CropGuide): GuidePreviewCardSize {
  const meta = parseGuideMeta(guide);
  const excerptLen = guide.excerpt?.trim().length ?? 0;
  const hasTerms = meta.terms.length > 0;

  if (hasTerms && excerptLen >= 110) {
    return "big";
  }
  if (!hasTerms && excerptLen <= 90) {
    return "small";
  }
  return "middle";
}

type GuidePreviewCardProps = {
  guide: CropGuide;
  showCulture?: boolean;
  linkVariant?: GuideLinkVariant;
  /** Card size ladder (card layout only). Default `middle`. */
  size?: GuidePreviewCardSize | "auto";
  /** `card` = fixed-height media card; `list` = compact full-width row. */
  layout?: GuidePreviewLayout;
  /** Optional engagement counters (likes / comments). */
  engagement?: EngagementStatsDto;
};

export function GuidePreviewCard({
  guide,
  showCulture = true,
  linkVariant = "default",
  size = "middle",
  layout = "card",
  engagement,
}: GuidePreviewCardProps) {
  const meta = parseGuideMeta(guide);
  const preview = getGuidePreviewImage(guide);
  const resolvedSize = size === "auto" ? resolveGuidePreviewCardSize(guide) : size;
  const isList = layout === "list";
  const showTerms = !isList && resolvedSize !== "small" && meta.terms.length > 0;
  const href = guideArticleHref(guide.slug, linkVariant);

  const className = [
    "guide-preview-card",
    isList ? "guide-preview-card--list" : `guide-preview-card--${resolvedSize}`,
    engagement ? "guide-preview-card--with-engagement" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article
      className={className}
      data-layout={layout}
      data-size={isList ? undefined : resolvedSize}
    >
      <Link href={href} className="guide-preview-card-link">
        <div className="guide-preview-card-media">
          {preview?.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview.url}
              alt={preview.alt}
              className="guide-preview-card-image"
              loading="lazy"
            />
          ) : (
            <div className="guide-preview-card-image guide-preview-card-placeholder" />
          )}
        </div>

        <div className="guide-preview-card-body">
          <div className="guide-preview-card-head">
            <div className="guide-preview-card-badges">
              {showCulture ? (
                <span className="guide-preview-card-culture">
                  {CROP_KIND_LABELS[guide.cropKind]}
                </span>
              ) : null}
              <ScopeBadge scope={meta.scope} />
            </div>
            <h2 className="guide-preview-card-title">{guide.title}</h2>
          </div>

          {guide.excerpt ? (
            <p className="guide-preview-card-excerpt">{guide.excerpt}</p>
          ) : null}

          {showTerms ? (
            <ul className="guide-taxonomy guide-taxonomy-compact">
              {meta.terms.map(term => (
                <li key={term.key}>
                  <span className="guide-taxonomy-chip">{term.label}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </Link>

      {engagement ? (
        <div className="guide-preview-card-engagement">
          <EngagementBar stats={engagement} size="compact" />
        </div>
      ) : null}
    </article>
  );
}
