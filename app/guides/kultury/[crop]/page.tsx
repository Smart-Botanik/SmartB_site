import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  CROP_KIND_LABELS,
  CROP_KIND_SLUGS,
  cropKindFromSlug,
  fetchPublishedCropGuides,
  parseGuideMeta,
  type CropGuide,
} from "@/lib/content-api";

export const revalidate = 3600;

type PageProps = {
  params: Promise<{ crop: string }>;
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

function GuideListItem({ guide }: { guide: CropGuide }) {
  const meta = parseGuideMeta(guide.body);

  return (
    <li>
      <Link href={`/guides/${guide.slug}`} className="guide-hub-card">
        <div className="guide-hub-card-head">
          <h2>{guide.title}</h2>
          {meta.scope === "variant" ? (
            <span className="guide-scope guide-scope-variant">Подвид</span>
          ) : (
            <span className="guide-scope guide-scope-overview">Обзор</span>
          )}
        </div>
        {guide.excerpt ? <p>{guide.excerpt}</p> : null}
        {meta.terms.length > 0 ? (
          <ul className="guide-taxonomy guide-taxonomy-compact">
            {meta.terms.map(term => (
              <li key={term.key}>
                <span className="guide-taxonomy-chip">{term.label}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </Link>
    </li>
  );
}

export default async function CultureHubPage({ params }: PageProps) {
  const { crop } = await params;
  const cropKind = cropKindFromSlug(crop);

  if (!cropKind) {
    notFound();
  }

  let guides: CropGuide[] = [];
  try {
    guides = await fetchPublishedCropGuides(cropKind);
  } catch {
    guides = [];
  }

  const overview = guides.filter(g => parseGuideMeta(g.body).scope === "overview");
  const variants = guides.filter(g => parseGuideMeta(g.body).scope === "variant");
  const other = guides.filter(g => {
    const scope = parseGuideMeta(g.body).scope;
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

      {guides.length === 0 ? (
        <p className="page-empty">Пока нет опубликованных материалов.</p>
      ) : (
        <div className="guide-hub-sections">
          {overview.length > 0 ? (
            <section>
              <h2 className="section-title">Обзор</h2>
              <ul className="guide-hub-list">
                {overview.map(guide => (
                  <GuideListItem key={guide.id} guide={guide} />
                ))}
              </ul>
            </section>
          ) : null}

          {variants.length > 0 ? (
            <section>
              <h2 className="section-title">Подвиды и типы</h2>
              <ul className="guide-hub-list">
                {variants.map(guide => (
                  <GuideListItem key={guide.id} guide={guide} />
                ))}
              </ul>
            </section>
          ) : null}

          {other.length > 0 ? (
            <section>
              <h2 className="section-title">Дополнительно</h2>
              <ul className="guide-hub-list">
                {other.map(guide => (
                  <GuideListItem key={guide.id} guide={guide} />
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
