import Image from "next/image";
import Link from "next/link";

import { ItemMediaGallery } from "@/components/ItemMediaGallery";
import { MaterialIcon } from "@/components/MaterialIcon";
import {
  CROP_KIND_LABELS,
  fetchLatestPublishedGuides,
  getGuidePreviewImage,
  type CropGuide,
} from "@/lib/content-api";

type HomeLatestProps = {
  guides?: CropGuide[];
  limit?: number;
};

function formatPublishedDate(iso?: string | null): string | null {
  if (!iso) {
    return null;
  }
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function HomeLatest({ guides: passedGuides, limit = 6 }: HomeLatestProps) {
  const guides = passedGuides ?? (await fetchLatestPublishedGuides());
  const items = guides.slice(0, limit);

  return (
    <div className="block-updates-section glass-effect overflow-hidden rounded-2xl border border-outline-variant/10 dark:border-outline-variant/15">
      <div className="header-latest section-header relative overflow-hidden px-4 py-5 sm:px-6 sm:py-6 border-b border-outline-variant/10 dark:border-outline-variant/15">
        {/* Background Image Container */}
        <div className="header-latest-bg section-header-bg absolute inset-0 z-0 pointer-events-none select-none">
          <Image
            src="/latest-guides-header.png"
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 720px"
            priority
            className="object-cover object-[center_60%] opacity-70 dark:opacity-50 saturate-[1.15] dark:saturate-100 dark:brightness-95 transition-all duration-300"
          />
          {/* Readability gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/45 to-transparent dark:from-background/95 dark:via-background/65 dark:to-background/25" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/30 to-transparent dark:from-background/90 dark:via-background/40 dark:to-transparent" />
        </div>

        {/* Header content */}
        <div className="relative z-10">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="font-label text-[10px] uppercase tracking-widest text-primary-fixed-dim">
              База знаний
            </span>
            <Link
              href="/guides"
              className="font-label text-[10px] uppercase tracking-wide text-primary hover:text-primary-container transition-colors duration-200 flex items-center gap-1"
            >
              <span>Все публикации</span>
              <span className="text-xs">→</span>
            </Link>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <div className="relative h-12 w-12 shrink-0 rounded-xl overflow-hidden shadow-md ring-1 ring-white/10">
              <Image
                src="/latest-section-logo.png"
                alt="Последнее"
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="font-headline text-xl font-bold text-on-surface sm:text-2xl">
                Последнее
              </h2>
              <p className="mt-0.5 text-xs text-on-surface-variant opacity-90 leading-relaxed max-w-xl">
                Недавно опубликованные гайды и статьи из базы знаний.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        {items.length > 0 ? (
          <ul className="space-y-3 sm:space-y-4">
            {items.map(guide => {
              const publishedLabel = formatPublishedDate(guide.publishedAt);
              const preview = getGuidePreviewImage(guide);

              return (
                <li key={guide.id}>
                  <div className="group flex gap-3 rounded-xl border border-outline-variant/15 bg-surface-container-low p-3 transition-all hover:border-primary-container/30 hover:bg-surface-container dark:border-outline-variant/10 dark:hover:border-primary-container/25 sm:gap-4 sm:p-4">
                    <ItemMediaGallery
                      src={preview.url}
                      alt={preview.alt}
                      className="relative h-20 w-24 shrink-0 overflow-hidden rounded-lg sm:h-24 sm:w-28"
                    />
                    <Link
                      href={`/guides/${guide.slug}`}
                      className="flex min-w-0 flex-1 gap-3 sm:gap-4"
                    >
                      <div className="min-w-0 flex-1 space-y-1.5 sm:space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-primary-container/15 px-2.5 py-0.5 font-label text-[10px] uppercase tracking-wide text-primary-container">
                            {CROP_KIND_LABELS[guide.cropKind]}
                          </span>
                          {publishedLabel ? (
                            <span className="font-label text-[10px] text-outline">
                              {publishedLabel}
                            </span>
                          ) : null}
                        </div>
                        <h3 className="font-headline text-base leading-snug text-on-surface transition-colors group-hover:text-primary-container sm:text-lg sm:leading-7">
                          {guide.title}
                        </h3>
                        {guide.excerpt ? (
                          <p className="line-clamp-2 text-xs text-on-surface-variant sm:text-sm">
                            {guide.excerpt}
                          </p>
                        ) : null}
                      </div>
                      <MaterialIcon
                        name="arrow_forward"
                        className="hidden shrink-0 self-center text-primary-fixed-dim opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100 sm:block"
                      />
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="rounded-xl border border-dashed border-outline-variant/30 bg-surface-container-low/40 px-4 py-8 text-center dark:border-outline-variant/20">
            <p className="text-sm text-on-surface-variant">
              Пока нет опубликованных материалов. Скоро появятся первые гайды.
            </p>
            <Link
              href="/guides"
              className="mt-3 inline-flex items-center gap-1 font-label text-label text-primary-container hover:underline"
            >
              Перейти в базу знаний
              <MaterialIcon name="arrow_forward" className="text-[16px]" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
