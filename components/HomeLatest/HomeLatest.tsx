import Link from "next/link";

import { ItemMediaGallery } from "@/components/ItemMediaGallery";
import { MaterialIcon } from "@/components/MaterialIcon";
import {
  CROP_KIND_LABELS,
  getGuidePreviewImage,
  type CropGuide,
} from "@/lib/content-api";

type HomeLatestProps = {
  guides: CropGuide[];
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

export function HomeLatest({ guides, limit = 6 }: HomeLatestProps) {
  const items = guides.slice(0, limit);

  return (
    <div className="glass-effect rounded-2xl border border-outline-variant/10 p-3.5 dark:border-outline-variant/15 sm:p-5">
      <div className="mb-2.5 flex items-center justify-between gap-2 sm:mb-4">
        <h2 className="font-headline text-lg text-on-surface sm:text-headline-mobile">
          Последние гайды
        </h2>
        <Link
          href="/guides"
          className="font-label text-[10px] uppercase tracking-wide text-primary-container hover:underline"
        >
          Все
        </Link>
      </div>
      <p className="mb-3 text-xs text-on-surface-variant opacity-80 sm:mb-4 sm:text-sm">
        Недавно опубликованные гайды и статьи из базы знаний.
      </p>

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
  );
}
