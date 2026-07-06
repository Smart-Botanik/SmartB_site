import Link from "next/link";

import { MaterialIcon } from "@/components/MaterialIcon";
import { siteEnv } from "@/lib/env";

type HomeHeroProps = {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export function HomeHero({
  title = "Интерактивный дневник вашего сада",
  subtitle = "Отслеживайте полив, питание и стадии роста с точностью, которой доверяют опытные гроверы. Гайды, репорты и сообщество — в одном месте.",
  ctaLabel = "Смотреть гайды",
  ctaHref = "/guides",
}: HomeHeroProps) {
  return (
    <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden px-gutter py-20 hero-gradient">
      <div className="absolute top-1/4 -left-20 h-96 w-96 animate-pulse rounded-full bg-primary-container/10 blur-[100px]" />
      <div className="absolute bottom-1/4 -right-20 h-96 w-96 rounded-full bg-secondary-container/20 blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-4xl space-y-6 text-center">
        <div className="glass-effect mb-2 inline-flex items-center gap-1 rounded-full px-6 py-2 text-primary-fixed-dim">
          <MaterialIcon name="eco" className="text-[18px]" filled />
          <span className="font-label text-label uppercase tracking-widest">
            Точное выращивание
          </span>
        </div>

        <h1 className="font-display text-display-mobile tracking-tighter text-white md:text-[64px] md:leading-tight">
          {title.includes("\n") ? (
            title.split("\n").map((line, index) => (
              <span key={index}>
                {index > 0 ? <br /> : null}
                {line.includes("дневник") ? (
                  <>
                    {line.replace("дневник", "").trim()}{" "}
                    <span className="text-glow italic text-primary-container">дневник</span>
                  </>
                ) : (
                  line
                )}
              </span>
            ))
          ) : title === "Интерактивный дневник вашего сада" ? (
            <>
              Интерактивный{" "}
              <span className="text-glow italic text-primary-container">дневник</span>
              <br />
              вашего сада
            </>
          ) : (
            title
          )}
        </h1>

        <p className="mx-auto max-w-2xl font-body text-base text-on-surface-variant opacity-80 md:text-lg">
          {subtitle}
        </p>

        <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
          <Link
            href={ctaHref}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-primary-container px-12 py-3 font-bold text-on-primary-container transition-all hover:shadow-[0_0_30px_rgba(0,255,157,0.3)] sm:w-auto"
          >
            <MaterialIcon name="menu_book" />
            {ctaLabel}
          </Link>
          <a
            href={siteEnv.telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-outline-variant px-12 py-3 font-bold text-primary-fixed-dim transition-all hover:bg-surface-container-high sm:w-auto"
          >
            <MaterialIcon name="send" />
            Telegram-канал
          </a>
        </div>
      </div>
    </section>
  );
}
