import Link from "next/link";

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
    <div className="glass-effect rounded-2xl border border-outline-variant/10 p-5">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="font-headline text-headline-mobile text-on-surface">Последнее</h2>
        <Link
          href="/guides"
          className="font-label text-[10px] uppercase tracking-wide text-primary-container hover:underline"
        >
          Все
        </Link>
      </div>
      <p className="mb-4 text-sm text-on-surface-variant opacity-80">
        Недавно опубликованные гайды и статьи из базы знаний.
      </p>

      {items.length > 0 ? (
        <ul className="space-y-4">
          {items.map(guide => {
            const preview = getGuidePreviewImage(guide);
            const publishedLabel = formatPublishedDate(guide.publishedAt);

            return (
              <li key={guide.id}>
                <Link
                  href={`/guides/${guide.slug}`}
                  className="group flex gap-4 rounded-xl border border-outline-variant/15 bg-surface-container-low p-4 transition-all hover:border-primary-container/30 hover:bg-surface-container"
                >
                  <div className="relative h-24 w-28 shrink-0 overflow-hidden rounded-lg bg-surface-container-highest">
                    {preview?.url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={preview.url}
                        alt={preview.alt}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-primary-container/15 px-2.5 py-0.5 font-label text-[10px] uppercase tracking-wide text-primary-container">
                        {CROP_KIND_LABELS[guide.cropKind]}
                      </span>
                      {publishedLabel ? (
                        <span className="font-label text-[10px] text-outline">{publishedLabel}</span>
                      ) : null}
                    </div>
                    <h3 className="font-headline text-headline-mobile text-on-surface transition-colors group-hover:text-primary-container">
                      {guide.title}
                    </h3>
                    {guide.excerpt ? (
                      <p className="line-clamp-2 text-sm text-on-surface-variant">{guide.excerpt}</p>
                    ) : null}
                  </div>
                  <MaterialIcon
                    name="arrow_forward"
                    className="hidden shrink-0 self-center text-primary-fixed-dim opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100 sm:block"
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="rounded-xl border border-dashed border-outline-variant/40 bg-surface-container-low/40 px-4 py-8 text-center">
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
