import Link from "next/link";

import {
  CROP_KIND_LABELS,
  getGuidePreviewImage,
  parseGuideMeta,
  type CropGuide,
  type GuideScope,
} from "@/lib/content-api";

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

type GuidePreviewCardProps = {
  guide: CropGuide;
  showCulture?: boolean;
};

export function GuidePreviewCard({ guide, showCulture = true }: GuidePreviewCardProps) {
  const meta = parseGuideMeta(guide);
  const preview = getGuidePreviewImage(guide);

  return (
    <Link href={`/guides/${guide.slug}`} className="guide-preview-card">
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

        {guide.excerpt ? <p className="guide-preview-card-excerpt">{guide.excerpt}</p> : null}

        {meta.terms.length > 0 ? (
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
  );
}
