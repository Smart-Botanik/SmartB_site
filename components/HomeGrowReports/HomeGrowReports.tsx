import Image from "next/image";
import Link from "next/link";

import { MaterialIcon } from "@/components/MaterialIcon";
import { siteEnv } from "@/lib/env";
import type { GrowReportCard } from "@/lib/site-content";

type HomeGrowReportsProps = {
  reports: GrowReportCard[];
};

export function HomeGrowReports({ reports }: HomeGrowReportsProps) {
  return (
    <section className="mx-auto max-w-container-max px-gutter py-20">
      <div className="mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="mb-1 font-headline text-headline text-on-surface">Выращивание</h2>
          <p className="font-body text-on-surface-variant opacity-70">
            Публичные гроу-репорты — циклы, заметки и метрики из реальных дневников.
          </p>
        </div>
        <Link
          href="/reports"
          className="flex items-center gap-1 font-label text-label text-primary-container hover:underline"
        >
          Все репорты
          <MaterialIcon name="arrow_forward" className="text-[16px]" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reports.map(report => (
          <article
            key={report.id}
            className="group overflow-hidden rounded-xl border border-outline-variant/20 bg-surface-container-low shadow-xl transition-all duration-300 hover:border-primary-container/30 dark:border-outline-variant/10 dark:hover:border-primary-container/25"
          >
            <div className="relative h-64 overflow-hidden">
              <Image
                src={report.imageUrl}
                alt={report.imageAlt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="glass-effect absolute right-3 top-3 rounded-lg px-3 py-1 font-label text-label text-primary-fixed-dim">
                {report.badge}
              </div>
            </div>
            <div className="space-y-3 p-6">
              <h3 className="font-headline text-headline-mobile text-on-surface">{report.title}</h3>
              <p className="line-clamp-2 text-sm text-on-surface-variant">{report.excerpt}</p>
              <div className="space-y-3">
                <div className="rounded-lg border border-primary-container/10 bg-surface-container-high p-3">
                  <p className="mb-1 font-label text-[10px] uppercase tracking-widest text-primary-container">
                    Заметка из дневника
                  </p>
                  <p className="text-sm text-on-surface-variant">{report.journalNote}</p>
                </div>
                <Link
                  href={report.href}
                  className="group/btn flex w-full items-center justify-center gap-1 rounded-lg border border-primary-container py-3 font-bold text-primary-container transition-all hover:bg-primary-container/10"
                >
                  Читать репорт
                  <MaterialIcon
                    name="monitoring"
                    className="text-[18px] transition-transform group-hover/btn:translate-x-1"
                  />
                </Link>
              </div>
            </div>
          </article>
        ))}

        <article className="group relative flex flex-col items-center justify-center space-y-6 overflow-hidden rounded-xl border border-primary-container/20 bg-surface-container-low p-6 text-center lg:min-h-full">
          <div className="mb-1 flex h-16 w-16 items-center justify-center rounded-full bg-primary-container/20">
            <MaterialIcon name="dataset" className="text-3xl text-primary-container" filled />
          </div>
          <h3 className="font-headline text-headline-mobile text-on-surface">Гровер как учёный</h3>
          <p className="text-sm text-on-surface-variant">
            Ведите дневник с метриками, фото и заметками — как в лаборатории, только про ваш
            урожай.
          </p>
          <Link
            href={siteEnv.appBasePath}
            className="border-b border-primary-container px-6 py-1 font-label text-label text-primary-container transition-colors hover:bg-primary-container/10"
          >
            Приложение — скоро
          </Link>
        </article>
      </div>
    </section>
  );
}
