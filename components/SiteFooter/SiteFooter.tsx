import Link from "next/link";

import { MaterialIcon } from "@/components/MaterialIcon";
import { siteEnv } from "@/lib/env";

export function SiteFooter() {
  return (
    <footer className="mt-auto w-full bg-surface-container-highest py-12">
      <div className="mx-auto flex max-w-container-max flex-col items-center justify-between gap-6 px-gutter md:flex-row">
        <div className="flex flex-col items-center gap-1 md:items-start">
          <span className="font-headline text-headline-mobile text-primary">SmartБотаник</span>
          <p className="font-label text-label text-on-surface-variant opacity-70">
            © {new Date().getFullYear()} SmartБотаник. Точное выращивание.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          <Link
            href="/guides"
            className="font-label text-label text-on-surface-variant transition-colors hover:text-primary-container"
          >
            Гайды
          </Link>
          <Link
            href="/journal"
            className="font-label text-label text-on-surface-variant transition-colors hover:text-primary-container"
          >
            Журнал
          </Link>
          <Link
            href="/reports"
            className="font-label text-label text-on-surface-variant transition-colors hover:text-primary-container"
          >
            Репорты
          </Link>
          <a
            href={siteEnv.telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-label text-label text-on-surface-variant transition-colors hover:text-primary-container"
          >
            Telegram
          </a>
          <Link
            href={siteEnv.appBasePath}
            className="font-label text-label text-on-surface-variant transition-colors hover:text-primary-container"
          >
            Приложение (скоро)
          </Link>
        </div>

        <div className="flex gap-4">
          <a
            href={siteEnv.telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant transition-all hover:bg-surface hover:text-primary-container"
            aria-label="Telegram"
          >
            <MaterialIcon name="forum" />
          </a>
          <Link
            href="/guides"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant transition-all hover:bg-surface hover:text-primary-container"
            aria-label="База знаний"
          >
            <MaterialIcon name="menu_book" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
