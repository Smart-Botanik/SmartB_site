import Link from "next/link";

import {
  CROP_KIND_LABELS,
  CROP_KIND_SLUGS,
  fetchPublishedCropGuides,
  type CropGuide,
  type CropKind,
} from "@/lib/content-api";

export const revalidate = 3600;

const CROP_ORDER: CropKind[] = ["TOMATO", "ZUCCHINI", "EGGPLANT", "CUCUMBER"];

export default async function GuidesPage() {
  let guides: CropGuide[] = [];
  try {
    guides = await fetchPublishedCropGuides();
  } catch {
    guides = [];
  }

  return (
    <section>
      <h1 className="page-title">Руководства по культурам</h1>
      <p className="page-lead">
        Советы по выращиванию популярных овощей — от посадки до сбора урожая.
      </p>

      <nav className="culture-links" aria-label="Культуры">
        {CROP_ORDER.map(kind => (
          <Link
            key={kind}
            href={`/guides/kultury/${CROP_KIND_SLUGS[kind]}`}
            className="culture-link"
          >
            {CROP_KIND_LABELS[kind]}
          </Link>
        ))}
      </nav>

      {guides.length === 0 ? (
        <p className="page-empty">Пока нет опубликованных руководств.</p>
      ) : (
        <div className="guides-grid">
          {guides.map(guide => (
            <Link key={guide.id} href={`/guides/${guide.slug}`} className="guide-card">
              {guide.cover?.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="guide-card-cover" src={guide.cover.url} alt="" />
              ) : (
                <div className="guide-card-cover guide-card-cover-placeholder" />
              )}
              <div className="guide-card-body">
                <span className="guide-card-kind">
                  {CROP_KIND_LABELS[guide.cropKind]}
                </span>
                <h2>{guide.title}</h2>
                {guide.excerpt ? <p>{guide.excerpt}</p> : null}
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}