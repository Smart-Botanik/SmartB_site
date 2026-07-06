import { MaterialIcon } from "@/components/MaterialIcon";
import { siteEnv } from "@/lib/env";
import type { TelegramBlockSection } from "@/lib/site-sections";

type HomeTelegramBlockProps = TelegramBlockSection;

export function HomeTelegramBlock({
  title = "Telegram-канал SmartБотanik",
  text = "Короткие советы, анонсы новых статей и ссылки на полные руководства на сайте.",
  channelUrl,
  buttonLabel = "Подписаться на канал",
}: HomeTelegramBlockProps) {
  const href = channelUrl?.trim() || siteEnv.telegramUrl;

  return (
    <section className="mx-auto max-w-container-max px-gutter py-8">
      <div className="glass-effect relative overflow-hidden rounded-2xl border border-primary-container/10 p-8 md:p-10">
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-primary-container/10 blur-3xl" />
        <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex max-w-2xl items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary-container/15 text-primary-container">
              <MaterialIcon name="forum" className="text-3xl" filled />
            </div>
            <div>
              <h2 className="font-headline text-headline-mobile text-white md:text-headline">
                {title}
              </h2>
              {text ? (
                <p className="mt-2 font-body text-on-surface-variant opacity-90">{text}</p>
              ) : null}
            </div>
          </div>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-primary-container px-8 py-3 font-bold text-on-primary-container transition-all hover:shadow-[0_0_30px_rgba(0,255,157,0.3)] md:w-auto"
          >
            <MaterialIcon name="send" />
            {buttonLabel}
          </a>
        </div>
      </div>
    </section>
  );
}
