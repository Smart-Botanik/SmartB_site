import Image from "next/image";
import Link from "next/link";

import { MaterialIcon } from "@/components/MaterialIcon";
import type { KnowledgeChapter } from "@/lib/site-content";

const ACCENT_STYLES: Record<
  KnowledgeChapter["accent"],
  { iconBg: string; iconBorder: string; iconColor: string }
> = {
  mint: {
    iconBg: "bg-primary-container/10",
    iconBorder: "border-primary-container/20",
    iconColor: "text-primary-container",
  },
  gold: {
    iconBg: "bg-tertiary-container/10",
    iconBorder: "border-tertiary-container/20",
    iconColor: "text-tertiary-container",
  },
  emerald: {
    iconBg: "bg-secondary-container/20",
    iconBorder: "border-secondary-fixed-dim/30",
    iconColor: "text-secondary-fixed-dim",
  },
  neutral: {
    iconBg: "bg-surface-container-highest",
    iconBorder: "border-outline-variant/30 dark:border-outline-variant/15",
    iconColor: "text-on-surface-variant",
  },
};

type HomeKnowledgeProps = {
  chapters: KnowledgeChapter[];
};

export function HomeKnowledge({ chapters }: HomeKnowledgeProps) {
  return (
    <div
      id="knowledge-base-section"
      className="block-knowledge-section glass-effect overflow-hidden rounded-2xl border border-outline-variant/10 dark:border-outline-variant/15"
    >
      <div className="header-knowledge section-header relative overflow-hidden px-4 py-5 sm:px-6 sm:py-6 border-b border-outline-variant/10 dark:border-outline-variant/15">
        {/* Background Image Container */}
        <div className="header-knowledge-bg section-header-bg absolute inset-0 z-0 pointer-events-none select-none">
          <Image
            src="/knowledge-base-header.svg"
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 1200px"
            priority
            className="object-cover object-[center_60%] opacity-65 dark:opacity-45 saturate-[1.15] dark:saturate-100 dark:brightness-95 transition-all duration-300"
          />
          {/* Readability gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/45 to-transparent dark:from-background/95 dark:via-background/65 dark:to-background/25" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/30 to-transparent dark:from-background/90 dark:via-background/40 dark:to-transparent" />
        </div>

        {/* Header content */}
        <div className="relative z-10">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="font-label text-[10px] uppercase tracking-widest text-primary-fixed-dim">
              Разделы
            </span>
            <Link
              href="/guides"
              className="font-label text-[10px] uppercase tracking-wide text-primary hover:text-primary-container transition-colors duration-200 flex items-center gap-1"
            >
              <span>Все материалы</span>
              <span className="text-xs">→</span>
            </Link>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <div className="relative h-12 w-12 shrink-0 rounded-xl overflow-hidden shadow-md ring-1 ring-white/10">
              <Image
                src="/knowledge-base-section-logo.png"
                alt="База знаний"
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="font-headline text-xl font-bold text-on-surface sm:text-2xl">
                База знаний
              </h2>
              <p className="mt-0.5 text-xs text-on-surface-variant opacity-90 leading-relaxed max-w-xl">
                Гайды, закрутки и подборки — отдельные разделы базы знаний.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
          {chapters.map(chapter => {
            const accent = ACCENT_STYLES[chapter.accent];
            const isSvgIcon =
              chapter.icon.endsWith(".svg") || chapter.icon.startsWith("/");

            return (
              <Link
                key={chapter.id}
                href={chapter.href}
                className="group relative flex flex-col items-center gap-4 rounded-xl border border-outline-variant/15 bg-surface-container-low p-4 transition-all duration-300 hover:border-primary-container/30 hover:bg-surface-container dark:border-outline-variant/10 dark:hover:border-primary-container/25 sm:gap-6 sm:p-6 md:flex-row md:items-start"
              >
                <div
                  className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border p-2 sm:h-20 sm:w-20 ${accent.iconBg} ${accent.iconBorder}`}
                >
                  {isSvgIcon ? (
                    <Image
                      src={chapter.icon}
                      alt={chapter.title}
                      width={48}
                      height={48}
                      className="h-10 w-10 sm:h-12 sm:w-12 object-contain transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : /^[a-z0-9_]+$/.test(chapter.icon) ? (
                    <MaterialIcon
                      name={chapter.icon}
                      className={`text-3xl sm:text-4xl ${accent.iconColor}`}
                      filled
                    />
                  ) : (
                    <span className="text-3xl leading-none sm:text-4xl" aria-hidden>
                      {chapter.icon}
                    </span>
                  )}
                </div>

                <div className="space-y-2 text-center sm:space-y-2.5 md:text-left">
                  <h3 className="font-headline text-base font-bold leading-snug text-on-surface transition-colors group-hover:text-primary-container sm:text-lg">
                    {chapter.title}
                  </h3>
                  <p className="text-xs text-on-surface-variant opacity-80 sm:text-sm leading-relaxed">
                    {chapter.description}
                  </p>
                  <div className="flex flex-wrap justify-center gap-1.5 pt-1 md:justify-start">
                    {chapter.tags.map(tag => (
                      <span
                        key={tag}
                        className="rounded-md bg-surface-container-highest px-2.5 py-0.5 font-label text-[10px] text-outline"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
