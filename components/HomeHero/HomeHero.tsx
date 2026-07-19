import Image from "next/image";

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

    <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden px-gutter py-20">

      <Image

        src="/hero-home-bg.png"

        alt=""

        fill

        priority

        sizes="100vw"

        className="object-cover object-center"

      />



      <div className="hero-scrim-vertical absolute inset-0" aria-hidden />

      <div className="hero-scrim-accent absolute inset-0" aria-hidden />

      <div className="hero-scrim-bottom absolute inset-0" aria-hidden />



      <div

        className="absolute top-1/4 -left-20 h-96 w-96 animate-pulse rounded-full blur-[100px]"

        style={{ backgroundColor: "var(--color-hero-glow-primary)" }}

        aria-hidden

      />

      <div

        className="absolute bottom-1/4 -right-20 h-96 w-96 rounded-full blur-[100px]"

        style={{ backgroundColor: "var(--color-hero-glow-secondary)" }}

        aria-hidden

      />



      <div className="relative z-10 mx-auto max-w-4xl space-y-6 text-center">

        <div className="flex flex-col items-center gap-3">

          <div className="hero-logo-glow">

            <Image

              src="/smart-botanik-logo-full.png"

              alt="SmartБотаник"

              width={680}

              height={482}

              className="hero-logo-glow-image block h-44 w-auto sm:h-52 md:h-64"

              priority

            />

          </div>



          <div className="hero-chip inline-flex items-center gap-1 rounded-full px-6 py-2">

            <MaterialIcon name="eco" className="text-[18px]" filled />

            <span className="font-label text-label uppercase tracking-widest">

              Точное выращивание

            </span>

          </div>

        </div>



        <h1 className="hero-title font-display text-display-mobile tracking-tighter md:text-[64px] md:leading-tight">

          {title.includes("\n") ? (

            title.split("\n").map((line, index) => (

              <span key={index}>

                {index > 0 ? <br /> : null}

                {line.includes("дневник") ? (

                  <>

                    {line.replace("дневник", "").trim()}{" "}

                    <span className="hero-accent text-glow italic">дневник</span>

                  </>

                ) : (

                  line

                )}

              </span>

            ))

          ) : title === "Интерактивный дневник вашего сада" ? (

            <>

              Интерактивный{" "}

              <span className="hero-accent text-glow italic">дневник</span>

              <br />

              вашего сада

            </>

          ) : (

            title

          )}

        </h1>



        <p className="hero-subtitle mx-auto max-w-2xl font-body text-base md:text-lg">

          {subtitle}

        </p>



        <div className="flex flex-col items-center justify-center gap-3 pt-4 sm:flex-row">

          <Link

            href={ctaHref}

            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-container px-8 py-2.5 text-sm font-semibold text-on-primary-container transition-all hover:shadow-accent-md sm:w-auto"

          >

            <MaterialIcon name="menu_book" className="text-[18px]" />

            {ctaLabel}

          </Link>

          <a

            href={siteEnv.telegramUrl}

            target="_blank"

            rel="noopener noreferrer"

            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/12 px-8 py-2.5 text-sm font-semibold text-[color:var(--color-hero-title)] backdrop-blur-md transition-all hover:bg-white/20 sm:w-auto"

          >

            <MaterialIcon name="send" className="text-[18px]" />

            Telegram-канал

          </a>

        </div>

      </div>

    </section>

  );

}


