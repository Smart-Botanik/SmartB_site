import Link from "next/link";

import { GuideCultureFilters } from "@/components/GuideCultureFilters";
import { GuidePreviewCard } from "@/components/GuidePreviewCard";
import {
  CROP_KIND_LABELS,
  parseGuideMeta,
  type ContentLabel,
  type CropGuide,
  type CropKind,
} from "@/lib/content-api";
import { guidesCatalogHref, type GuideLinkVariant } from "@/lib/guide-view-paths";

type GuideCultureHubProps = {
  cropKind?: CropKind | null;
  cultureLabel: string;
  cultureSlug: string;
  guides: CropGuide[];
  allGuides: CropGuide[];
  activeLabelKey?: string;
  variant?: GuideLinkVariant;
  hubLead?: string;
  aboutShort?: string;
  heroPreviewUrl?: string | null;
  labelFilters?: ContentLabel[];
};

export function GuideCultureHub({
  cropKind,
  cultureLabel,
  cultureSlug,
  guides,
  allGuides,
  activeLabelKey,
  variant = "default",
  hubLead,
  aboutShort,
  heroPreviewUrl,
  labelFilters,
}: GuideCultureHubProps) {
  const isView = variant === "view";
  const resolvedLabelFilters = labelFilters ?? [];
  const title = cultureLabel || (cropKind ? CROP_KIND_LABELS[cropKind] : "Культура");
  const lead =
    hubLead?.trim() ||
    "Обзорные материалы и узкие статьи по подвидам и способам выращивания.";
  const about = aboutShort?.trim();

  const overview = guides.filter(g => parseGuideMeta(g).scope === "overview");
  const variants = guides.filter(g => parseGuideMeta(g).scope === "variant");
  const other = guides.filter(g => {
    const scope = parseGuideMeta(g).scope;
    return scope !== "overview" && scope !== "variant";
  });

  return (
    <section className={`guide-hub${isView ? " guide-hub-view" : ""}`}>
      <nav className="guide-breadcrumbs" aria-label="Навигация">
        {!isView ? (
          <>
            <Link href="/">Главная</Link>
            <span aria-hidden="true">/</span>
          </>
        ) : null}
        <Link href={guidesCatalogHref(variant)}>Руководства</Link>
        <span aria-hidden="true">/</span>
        <span className="guide-breadcrumbs-current">{title}</span>
      </nav>

      <h1 className="page-title">{title}</h1>
      {heroPreviewUrl ? (
        <div className="guide-hub-hero">
          <img
            src={heroPreviewUrl}
            alt=""
            className="guide-hub-hero-image"
            loading="eager"
          />
        </div>
      ) : null}
      <p className="page-lead">{lead}</p>
      {about ? <p className="guide-hub-about">{about}</p> : null}

      <GuideCultureFilters
        cultureSlug={cultureSlug}
        cultureLabel={title}
        filters={resolvedLabelFilters}
        activeKey={activeLabelKey}
        linkVariant={variant}
      />

      {guides.length === 0 ? (
        <p className="page-empty">Пока нет опубликованных материалов.</p>
      ) : (
        <div className="guide-hub-sections">
          {overview.length > 0 ? (
            <section>
              <h2 className="section-title">Обзор</h2>
              <ul className="guide-preview-list">
                {overview.map(guide => (
                  <li key={guide.id}>
                    <GuidePreviewCard guide={guide} showCulture={false} linkVariant={variant} />
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {variants.length > 0 ? (
            <section>
              <h2 className="section-title">Подвиды и типы</h2>
              <ul className="guide-preview-list">
                {variants.map(guide => (
                  <li key={guide.id}>
                    <GuidePreviewCard guide={guide} showCulture={false} linkVariant={variant} />
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {other.length > 0 ? (
            <section>
              <h2 className="section-title">Дополнительно</h2>
              <ul className="guide-preview-list">
                {other.map(guide => (
                  <li key={guide.id}>
                    <GuidePreviewCard guide={guide} showCulture={false} linkVariant={variant} />
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      )}
    </section>
  );
}
