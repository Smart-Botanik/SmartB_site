import Link from "next/link";

import { CommentsList } from "@/components/CommentsList";
import { EngagementBar } from "@/components/EngagementBar";
import { GuideBlocks, GuideCover } from "@/components/GuideBlocks";
import { GuideMarkdown } from "@/components/GuideMarkdown";
import {
  CROP_KIND_LABELS,
  CROP_KIND_SLUGS,
  getGuideMarkdownContent,
  parseGuideMeta,
  type CropGuide,
  type CropKind,
  type GuideScope,
  type TaxonomyChip,
} from "@/lib/content-api";
import {
  getHardcodedEngagement,
  getHardcodedEngagementByDiscussionId,
  type EngagementBundle,
} from "@/lib/engagement";
import {
  guideArticleHref,
  guideCultureHubHref,
  guidesCatalogHref,
  type GuideLinkVariant,
} from "@/lib/guide-view-paths";

type GuideArticleLayoutProps = {
  guide: CropGuide;
  relatedGuides?: CropGuide[];
  variant?: "default" | "view";
  /** Prefetched engagement (live social or mock). */
  engagement?: EngagementBundle;
};

function Breadcrumbs({
  cropKind,
  title,
  linkVariant = "default",
}: {
  cropKind: CropKind;
  title: string;
  linkVariant?: GuideLinkVariant;
}) {
  const cultureSlug = CROP_KIND_SLUGS[cropKind];
  const cultureLabel = CROP_KIND_LABELS[cropKind];
  const showHome = linkVariant !== "view";

  return (
    <nav className="guide-breadcrumbs" aria-label="Навигация">
      {showHome ? (
        <>
          <Link href="/">Главная</Link>
          <span aria-hidden="true">/</span>
        </>
      ) : null}
      <Link href={guidesCatalogHref(linkVariant)}>Руководства</Link>
      <span aria-hidden="true">/</span>
      <Link href={guideCultureHubHref(cultureSlug, linkVariant)}>{cultureLabel}</Link>
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
  linkVariant = "default",
}: {
  guides: CropGuide[];
  currentSlug: string;
  linkVariant?: GuideLinkVariant;
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
              <Link
                href={guideArticleHref(item.slug, linkVariant)}
                className="guide-related-link"
              >
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
  variant = "default",
  engagement: engagementProp,
}: GuideArticleLayoutProps) {
  const isView = variant === "view";
  const meta = parseGuideMeta(guide);
  const markdownContent = getGuideMarkdownContent(guide);
  const engagement =
    engagementProp ??
    (guide.discussionId
      ? getHardcodedEngagementByDiscussionId(guide.discussionId)
      : getHardcodedEngagement("GUIDE", guide.id));
  const bodyWithoutMeta = Array.isArray(guide.body)
    ? guide.body.filter(
        block =>
          typeof block === "object" &&
          block !== null &&
          (block as { type?: string }).type !== "taxonomy",
      )
    : guide.body;

  return (
    <article className={`guide-article${isView ? " guide-article-view" : ""}`}>
      <Breadcrumbs cropKind={guide.cropKind} title={guide.title} linkVariant={variant} />

      <header className="guide-header">
        <h1 className="page-title">{guide.title}</h1>
        <div className="guide-header-badges">
          <ScopeBadge scope={meta.scope} />
          <p className="guide-kind">{CROP_KIND_LABELS[guide.cropKind]}</p>
        </div>
        {guide.excerpt ? <p className="page-lead">{guide.excerpt}</p> : null}
        <TaxonomyChips terms={meta.terms} />
        <EngagementBar
          stats={engagement.stats}
          size="full"
          className="guide-header-engagement"
        />
      </header>

      <GuideCover cover={guide.cover} />
      {markdownContent ? (
        <GuideMarkdown markdown={markdownContent} />
      ) : (
        <GuideBlocks body={bodyWithoutMeta} />
      )}

      <CommentsList
        comments={engagement.comments}
        title="Обсуждение"
        className="guide-article-comments"
      />

      <RelatedGuides
        guides={relatedGuides}
        currentSlug={guide.slug}
        linkVariant={variant}
      />

      {!isView ? (
        <footer className="guide-footer">
          <Link href={guideCultureHubHref(CROP_KIND_SLUGS[guide.cropKind], variant)}>
            ← Все материалы: {CROP_KIND_LABELS[guide.cropKind]}
          </Link>
        </footer>
      ) : null}
    </article>
  );
}
