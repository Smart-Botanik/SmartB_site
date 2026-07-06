import Link from "next/link";

import { GuideBlocks, GuideCover } from "@/components/GuideBlocks";
import { GuideMarkdown } from "@/components/GuideMarkdown";
import {
  CROP_KIND_LABELS,
  CROP_KIND_SLUGS,
  getGuideMarkdownContent,
  type CropGuide,
  type CropKind,
  type GuideScope,
  type TaxonomyChip,
  parseGuideMeta,
} from "@/lib/content-api";

type GuideArticleLayoutProps = {
  guide: CropGuide;
  relatedGuides?: CropGuide[];
};

function Breadcrumbs({
  cropKind,
  title,
}: {
  cropKind: CropKind;
  title: string;
}) {
  const cultureSlug = CROP_KIND_SLUGS[cropKind];
  const cultureLabel = CROP_KIND_LABELS[cropKind];

  return (
    <nav className="guide-breadcrumbs" aria-label="Навигация">
      <Link href="/">Главная</Link>
      <span aria-hidden="true">/</span>
      <Link href="/guides">Руководства</Link>
      <span aria-hidden="true">/</span>
      <Link href={`/guides/kultury/${cultureSlug}`}>{cultureLabel}</Link>
      <span aria-hidden="true">/</span>
      <span className="guide-breadcrumbs-current">{title}</span>
    </nav>
  );
}

function ScopeBadge({ scope }: { scope: GuideScope }) {
  if (scope === "overview") {
    return <span className="guide-scope guide-scope-overview">Обзор культуры</span>;
  }
  if (scope === "variant") {
    return <span className="guide-scope guide-scope-variant">Подвид / тип</span>;
  }
  if (scope === "howto") {
    return <span className="guide-scope guide-scope-howto">Интересное</span>;
  }
  return null;
}

function TaxonomyChips({ terms }: { terms: TaxonomyChip[] }) {
  if (terms.length === 0) return null;

  return (
    <ul className="guide-taxonomy">
      {terms.map(term => (
        <li key={term.key}>
          <span className="guide-taxonomy-chip" title={term.key}>
            {term.label}
          </span>
        </li>
      ))}
    </ul>
  );
}

function RelatedGuides({
  guides,
  currentSlug,
}: {
  guides: CropGuide[];
  currentSlug: string;
}) {
  const items = guides.filter(guide => guide.slug !== currentSlug);
  if (items.length === 0) return null;

  return (
    <aside className="guide-related">
      <h2 className="guide-related-title">Ещё по этой культуре</h2>
      <ul className="guide-related-list">
        {items.map(item => {
          const meta = parseGuideMeta(item);
          return (
            <li key={item.id}>
              <Link href={`/guides/${item.slug}`} className="guide-related-link">
                <span className="guide-related-link-title">{item.title}</span>
                {meta.scope === "variant" ? (
                  <span className="guide-related-link-meta">Подвид</span>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

export function GuideArticleLayout({
  guide,
  relatedGuides = [],
}: GuideArticleLayoutProps) {
  const meta = parseGuideMeta(guide);
  const markdownContent = getGuideMarkdownContent(guide);
  const bodyWithoutMeta = Array.isArray(guide.body)
    ? guide.body.filter(
        block =>
          typeof block === "object" &&
          block !== null &&
          (block as { type?: string }).type !== "taxonomy",
      )
    : guide.body;

  return (
    <article className="guide-article">
      <Breadcrumbs cropKind={guide.cropKind} title={guide.title} />

      <header className="guide-header">
        <h1 className="page-title">{guide.title}</h1>
        <div className="guide-header-badges">
          <ScopeBadge scope={meta.scope} />
          <p className="guide-kind">{CROP_KIND_LABELS[guide.cropKind]}</p>
        </div>
        {guide.excerpt ? <p className="page-lead">{guide.excerpt}</p> : null}
        <TaxonomyChips terms={meta.terms} />
      </header>

      <GuideCover cover={guide.cover} />
      {markdownContent ? (
        <GuideMarkdown markdown={markdownContent} />
      ) : (
        <GuideBlocks body={bodyWithoutMeta} />
      )}

      <RelatedGuides guides={relatedGuides} currentSlug={guide.slug} />

      <footer className="guide-footer">
        <Link href={`/guides/kultury/${CROP_KIND_SLUGS[guide.cropKind]}`}>
          ← Все материалы: {CROP_KIND_LABELS[guide.cropKind]}
        </Link>
      </footer>
    </article>
  );
}
