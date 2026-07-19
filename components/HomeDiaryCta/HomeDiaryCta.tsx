import Link from "next/link";

import { MaterialIcon } from "@/components/MaterialIcon";
import { siteEnv } from "@/lib/env";

export function HomeDiaryCta() {
  return (
    <section className="mx-auto max-w-container-max px-gutter py-16">
      <div className="glass-effect flex flex-col items-center gap-6 rounded-2xl border border-primary-container/20 bg-surface-container-low p-8 text-center md:p-12">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-container/20">
          <MaterialIcon name="dataset" className="text-3xl text-primary-container" filled />
        </div>
        <div className="max-w-2xl space-y-3">
          <h2 className="font-headline text-headline text-on-surface">Ведите дневник в приложении</h2>
          <p className="text-on-surface-variant opacity-90">
            Заметки, метрики и фото по неделям цикла — как в лаборатории, только про ваш урожай.
            Публичные гроу-репорты появятся, когда подключим приложение.
          </p>
        </div>
        <Link
          href={siteEnv.appBasePath}
          className="inline-flex items-center gap-2 rounded-xl border border-primary-container px-8 py-3 font-bold text-primary-container transition-colors hover:bg-primary-container/10"
        >
          <MaterialIcon name="smartphone" />
          Приложение — скоро
        </Link>
      </div>
    </section>
  );
}
