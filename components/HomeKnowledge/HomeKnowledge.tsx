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
    iconBorder: "border-outline-variant/30",
    iconColor: "text-on-surface-variant",
  },
};

type HomeKnowledgeProps = {
  chapters: KnowledgeChapter[];
};

export function HomeKnowledge({ chapters }: HomeKnowledgeProps) {
  return (
    <section className="border-y border-outline-variant/10 bg-surface-container-low px-gutter py-20">
      <div className="mx-auto max-w-container-max">
        <div className="mb-12 text-center">
          <h2 className="mb-2 font-headline text-headline text-white">База знаний</h2>
          <p className="font-body text-on-surface-variant opacity-70">
            Гайды, закрутки, репорты и подборки — всё для вашего цикла от семени до банки.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {chapters.map(chapter => {
            const accent = ACCENT_STYLES[chapter.accent];
            return (
              <Link
                key={chapter.id}
                href={chapter.href}
                className="glass-effect group flex flex-col items-center gap-6 rounded-2xl p-8 transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] md:flex-row md:items-start"
              >
                <div
                  className={`flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border ${accent.iconBg} ${accent.iconBorder}`}
                >
                  <MaterialIcon
                    name={chapter.icon}
                    className={`text-4xl ${accent.iconColor}`}
                    filled
                  />
                </div>
                <div className="space-y-3 text-center md:text-left">
                  <h3 className="font-headline text-headline-mobile text-white">
                    {chapter.title}
                  </h3>
                  <p className="text-sm text-on-surface-variant opacity-80">
                    {chapter.description}
                  </p>
                  <div className="flex flex-wrap justify-center gap-1 pt-1 md:justify-start">
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
