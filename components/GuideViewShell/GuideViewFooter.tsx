import Image from "next/image";
import Link from "next/link";

export function GuideViewFooter() {
  return (
    <footer className="guide-view-footer mt-auto w-full border-t border-outline-variant/40 bg-surface-container-low py-6 dark:border-outline-variant/20">
      <div className="mx-auto flex max-w-[960px] flex-col items-center justify-between gap-4 px-6 sm:flex-row sm:gap-6">
        <div className="flex items-center gap-3">
          <Image
            src="/favicon.ico"
            alt=""
            width={32}
            height={32}
            className="h-8 w-8 shrink-0"
            aria-hidden
          />
          <p className="font-label text-label text-on-surface-variant opacity-80">
            © {new Date().getFullYear()} SmartБотаник
          </p>
        </div>

        <nav
          className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2"
          aria-label="Навигация по сайту"
        >
          <Link
            href="/guides/view"
            className="font-label text-label text-on-surface-variant transition-colors hover:text-primary-container"
          >
            Руководства
          </Link>
          <Link
            href="/"
            className="font-label text-label text-on-surface-variant transition-colors hover:text-primary-container"
          >
            На сайт
          </Link>
        </nav>
      </div>
    </footer>
  );
}
