import Link from "next/link";

import {
  CROP_KIND_LABELS,
  fetchPublishedCropGuides,
  fetchPublishedSitePage,
  type CropGuide,
  type CropKind,
} from "@/lib/content-api";
import { siteEnv } from "@/lib/env";

export const revalidate = 3600;

type THeroSection = {
  type: "hero";
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

type TFeaturedSection = {
  type: "featuredGuides";
  cropKinds?: string[];
};

type TCtaSection = {
  type: "ctaBlock";
  title?: string;
  text?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function renderHero(section: THeroSection) {
  return (
    <section className="hero">
      <h1>{section.title ?? "Growing App"}</h1>
      {section.subtitle ? <p className="hero-lead">{section.subtitle}</p> : null}
      <div className="hero-actions">
        {section.ctaHref ? (
          <Link href={section.ctaHref} className="button button-primary">
            {section.ctaLabel ?? "Подробнее"}
          </Link>
        ) : null}
        <Link href={siteEnv.appBasePath} className="button button-secondary">
          Открыть приложение
        </Link>
      </div>
    </section>
  );
}

function renderFeatured(guides: CropGuide[], section: TFeaturedSection) {
  const kinds = (section.cropKinds ?? []) as CropKind[];
  const filtered =
    kinds.length > 0
      ? guides.filter(guide => kinds.includes(guide.cropKind))
      : guides;

  return (
    <section className="featured-guides">
      <h2 className="section-title">Популярные культуры</h2>
      <div className="guides-grid">
        {filtered.map(guide => (
          <Link key={guide.id} href={`/guides/${guide.slug}`} className="guide-card">
            <div className="guide-card-body">
              <span className="guide-card-kind">
                {CROP_KIND_LABELS[guide.cropKind]}
              </span>
              <h3>{guide.title}</h3>
              {guide.excerpt ? <p>{guide.excerpt}</p> : null}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function renderCta(section: TCtaSection) {
  return (
    <section className="cta-block">
      {section.title ? <h2>{section.title}</h2> : null}
      {section.text ? <p>{section.text}</p> : null}
      {section.ctaHref ? (
        <Link href={section.ctaHref} className="button button-primary">
          {section.ctaLabel ?? "Перейти"}
        </Link>
      ) : null}
    </section>
  );
}

export default async function HomePage() {
  let page = null;
  let guides: CropGuide[] = [];

  try {
    [page, guides] = await Promise.all([
      fetchPublishedSitePage("home"),
      fetchPublishedCropGuides(),
    ]);
  } catch {
    page = null;
    guides = [];
  }

  const sections = Array.isArray(page?.sections) ? page.sections : [];

  if (sections.length === 0) {
    return (
      <section className="hero">
        <p className="hero-kicker">Выращивание с умом</p>
        <h1>Советы по культурам и дневник вашего сада</h1>
        <p className="hero-lead">
          Запустите seed контента или опубликуйте главную страницу в админке.
        </p>
        <div className="hero-actions">
          <Link href="/guides" className="button button-primary">
            Смотреть руководства
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div className="home-sections">
      {sections.filter(isRecord).map((section, index) => {
        switch (section.type) {
          case "hero":
            return <div key={`hero-${index}`}>{renderHero(section as THeroSection)}</div>;
          case "featuredGuides":
            return (
              <div key={`featured-${index}`}>
                {renderFeatured(guides, section as TFeaturedSection)}
              </div>
            );
          case "ctaBlock":
            return <div key={`cta-${index}`}>{renderCta(section as TCtaSection)}</div>;
          default:
            return null;
        }
      })}
    </div>
  );
}
