import type { Metadata } from "next";
import Link from "next/link";

import { MaterialIcon } from "@/components/MaterialIcon";
import { siteEnv } from "@/lib/env";

export const metadata: Metadata = {
  title: "Приложение — SmartБотаник",
  description:
    "Дневник выращивания SmartБотаник — заметки, метрики и фото по неделям цикла. Скоро.",
};

export default function AppPlaceholderPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-container-max flex-col items-center justify-center px-gutter py-20">
      <div className="glass-effect flex w-full max-w-2xl flex-col items-center gap-6 rounded-2xl border border-primary-container/20 bg-surface-container-low p-8 text-center md:p-12">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-container/20">
          <MaterialIcon name="smartphone" className="text-3xl text-primary-container" filled />
        </div>
        <div className="max-w-xl space-y-3">
          <span className="font-label text-label uppercase tracking-widest text-primary-fixed-dim">
            Скоро
          </span>
          <h1 className="font-display text-display text-on-surface md:text-[48px] md:leading-tight">
            Приложение SmartБотаник
          </h1>
          <p className="font-body text-on-surface-variant">
            Дневник цикла, метрики и фотоурожай — в одном месте. Пока готовим запуск, следите за
            обновлениями в Telegram и на сайте.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href={siteEnv.telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-primary-container px-8 py-3 font-bold text-on-primary-container transition-opacity hover:opacity-90"
          >
            <MaterialIcon name="forum" />
            Telegram
          </a>
          <Link
            href="/guides"
            className="inline-flex items-center gap-2 rounded-xl border border-primary-container px-8 py-3 font-bold text-primary-container transition-colors hover:bg-primary-container/10"
          >
            <MaterialIcon name="menu_book" />
            К гайдам
          </Link>
        </div>
      </div>
    </div>
  );
}
