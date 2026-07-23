import Image from "next/image";
import Link from "next/link";

import { MaterialIcon } from "@/components/MaterialIcon";
import {
  CROP_KIND_LABELS,
  CROP_KIND_SLUGS,
  DEFAULT_CROP_ORDER,
  getCropPreviewImage,
  type CropKind,
} from "@/lib/content-api";

type HomeCultureChipsProps = {
  title?: string;
  subtitle?: string;
  cropKinds?: CropKind[];
};

export function HomeCultureChips({
  title = "Культуры",
  subtitle = "Гайды и материалы по основным культурам — от рассады до урожая.",
  cropKinds = DEFAULT_CROP_ORDER,
}: HomeCultureChipsProps) {
  const kinds = cropKinds.length > 0 ? cropKinds : DEFAULT_CROP_ORDER;

  return (
    <section className="mx-auto max-w-container-max px-gutter py-16">
      <div className="mb-10 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="font-label text-label uppercase tracking-widest text-primary-fixed-dim">
            База знаний
          </span>
          <h2 className="mt-1 font-headline text-headline text-on-surface">{title}</h2>
          {subtitle ? (
            <p className="mt-2 max-w-2xl font-body text-on-surface-variant opacity-80">
              {subtitle}
            </p>
          ) : null}
        </div>
        <Link
          href="/guides"
          className="inline-flex items-center gap-1 font-label text-label text-primary-container transition-colors hover:underline"
        >
          Все гайды
          <MaterialIcon name="arrow_forward" className="text-[16px]" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {kinds.map(kind => {
          const preview = getCropPreviewImage(kind);
          const href = `/guides/kultury/${CROP_KIND_SLUGS[kind]}`;

          return (
            <Link
              key={kind}
              href={href}
              className="group glass-effect overflow-hidden rounded-2xl border border-outline-variant/10 transition-all duration-300 hover:border-primary-container/30 hover:shadow-card-hover dark:border-outline-variant/15 dark:hover:border-primary-container/25"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={preview.url}
                  alt={preview.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
              </div>
              <div className="flex items-center justify-between gap-2 p-4">
                <span className="font-headline text-headline-mobile text-on-surface">
                  {CROP_KIND_LABELS[kind]}
                </span>
                <MaterialIcon
                  name="arrow_forward"
                  className="text-[18px] text-primary-fixed-dim transition-transform group-hover:translate-x-0.5"
                />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
