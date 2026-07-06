import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { GuideCultureFilters } from "@/components/GuideCultureFilters";
import { GuidePreviewCard } from "@/components/GuidePreviewCard";
import {
  CROP_KIND_LABELS,
  CROP_KIND_SLUGS,
  collectCultureLabelFilters,
  cropKindFromSlug,
  fetchPublishedCropGuides,
  parseGuideMeta,
  sortPublishedGuides,
  type CropGuide,
} from "@/lib/content-api";

export const revalidate = 3600;

type PageProps = {
  params: Promise<{ crop: string }>;
  searchParams: Promise<{ label?: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { crop } = await params;
  const cropKind = cropKindFromSlug(crop);
  if (!cropKind) return { title: "Культура не найдена" };
  return {
    title: `${CROP_KIND_LABELS[cropKind]} — руководства`,
    description: `Материалы по выращиванию: ${CROP_KIND_LABELS[cropKind].toLowerCase()}.`,
  };
}

export default async function CultureHubPage({ params, searchParams }: PageProps) {
  const { crop } = await params;
  const { label: activeLabelKey } = await searchParams;
  const cropKind = cropKindFromSlug(crop);

  if (!cropKind) {
    notFound();
  }

  let allGuides: CropGuide[] = [];
  let guides: CropGuide[] = [];
  try {
    allGuides = sortPublishedGuides(await fetchPublishedCropGuides(cropKind));
    guides = activeLabelKey
      ? sortPublishedGuides(await fetchPublishedCropGuides(cropKind, activeLabelKey))
      : allGuides;
  } catch {
    allGuides = [];
    guides = [];
  }

  const labelFilters = collectCultureLabelFilters(allGuides);

  const overview = guides.filter(g => parseGuideMeta(g).scope === "overview");
  const variants = guides.filter(g => parseGuideMeta(g).scope === "variant");
  const other = guides.filter(g => {
    const scope = parseGuideMeta(g).scope;
    return scope !== "overview" && scope !== "variant";
  });

  return (
    <section className="guide-hub">
      <nav className="guide-breadcrumbs" aria-label="Навигация">
        <Link href="/">Главная</Link>
        <span aria-hidden="true">/</span>
        <Link href="/guides">Руководства</Link>
        <span aria-hidden="true">/</span>
        <span className="guide-breadcrumbs-current">
          {CROP_KIND_LABELS[cropKind]}
        </span>
      </nav>

      <h1 className="page-title">{CROP_KIND_LABELS[cropKind]}</h1>
      <p className="page-lead">
        Обзорные материалы и узкие статьи по подвидам и способам выращивания.
      </p>

      <GuideCultureFilters
        cultureSlug={crop}
        filters={labelFilters}
        activeKey={activeLabelKey}
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
                    <GuidePreviewCard guide={guide} showCulture={false} />
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
                    <GuidePreviewCard guide={guide} showCulture={false} />
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
                    <GuidePreviewCard guide={guide} showCulture={false} />
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

export function generateStaticParams() {
  return Object.values(CROP_KIND_SLUGS).map(crop => ({ crop }));
}
