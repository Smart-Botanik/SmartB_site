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
    <section className="border-y border-outline-variant/10 bg-surface-container-low px-gutter py-12 dark:border-outline-variant/15 sm:py-20">
      <div className="mx-auto max-w-container-max">
        <div className="mb-8 text-center sm:mb-12">
          <h2 className="mb-1.5 font-headline text-xl text-on-surface sm:mb-2 sm:text-headline">
            База знаний
          </h2>
          <p className="font-body text-sm text-on-surface-variant opacity-70 sm:text-base">
            Гайды, закрутки, репорты и подборки — отдельные разделы базы знаний.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
          {chapters.map(chapter => {
            const accent = ACCENT_STYLES[chapter.accent];
            return (
              <Link
                key={chapter.id}
                href={chapter.href}
                className="glass-effect group flex flex-col items-center gap-4 rounded-2xl p-5 transition-all duration-300 hover:shadow-card-hover sm:gap-6 sm:p-8 md:flex-row md:items-start"
              >
                <div
                  className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border sm:h-24 sm:w-24 ${accent.iconBg} ${accent.iconBorder}`}
                >
                  {/^[a-z0-9_]+$/.test(chapter.icon) ? (
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
                <div className="space-y-2 text-center sm:space-y-3 md:text-left">
                  <h3 className="font-headline text-lg leading-snug text-on-surface sm:text-headline-mobile">
                    {chapter.title}
                  </h3>
                  <p className="text-xs text-on-surface-variant opacity-80 sm:text-sm">
                    {chapter.description}
                  </p>
                  <div className="flex flex-wrap justify-center gap-1 pt-0.5 sm:pt-1 md:justify-start">
                    {chapter.tags.map(tag => (
                      <span
                        key={tag}
                        className="rounded bg-surface-container-highest px-3 py-1 font-label text-[10px] text-outline"
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
    </section>
  );
}
